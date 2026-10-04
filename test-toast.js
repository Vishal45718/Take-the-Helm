const fs = require('fs');
const { JSDOM } = require("jsdom");

const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
const window = dom.window;
const document = window.document;

// Mock localStorage for app.js/state.js
const store = {};
window.localStorage = {
    getItem(key) { return store[key] || null; },
    setItem(key, value) { store[key] = String(value); },
    removeItem(key) { delete store[key]; }
};

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

window.addEventListener('load', () => {
    try {
        // Evaluate state.js
        const stateCode = fs.readFileSync('state.js', 'utf8');
        window.eval(stateCode);

        // Evaluate config.js
        const configCode = fs.readFileSync('config.js', 'utf8');
        window.eval(configCode);
        
        // Evaluate app.js
        const appCode = fs.readFileSync('app.js', 'utf8');
        window.eval(appCode);
        
        // Ensure no alert calls
        assert(!appCode.includes('alert('), "alert() call found in app.js");
        
        // 1. Click Add Project
        const addProjectBtn = document.getElementById("addProject");
        assert(addProjectBtn, "Add Project button not found");
        addProjectBtn.click();
        
        let overlay = document.getElementById('toastOverlay');
        assert(overlay !== null, "Toast overlay not created");
        assert(overlay.classList.contains('show'), "Toast overlay not visible");
        assert(document.getElementById('toastMessage').textContent === "You can add more tabs later by editing the project section.", "Wrong message for add project");
        
        // Close with button
        const closeBtn = overlay.querySelector('.toast-close');
        assert(closeBtn, "Close button not found");
        closeBtn.click();
        assert(!overlay.classList.contains('show'), "Toast not hidden after clicking close");
        
        // 2. Click Settings & Save to check toast
        const settingsBtn = document.getElementById("settingsButton");
        assert(settingsBtn, "Settings button not found");
        settingsBtn.click();
        
        const settingsOverlay = document.getElementById('settingsOverlay');
        assert(settingsOverlay && settingsOverlay.classList.contains('show'), "Settings overlay not opened");
        
        const applyBtn = document.getElementById('settingsApplyBtn');
        assert(applyBtn, "Settings apply button not found");
        applyBtn.click();
        
        assert(overlay.classList.contains('show'), "Toast overlay not visible after saving settings");
        assert(document.getElementById('toastMessage').textContent.includes("Settings applied!"), "Wrong message for settings save");
        
        // Close with Escape
        const event = new window.KeyboardEvent('keydown', { key: 'Escape' });
        document.dispatchEvent(event);
        assert(!overlay.classList.contains('show'), "Toast not hidden after Escape key");
        
        console.log("SUCCESS: All toast modal tests passed.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
});
