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

        // 1. Test invalid updates via AppState.update()
        window.AppState.update({
            preferences: {
                wallpaper: "  ", // whitespace only should fallback to default
                bgOpacity: 5, // out of bounds, should clamp to 1
                glassBlur: -10, // out of bounds, should clamp to 0
                glassOpacity: "not a number", // should fallback to default
                accentColor: "invalid", // invalid hex
                searchEngine: "yahoo" // invalid engine, should fallback to default
            }
        });

        const prefs = window.AppState.data.preferences;
        const defaults = window.AppState.defaultPreferences;

        assert(prefs.wallpaper === defaults.wallpaper, "Wallpaper did not fallback on whitespace");
        assert(prefs.bgOpacity === 1, "bgOpacity did not clamp to 1");
        assert(prefs.glassBlur === 0, "glassBlur did not clamp to 0");
        assert(prefs.glassOpacity === defaults.glassOpacity, "glassOpacity did not fallback on NaN");
        assert(prefs.accentColor === defaults.accentColor, "accentColor did not fallback on invalid hex");
        assert(prefs.searchEngine === defaults.searchEngine, "searchEngine did not fallback on invalid engine");

        // 2. Test valid updates
        window.AppState.update({
            preferences: {
                wallpaper: " custom.jpg ", // should trim
                bgOpacity: 0.5,
                glassBlur: 20,
                glassOpacity: 0.8,
                accentColor: "#fff", // should normalize to #ffffff
                searchEngine: " Duckduckgo " // should trim and lowercase
            }
        });

        const validPrefs = window.AppState.data.preferences;
        assert(validPrefs.wallpaper === "custom.jpg", "Wallpaper did not trim");
        assert(validPrefs.bgOpacity === 0.5, "bgOpacity was not updated");
        assert(validPrefs.glassBlur === 20, "glassBlur was not updated");
        assert(validPrefs.glassOpacity === 0.8, "glassOpacity was not updated");
        assert(validPrefs.accentColor === "#ffffff", "accentColor was not normalized");
        assert(validPrefs.searchEngine === "duckduckgo", "searchEngine was not trimmed/lowercased");

        // 3. Test persistence and reloading corrupted state
        window.localStorage.setItem('grandline_state', JSON.stringify({
            version: 1,
            preferences: {
                wallpaper: 123, // wrong type
                bgOpacity: 99, // out of bounds
                accentColor: "#GHI" // invalid hex
            }
        }));

        // Reload state by simulating loadState()
        const loadedData = window.eval('loadState()');
        assert(loadedData.preferences.wallpaper === defaults.wallpaper, "Reloaded wallpaper did not fallback");
        assert(loadedData.preferences.bgOpacity === 1, "Reloaded bgOpacity did not clamp to 1");
        assert(loadedData.preferences.accentColor === defaults.accentColor, "Reloaded accentColor did not fallback");
        
        console.log("SUCCESS: All Settings Hardening tests passed.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
});
