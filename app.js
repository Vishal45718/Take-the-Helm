/* ---------------- Search ---------------- */

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");

const searchEngines = {
    google: "https://www.google.com/search?q=",
    duckduckgo: "https://duckduckgo.com/?q=",
    bing: "https://www.bing.com/search?q=",
    brave: "https://search.brave.com/search?q="
};

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const query = searchInput.value.trim();
    if (!query) return;

    const engine = AppState.data.preferences.searchEngine || "google";
    const baseUrl = searchEngines[engine] || searchEngines.google;
    window.location.href = baseUrl + encodeURIComponent(query);
});

document.addEventListener("keydown", (event) => {
    if (
        event.key === "/" &&
        document.activeElement !== searchInput
    ) {
        event.preventDefault();
        searchInput.focus();
    }
});

/* ---------------- Top status ---------------- */

const focusValue = document.getElementById("focusValue");

function renderFocus() {
    const minutes = Math.floor(AppState.data.focusSeconds / 60);
    focusValue.textContent = `${minutes}m`;
}

renderFocus();

function updateClock() {
    const now = new Date();

    const time = now.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit"
    });

    const day = now.toLocaleDateString([], {
        weekday: "short",
        month: "short",
        day: "numeric"
    });

    document.getElementById("timeValue").textContent = time;
    document.getElementById("dayLabel").textContent = day;
}

updateClock();
setInterval(updateClock, 1000);

/* ---------------- Dynamic Dashboard Rendering ---------------- */

function renderDashboard() {
    if (typeof validateDashboardConfig === "function" && typeof DASHBOARD_CONFIG !== "undefined") {
        validateDashboardConfig(DASHBOARD_CONFIG);
    }

    const boardGrid = document.getElementById("boardGrid");
    const projectList = document.getElementById("projectList");

    if (boardGrid && typeof DASHBOARD_CONFIG !== "undefined" && Array.isArray(DASHBOARD_CONFIG.categories)) {
        boardGrid.innerHTML = "";

        DASHBOARD_CONFIG.categories.forEach((category) => {
            const panel = document.createElement("section");
            panel.className = "panel";

            const heading = document.createElement("h2");
            heading.textContent = category.title;
            panel.appendChild(heading);

            const linkList = document.createElement("div");
            linkList.className = "link-list";

            if (Array.isArray(category.links)) {
                category.links.forEach((link) => {
                    const linkRow = document.createElement("a");
                    linkRow.className = "link-row";
                    linkRow.href = link.url;
                    linkRow.target = link.target || "_blank";
                    linkRow.rel = link.rel || "noopener";

                    const img = document.createElement("img");
                    img.className = "favicon";
                    img.src = link.icon;
                    img.alt = "";

                    const span = document.createElement("span");
                    span.className = "link-name";
                    span.textContent = link.name;

                    linkRow.appendChild(img);
                    linkRow.appendChild(span);
                    linkList.appendChild(linkRow);
                });
            }

            panel.appendChild(linkList);
            boardGrid.appendChild(panel);
        });
    }

    if (projectList && DASHBOARD_CONFIG && Array.isArray(DASHBOARD_CONFIG.projects)) {
        projectList.innerHTML = "";

        DASHBOARD_CONFIG.projects.forEach((project) => {
            const projectItem = document.createElement("div");
            projectItem.className = "project-item";

            const h3 = document.createElement("h3");
            h3.textContent = project.title;

            const p = document.createElement("p");
            p.textContent = project.description;

            projectItem.appendChild(h3);
            projectItem.appendChild(p);
            projectList.appendChild(projectItem);
        });
    }
}

renderDashboard();

/* ---------------- Tabs ---------------- */

const tabs = document.querySelectorAll(".tab");
const homeView = document.getElementById("homeView");
const projectsView = document.getElementById("projectsView");

tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        const view = tab.dataset.view;
        homeView.style.display = view === "home" ? "block" : "none";
        projectsView.classList.toggle("active", view === "projects");
    });
});

/* ---------------- Calendar ---------------- */

const monthTitle = document.getElementById("monthTitle");
const calendarDays = document.getElementById("calendarDays");

