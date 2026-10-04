/* ---------------- Versioned State Layer ---------------- */

const STATE_KEY = "grandline_state";
const STATE_VERSION = 1;

const DEFAULT_STATE = {
    version: STATE_VERSION,
    focusSeconds: 0,
    preferences: {}
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

function loadState() {
    try {
        const raw = localStorage.getItem(STATE_KEY);
        if (!raw) {
            // First time loading new state, try to migrate legacy
            const legacyFocus = getLegacyFocusSeconds();
            const initialState = { ...DEFAULT_STATE, focusSeconds: legacyFocus };
            saveState(initialState);
            return initialState;
        }

        const data = JSON.parse(raw);
        
        // Corrupted-data recovery
        if (!data || typeof data !== "object") {
            throw new Error("Invalid state format");
        }
        
        // Merge with defaults to ensure all keys exist
        const state = { ...DEFAULT_STATE, ...data, version: STATE_VERSION };
        
        // Remove legacy item if it exists and we successfully loaded new state
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
        this.data = { ...this.data, ...updates };
        this.save();
    }
};
