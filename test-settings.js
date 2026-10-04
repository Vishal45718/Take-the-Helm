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
        
        // 1. Initial Apply Preferences is called on load
        assert(document.documentElement.style.getPropertyValue('--bg-image') === 'url("one_piece.jpg")', "Initial wallpaper wrong");
        
        // 2. Open Settings
        document.getElementById("settingsButton").click();
        let overlay = document.getElementById('settingsOverlay');
        assert(overlay !== null, "Settings overlay not created");
        assert(overlay.classList.contains('show'), "Settings not visible");
        
        // 3. Change settings
        document.getElementById('setWallpaper').value = "new_bg.png";
        document.getElementById('setAccentColor').value = "#ff0000";
        document.getElementById('setSearchEngine').value = "duckduckgo";
        
        // Apply settings
        document.getElementById('settingsApplyBtn').click();
        
        // Modal should be closed and toast should show
        assert(!overlay.classList.contains('show'), "Settings not closed after apply");
        assert(document.getElementById('toastOverlay').classList.contains('show'), "Toast not shown after apply");
        
        // Verify CSS variables updated
        assert(document.documentElement.style.getPropertyValue('--bg-image') === 'url("new_bg.png")', "Wallpaper not updated");
        assert(document.documentElement.style.getPropertyValue('--accent') === '#ff0000', "Accent not updated");
        
        // Verify AppState updated and persisted
        assert(window.AppState.data.preferences.searchEngine === "duckduckgo", "AppState not updated");
        assert(window.localStorage.getItem('grandline_state').includes('duckduckgo'), "LocalStorage not updated");
        
        // 4. Open Settings again and Reset
        document.getElementById("settingsButton").click();
        assert(overlay.classList.contains('show'), "Settings not opened second time");
        
        // Reset defaults
        document.getElementById('settingsResetBtn').click();
        assert(document.getElementById('setWallpaper').value === "one_piece.jpg", "Reset did not work on wallpaper field");
        
        // Apply reset settings
        document.getElementById('settingsApplyBtn').click();
        assert(document.documentElement.style.getPropertyValue('--bg-image') === 'url("one_piece.jpg")', "Reset wallpaper not applied");
        
        // 5. Test Escape to close
        document.getElementById("settingsButton").click();
        assert(overlay.classList.contains('show'), "Settings not opened third time");
        const event = new window.KeyboardEvent('keydown', { key: 'Escape' });
        document.dispatchEvent(event);
        assert(!overlay.classList.contains('show'), "Settings not closed by Escape");
        
        console.log("SUCCESS: All Settings panel tests passed.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
});
