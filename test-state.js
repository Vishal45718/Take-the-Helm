const fs = require('fs');

let store = {};
global.localStorage = {
    getItem(key) { return store[key] || null; },
    setItem(key, value) { store[key] = String(value); },
    removeItem(key) { delete store[key]; }
};
global.window = {};

// Suppress console outputs for testing
const originalWarn = console.warn;
const originalError = console.error;
console.warn = () => {};
console.error = () => {};

const stateCode = fs.readFileSync('state.js', 'utf8');
eval(stateCode);

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function runTests() {
    try {
        // Test 1: First load (no existing data)
        store = {};
        window.AppState.data = loadState();
        assert(window.AppState.data.focusSeconds === 0, "Test 1 failed: focusSeconds should be 0");
        assert(window.AppState.data.version === 1, "Test 1 failed: version should be 1");

        // Test 2: Legacy focusSeconds migration
        store = {};
        store['focusSeconds'] = '1500';
        window.AppState.data = loadState();
        assert(window.AppState.data.focusSeconds === 1500, "Test 2 failed: legacy focusSeconds not migrated");
        assert(!store['focusSeconds'], "Test 2 failed: legacy focusSeconds not removed");
        assert(store['grandline_state'], "Test 2 failed: state not saved after migration");

        // Test 3: Saving focusSeconds & Reload persistence
        window.AppState.update({ focusSeconds: 2000 });
        assert(window.AppState.data.focusSeconds === 2000, "Test 3 failed: update didn't change data");
        const reloaded1 = loadState();
        assert(reloaded1.focusSeconds === 2000, "Test 3 failed: data not persisted");

        // Test 4: Corrupted JSON
        store['grandline_state'] = '{corrupted_json:';
        const reloaded2 = loadState();
        assert(reloaded2.focusSeconds === 0, "Test 4 failed: corrupted JSON should reset to default focusSeconds");
        assert(reloaded2.version === 1, "Test 4 failed: corrupted JSON should reset version");

        // Test 5: Missing fields
        store['grandline_state'] = JSON.stringify({ focusSeconds: 500 }); // missing version and preferences
        const reloaded3 = loadState();
        assert(reloaded3.focusSeconds === 500, "Test 5 failed: focusSeconds not loaded");
        assert(reloaded3.version === 1, "Test 5 failed: version not restored");
        assert(typeof reloaded3.preferences === 'object', "Test 5 failed: preferences not restored");

        console.log("SUCCESS: All state-layer tests passed.");
    } catch (e) {
        originalError(e.message);
        process.exit(1);
    }
}

runTests();
