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
        
        // 1. Default overlay
        let bgOverlay = document.documentElement.style.getPropertyValue('--bg-overlay');
        assert(bgOverlay === '0.15', "Default background overlay should be 0.15, got " + bgOverlay);
        
        // 2. Open settings and change it
        document.getElementById("settingsButton").click();
        let overlay = document.getElementById('settingsOverlay');
        
        document.getElementById('setBgOpacity').value = "0.75";
        
        // Apply settings (Live application and persistence)
        document.getElementById('settingsApplyBtn').click();
        
        bgOverlay = document.documentElement.style.getPropertyValue('--bg-overlay');
        assert(bgOverlay === '0.75', "Background overlay not updated live, got " + bgOverlay);
        
        assert(window.AppState.data.preferences.bgOpacity === 0.75, "AppState not updated with new bgOpacity");
        assert(window.localStorage.getItem('grandline_state').includes('"bgOpacity":0.75'), "LocalStorage not updated with bgOpacity");
        
        // 3. Reset
        document.getElementById("settingsButton").click();
        document.getElementById('settingsResetBtn').click();
        
        assert(document.getElementById('setBgOpacity').value === "0.15", "Reset did not work on bgOpacity field");
        
        document.getElementById('settingsApplyBtn').click();
        bgOverlay = document.documentElement.style.getPropertyValue('--bg-overlay');
        assert(bgOverlay === '0.15', "Reset bgOpacity not applied to DOM");
        
        console.log("SUCCESS: All Wallpaper Overlay tests passed.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
});
