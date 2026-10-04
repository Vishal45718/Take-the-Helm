const fs = require('fs');
const { JSDOM } = require("jsdom");

const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable", url: "http://localhost/" });
const window = dom.window;
const document = window.document;

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

window.addEventListener('load', () => {
    try {
        window.eval(fs.readFileSync('state.js', 'utf8'));
        window.eval(fs.readFileSync('config.js', 'utf8'));
        window.eval(fs.readFileSync('app.js', 'utf8'));

        // 1. Defaults should be true, classes shouldn't be present
        assert(window.AppState.data.preferences.showStatus === true, "Default showStatus should be true");
        assert(window.AppState.data.preferences.showCalendar === true, "Default showCalendar should be true");
        assert(window.AppState.data.preferences.showPomodoro === true, "Default showPomodoro should be true");
        assert(!document.body.classList.contains('hide-status'), "hide-status class should not be present");
        assert(!document.body.classList.contains('hide-calendar'), "hide-calendar class should not be present");
        assert(!document.body.classList.contains('hide-pomodoro'), "hide-pomodoro class should not be present");

        // 2. Open Settings, uncheck toggles, and apply
        document.getElementById("settingsButton").click();
        
        document.getElementById('setShowStatus').checked = false;
        document.getElementById('setShowPomodoro').checked = false;

        document.getElementById('settingsApplyBtn').click();

        // 3. Check live updates and persistence
        assert(window.AppState.data.preferences.showStatus === false, "AppState showStatus not updated");
        assert(window.AppState.data.preferences.showCalendar === true, "AppState showCalendar incorrectly updated");
        assert(window.AppState.data.preferences.showPomodoro === false, "AppState showPomodoro not updated");

        assert(document.body.classList.contains('hide-status'), "hide-status class not applied");
        assert(!document.body.classList.contains('hide-calendar'), "hide-calendar class should not be applied");
        assert(document.body.classList.contains('hide-pomodoro'), "hide-pomodoro class not applied");

        const rawState = window.localStorage.getItem('grandline_state');
        assert(rawState.includes('"showStatus":false'), "showStatus not persisted to localStorage");
        assert(rawState.includes('"showPomodoro":false'), "showPomodoro not persisted to localStorage");

        // 4. Test reload simulation
        const loadedData = window.eval('loadState()');
        assert(loadedData.preferences.showStatus === false, "Reloaded showStatus not correct");
        assert(loadedData.preferences.showPomodoro === false, "Reloaded showPomodoro not correct");

        // 5. Test reset
        document.getElementById("settingsButton").click();
        document.getElementById('settingsResetBtn').click();
        
        assert(document.getElementById('setShowStatus').checked === true, "Reset did not work on showStatus input");
        assert(document.getElementById('setShowPomodoro').checked === true, "Reset did not work on showPomodoro input");

        document.getElementById('settingsApplyBtn').click();

        assert(!document.body.classList.contains('hide-status'), "hide-status class not removed after reset");
        assert(!document.body.classList.contains('hide-pomodoro'), "hide-pomodoro class not removed after reset");

        console.log("SUCCESS: All Widget Visibility tests passed.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
});