let calendarDate = new Date();

function renderCalendar() {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    monthTitle.textContent = new Date(year, month, 1).toLocaleDateString([], {
        month: "long",
        year: "numeric"
    });

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevLastDate = new Date(year, month, 0).getDate();

    const cells = [];

    for (let i = firstDay - 1; i >= 0; i--) {
        cells.push({
            day: prevLastDate - i,
            muted: true
        });
    }

    for (let day = 1; day <= lastDate; day++) {
        cells.push({
            day,
            muted: false
        });
    }

    while (cells.length % 7 !== 0) {
        cells.push({
            day: cells.length - lastDate - firstDay + 1,
            muted: true
        });
    }

    calendarDays.innerHTML = "";

    cells.forEach((cell) => {
        const el = document.createElement("div");
        el.className = "day" + (cell.muted ? " muted" : "");

        if (
            !cell.muted &&
            cell.day === new Date().getDate() &&
            month === new Date().getMonth() &&
            year === new Date().getFullYear()
        ) {
            el.classList.add("today");
        }

        el.textContent = cell.day;
        calendarDays.appendChild(el);
    });
}

document.getElementById("prevMonth").addEventListener("click", () => {
    calendarDate.setMonth(calendarDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById("nextMonth").addEventListener("click", () => {
    calendarDate.setMonth(calendarDate.getMonth() + 1);
    renderCalendar();
});

renderCalendar();

/* ---------------- Pomodoro ---------------- */

const timerDisplay = document.getElementById("timer");
const startTimer = document.getElementById("startTimer");
const resetTimer = document.getElementById("resetTimer");
const skipTimer = document.getElementById("skipTimer");
const playIcon = document.getElementById("playIcon");
const pauseIcon = document.getElementById("pauseIcon");
const pomoTabs = document.querySelectorAll(".pomo-tab");

let selectedMinutes = 25;
let remainingSeconds = selectedMinutes * 60;
let timerId = null;
let focusRunningSeconds = 0;

function renderTimer() {
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;

    timerDisplay.textContent =
        `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function setPlaying(playing) {
    playIcon.style.display = playing ? "none" : "block";
    pauseIcon.style.display = playing ? "block" : "none";
}

function stopTimer() {
    clearInterval(timerId);
    timerId = null;
    setPlaying(false);
}

function startOrPause() {
    if (timerId) {
        stopTimer();
        return;
    }

    timerId = setInterval(() => {
        remainingSeconds--;

        if (selectedMinutes === 25) {
            focusRunningSeconds++;
            AppState.data.focusSeconds++;
            AppState.save();
            renderFocus();
        }

        if (remainingSeconds <= 0) {
            remainingSeconds = selectedMinutes * 60;
            stopTimer();
        }

        renderTimer();
    }, 1000);

    setPlaying(true);
}

function resetCurrentTimer() {
    stopTimer();
    remainingSeconds = selectedMinutes * 60;
    renderTimer();
}

function changeMode(minutes, button) {
    selectedMinutes = minutes;

    pomoTabs.forEach((tab) => tab.classList.remove("active"));
    button.classList.add("active");

    resetCurrentTimer();
}

pomoTabs.forEach((button) => {
    button.addEventListener("click", () => {
        changeMode(Number(button.dataset.minutes), button);
    });
});

startTimer.addEventListener("click", startOrPause);
resetTimer.addEventListener("click", resetCurrentTimer);

skipTimer.addEventListener("click", () => {
    remainingSeconds = 0;
    stopTimer();
    renderTimer();
});

renderTimer();

/* ---------------- Toast Notification ---------------- */

function showToast(message) {
    let overlay = document.getElementById('toastOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'toastOverlay';
        overlay.className = 'toast-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        
        const modal = document.createElement('div');
        modal.className = 'toast-modal';
        
        const msgEl = document.createElement('div');
        msgEl.className = 'toast-message';
        msgEl.id = 'toastMessage';
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'toast-close';
        closeBtn.textContent = 'Dismiss';
        
        modal.appendChild(msgEl);
        modal.appendChild(closeBtn);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        const closeToast = () => {
            overlay.classList.remove('show');
        };
        
        closeBtn.addEventListener('click', closeToast);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeToast();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('show')) {
                closeToast();
            }
        });
    }
    
    document.getElementById('toastMessage').textContent = message;
    overlay.classList.add('show');
    const closeBtn = overlay.querySelector('.toast-close');
    setTimeout(() => closeBtn.focus(), 50);
}

/* ---------------- Buttons ---------------- */

document.getElementById("addProject").addEventListener("click", () => {
    showToast("You can add more tabs later by editing the project section.");
});

document.getElementById("menuButton").addEventListener("click", () => {
    document.querySelector(".page").classList.toggle("menu-open");
});

/* ---------------- Settings Panel ---------------- */

function applyPreferences(prefs) {
    document.documentElement.style.setProperty('--bg-image', `url("${prefs.wallpaper}")`);
    document.documentElement.style.setProperty('--accent', prefs.accentColor);
    
    // Convert hex to rgb for accent-soft
    const hex = prefs.accentColor.replace('#', '');
    const r = parseInt(hex.substring(0,2), 16);
    const g = parseInt(hex.substring(2,4), 16);
    const b = parseInt(hex.substring(4,6), 16);
    document.documentElement.style.setProperty('--accent-soft', `rgba(${r}, ${g}, ${b}, 0.22)`);
    
    document.documentElement.style.setProperty('--glass-blur', `${prefs.glassBlur}px`);
    document.documentElement.style.setProperty('--glass-opacity', prefs.glassOpacity);
    if (prefs.bgOpacity !== undefined) {
        document.documentElement.style.setProperty('--bg-overlay', prefs.bgOpacity);
    }
    
    document.body.classList.toggle('hide-status', !prefs.showStatus);
    document.body.classList.toggle('hide-calendar', !prefs.showCalendar);
    document.body.classList.toggle('hide-pomodoro', !prefs.showPomodoro);
}

// Apply initially
applyPreferences(AppState.data.preferences);

function showSettings() {
    let overlay = document.getElementById('settingsOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'settingsOverlay';
        overlay.className = 'toast-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        
        overlay.innerHTML = `
            <div class="toast-modal" style="text-align: left; max-width: 450px;">
                <h2 style="margin-top: 0; margin-bottom: 20px;">Settings</h2>
                <div class="settings-form">
                    <div class="settings-row">
                        <label class="settings-label">Wallpaper URL</label>
                        <input type="text" id="setWallpaper" class="settings-input" style="flex:1;">
                    </div>
                    <div class="settings-row">
                        <label class="settings-label">Background Overlay</label>
                        <input type="range" id="setBgOpacity" min="0" max="1" step="0.05" class="settings-input" style="flex:1;">
                    </div>
                    <div class="settings-row">
                        <label class="settings-label">Accent Color</label>
                        <input type="color" id="setAccentColor" class="settings-input">
                    </div>
                    <div class="settings-row">
                        <label class="settings-label">Glass Blur</label>
                        <input type="range" id="setGlassBlur" min="0" max="40" step="1" class="settings-input" style="flex:1;">
                    </div>
                    <div class="settings-row">
                        <label class="settings-label">Glass Opacity</label>
                        <input type="range" id="setGlassOpacity" min="0" max="1" step="0.05" class="settings-input" style="flex:1;">
                    </div>
                    <div class="settings-row">
                        <label class="settings-label">Search Engine</label>
                        <select id="setSearchEngine" class="settings-input" style="flex:1;">
                            <option value="google">Google</option>
                            <option value="duckduckgo">DuckDuckGo</option>
                            <option value="bing">Bing</option>
                            <option value="brave">Brave</option>
                        </select>
                    </div>
                    <div class="settings-row">
                        <label class="settings-label">Show Status/Clock</label>
                        <input type="checkbox" id="setShowStatus">
                    </div>
                    <div class="settings-row">
                        <label class="settings-label">Show Calendar</label>
                        <input type="checkbox" id="setShowCalendar">
                    </div>
                    <div class="settings-row">
                        <label class="settings-label">Show Pomodoro</label>
                        <input type="checkbox" id="setShowPomodoro">
                    </div>
                </div>
                <div class="settings-actions">
                    <button class="settings-btn" id="settingsResetBtn">Reset</button>
                    <button class="settings-btn" id="settingsCloseBtn">Close</button>
                    <button class="settings-btn primary" id="settingsApplyBtn">Apply</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        
        const closeOverlay = () => overlay.classList.remove('show');
        
        document.getElementById('settingsCloseBtn').addEventListener('click', closeOverlay);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeOverlay();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('show')) {
                closeOverlay();
            }
        });
        
        document.getElementById('settingsApplyBtn').addEventListener('click', () => {
            const newPrefs = {
                wallpaper: document.getElementById('setWallpaper').value,
                bgOpacity: Number(document.getElementById('setBgOpacity').value),
                accentColor: document.getElementById('setAccentColor').value,
                glassBlur: Number(document.getElementById('setGlassBlur').value),
                glassOpacity: Number(document.getElementById('setGlassOpacity').value),
                searchEngine: document.getElementById('setSearchEngine').value,
                showStatus: document.getElementById('setShowStatus').checked,
                showCalendar: document.getElementById('setShowCalendar').checked,
                showPomodoro: document.getElementById('setShowPomodoro').checked
            };
            AppState.update({ preferences: newPrefs });
            const validatedPrefs = AppState.data.preferences;
            
            document.getElementById('setWallpaper').value = validatedPrefs.wallpaper;
            document.getElementById('setBgOpacity').value = validatedPrefs.bgOpacity;
            document.getElementById('setAccentColor').value = validatedPrefs.accentColor;
            document.getElementById('setGlassBlur').value = validatedPrefs.glassBlur;
            document.getElementById('setGlassOpacity').value = validatedPrefs.glassOpacity;
            document.getElementById('setSearchEngine').value = validatedPrefs.searchEngine;
            document.getElementById('setShowStatus').checked = validatedPrefs.showStatus;
            document.getElementById('setShowCalendar').checked = validatedPrefs.showCalendar;
            document.getElementById('setShowPomodoro').checked = validatedPrefs.showPomodoro;

            applyPreferences(validatedPrefs);
            closeOverlay();
            showToast("Settings applied!");
        });
        
        document.getElementById('settingsResetBtn').addEventListener('click', () => {
            const defaults = AppState.defaultPreferences;
            document.getElementById('setWallpaper').value = defaults.wallpaper;
            document.getElementById('setBgOpacity').value = defaults.bgOpacity !== undefined ? defaults.bgOpacity : 0.15;
            document.getElementById('setAccentColor').value = defaults.accentColor;
            document.getElementById('setGlassBlur').value = defaults.glassBlur;
            document.getElementById('setGlassOpacity').value = defaults.glassOpacity;
            document.getElementById('setSearchEngine').value = defaults.searchEngine;
            document.getElementById('setShowStatus').checked = defaults.showStatus;
            document.getElementById('setShowCalendar').checked = defaults.showCalendar;
            document.getElementById('setShowPomodoro').checked = defaults.showPomodoro;
        });
    }
    
    // Load current values
    const prefs = AppState.data.preferences;
    document.getElementById('setWallpaper').value = prefs.wallpaper;
    document.getElementById('setBgOpacity').value = prefs.bgOpacity !== undefined ? prefs.bgOpacity : 0.15;
    document.getElementById('setAccentColor').value = prefs.accentColor;
    document.getElementById('setGlassBlur').value = prefs.glassBlur;
    document.getElementById('setGlassOpacity').value = prefs.glassOpacity;
    document.getElementById('setSearchEngine').value = prefs.searchEngine;
    document.getElementById('setShowStatus').checked = prefs.showStatus !== undefined ? prefs.showStatus : true;
    document.getElementById('setShowCalendar').checked = prefs.showCalendar !== undefined ? prefs.showCalendar : true;
    document.getElementById('setShowPomodoro').checked = prefs.showPomodoro !== undefined ? prefs.showPomodoro : true;
    
    overlay.classList.add('show');
}

document.getElementById("settingsButton").addEventListener("click", () => {
    showSettings();
});
