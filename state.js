/* ---------------- Versioned State Layer ---------------- */

const STATE_KEY = "grandline_state";
const STATE_VERSION = 1;

const DEFAULT_PREFERENCES = {
    wallpaper: "one_piece.jpg",
    bgOpacity: 0.15,
    accentColor: "#5fae2d",
    glassBlur: 11,
    glassOpacity: 0.29,
    searchEngine: "google",
    showStatus: true,
    showCalendar: true,
    showPomodoro: true
};

const DEFAULT_STATE = {
    version: STATE_VERSION,
    focusSeconds: 0,
    preferences: { ...DEFAULT_PREFERENCES }
};

function getLegacyFocusSeconds() {
    try {
        const legacy = localStorage.getItem("focusSeconds");
        if (legacy !== null) {
            const val = Number(legacy);
            if (!isNaN(val)) return val;
        }
    } catch (e) {
        console.warn("Could not read legacy focusSeconds", e);
    }
    return 0;
}

function validatePreferences(prefs) {
    if (!prefs || typeof prefs !== "object") return { ...DEFAULT_PREFERENCES };
    const validated = {};
    
    if (typeof prefs.wallpaper === "string" && prefs.wallpaper.trim()) {
        validated.wallpaper = prefs.wallpaper.trim();
    } else {
        validated.wallpaper = DEFAULT_PREFERENCES.wallpaper;
    }

    if (typeof prefs.bgOpacity === "number" && !isNaN(prefs.bgOpacity)) {
        validated.bgOpacity = Math.max(0, Math.min(1, prefs.bgOpacity));
    } else {
        validated.bgOpacity = DEFAULT_PREFERENCES.bgOpacity;
    }
    
    if (typeof prefs.accentColor === "string" && /^#[0-9A-Fa-f]{3,8}$/.test(prefs.accentColor.trim())) {
        let hex = prefs.accentColor.trim();
        if (hex.length === 4) {
            hex = '#' + hex[1]+hex[1] + hex[2]+hex[2] + hex[3]+hex[3];
        }
        validated.accentColor = hex;
    } else {
        validated.accentColor = DEFAULT_PREFERENCES.accentColor;
    }

    if (typeof prefs.glassBlur === "number" && !isNaN(prefs.glassBlur)) {
        validated.glassBlur = Math.max(0, Math.min(40, prefs.glassBlur));
    } else {
        validated.glassBlur = DEFAULT_PREFERENCES.glassBlur;
    }
    
    if (typeof prefs.glassOpacity === "number" && !isNaN(prefs.glassOpacity)) {
        validated.glassOpacity = Math.max(0, Math.min(1, prefs.glassOpacity));
    } else {
        validated.glassOpacity = DEFAULT_PREFERENCES.glassOpacity;
    }
    
    const validEngines = ["google", "duckduckgo", "bing", "brave"];
    if (typeof prefs.searchEngine === "string" && validEngines.includes(prefs.searchEngine.trim().toLowerCase())) {
        validated.searchEngine = prefs.searchEngine.trim().toLowerCase();
    } else {
        validated.searchEngine = DEFAULT_PREFERENCES.searchEngine;
    }
    
    validated.showStatus = typeof prefs.showStatus === "boolean" ? prefs.showStatus : DEFAULT_PREFERENCES.showStatus;
    validated.showCalendar = typeof prefs.showCalendar === "boolean" ? prefs.showCalendar : DEFAULT_PREFERENCES.showCalendar;
    validated.showPomodoro = typeof prefs.showPomodoro === "boolean" ? prefs.showPomodoro : DEFAULT_PREFERENCES.showPomodoro;

    return validated;
}

function loadState() {
    try {
        const raw = localStorage.getItem(STATE_KEY);
        if (!raw) {
            const legacyFocus = getLegacyFocusSeconds();
            const initialState = { ...DEFAULT_STATE, focusSeconds: legacyFocus };
            saveState(initialState);
            try { localStorage.removeItem("focusSeconds"); } catch (e) {}
            return initialState;
        }

        const data = JSON.parse(raw);
        
        if (!data || typeof data !== "object") {
            throw new Error("Invalid state format");
        }
        
        const state = { ...DEFAULT_STATE, ...data, version: STATE_VERSION };
        state.preferences = validatePreferences(data.preferences);
        
        try {
            localStorage.removeItem("focusSeconds");
        } catch (e) {}

        return state;
    } catch (e) {
        console.error("State load failed, falling back to defaults. Error:", e);
        // Corrupted-data recovery: reset to defaults
        const fallbackState = { ...DEFAULT_STATE };
        saveState(fallbackState);
        return fallbackState;
    }
}

function saveState(state) {
    try {
        localStorage.setItem(STATE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error("Failed to save state:", e);
    }
}

window.AppState = {
    data: loadState(),
    save() {
        saveState(this.data);
    },
    update(updates) {
        if (updates.preferences) {
            updates.preferences = validatePreferences({ ...this.data.preferences, ...updates.preferences });
        }
        this.data = { ...this.data, ...updates };
        this.save();
    },
    defaultPreferences: DEFAULT_PREFERENCES
};
