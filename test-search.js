/**
 * test-search.js — Phase 5.1 Search Engine System Tests
 *
 * Tests the centralized search-provider system via two strategies:
 *   A. Pure-function tests on buildSearchUrl() — no DOM, no location mocking needed.
 *   B. Integration tests via JSDOM for state validation, persistence, and keyboard shortcut.
 *
 * Covers:
 *   1.  Google provider — correct base URL
 *   2.  DuckDuckGo provider — correct base URL
 *   3.  Bing provider — correct base URL
 *   4.  Brave provider — correct base URL
 *   5.  URL encoding — special characters
 *   6.  URL encoding — Unicode
 *   7.  URL encoding — spaces become %20
 *   8.  Empty query → null (no navigation)
 *   9.  Whitespace-only query → null
 *  10.  Invalid provider falls back to google in URL builder
 *  11.  Invalid provider rejected by state validation layer
 *  12.  Corrupted stored engine falls back on reload
 *  13.  Persistence round-trip (AppState → localStorage)
 *  14.  Reload preserves engine
 *  15.  "/" shortcut focuses search input
 *  16.  All four provider base URLs are unique and https://
 */

const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');

/* ── Suppress JSDOM noise ───────────────────────────────────── */
const vc = new VirtualConsole();
vc.on('jsdomError', () => {}); // suppress "Not implemented: navigation"

const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    resources: 'usable',
    url: 'http://localhost/',
    virtualConsole: vc
});
const window = dom.window;
const document = window.document;

/* ── Assertion helper ────────────────────────────────────────── */
function assert(condition, message) {
    if (!condition) throw new Error('FAIL: ' + message);
}

/* ─────────────────────────────────────────────────────────────── */

window.addEventListener('load', () => {
    try {
        window.eval(fs.readFileSync('state.js', 'utf8'));
        window.eval(fs.readFileSync('config.js', 'utf8'));
        window.eval(fs.readFileSync('app.js', 'utf8'));

        /* ── Grab the pure functions from the JSDOM window scope ── */
        const buildSearchUrl = window.buildSearchUrl;
        const searchEngines  = window.searchEngines;

        assert(typeof buildSearchUrl === 'function',
            'buildSearchUrl must be defined as a function in app.js');
        assert(searchEngines && typeof searchEngines === 'object',
            'searchEngines map must be defined in app.js');

        /* ════════════════════════════════════════════════════════
         * GROUP A — Pure function tests on buildSearchUrl()
         * ════════════════════════════════════════════════════════ */

        /* Test 1: Google */
        assert(
            buildSearchUrl('hello world', 'google') === 'https://www.google.com/search?q=hello%20world',
            `Test 1 (Google): got ${buildSearchUrl('hello world', 'google')}`
        );

        /* Test 2: DuckDuckGo */
        assert(
            buildSearchUrl('hello world', 'duckduckgo') === 'https://duckduckgo.com/?q=hello%20world',
            `Test 2 (DuckDuckGo): got ${buildSearchUrl('hello world', 'duckduckgo')}`
        );

        /* Test 3: Bing */
        assert(
            buildSearchUrl('hello world', 'bing') === 'https://www.bing.com/search?q=hello%20world',
            `Test 3 (Bing): got ${buildSearchUrl('hello world', 'bing')}`
        );

        /* Test 4: Brave */
        assert(
            buildSearchUrl('hello world', 'brave') === 'https://search.brave.com/search?q=hello%20world',
            `Test 4 (Brave): got ${buildSearchUrl('hello world', 'brave')}`
        );

        /* Test 5: Special characters */
        const specialExpected = 'https://www.google.com/search?q=' + encodeURIComponent('C++ & "async/await"');
        assert(
            buildSearchUrl('C++ & "async/await"', 'google') === specialExpected,
            `Test 5 (special chars): got ${buildSearchUrl('C++ & "async/await"', 'google')}`
        );

        /* Test 6: Unicode */
        const unicodeExpected = 'https://www.google.com/search?q=' + encodeURIComponent('日本語 テスト');
        assert(
            buildSearchUrl('日本語 テスト', 'google') === unicodeExpected,
            `Test 6 (Unicode): got ${buildSearchUrl('日本語 テスト', 'google')}`
        );

        /* Test 7: Spaces → %20 */
        const spaceUrl = buildSearchUrl('open source', 'google');
        assert(
            spaceUrl && spaceUrl.includes('%20'),
            `Test 7 (spaces→%20): got ${spaceUrl}`
        );

        /* Test 8: Empty query → null */
        assert(
            buildSearchUrl('', 'google') === null,
            'Test 8 (empty query): should return null'
        );

        /* Test 9: Whitespace-only query → null */
        assert(
            buildSearchUrl('   ', 'google') === null,
            'Test 9 (whitespace-only): should return null'
        );

        /* Test 10: Unknown provider falls back to Google in URL builder */
        const unknownProviderUrl = buildSearchUrl('test', 'yahoo');
        assert(
            unknownProviderUrl !== null &&
            unknownProviderUrl.startsWith('https://www.google.com/search?q='),
            `Test 10 (unknown provider fallback): got ${unknownProviderUrl}`
        );

        /* ════════════════════════════════════════════════════════
         * GROUP B — State validation and persistence tests
         * ════════════════════════════════════════════════════════ */

        /* Test 11: Invalid provider rejected by state validation layer */
        window.AppState.update({ preferences: { searchEngine: 'yahoo' } });
        assert(
            window.AppState.data.preferences.searchEngine === 'google',
            `Test 11 (state validation): invalid "yahoo" must fall back to "google", got: ${window.AppState.data.preferences.searchEngine}`
        );

        /* Test 12: Corrupted stored engine falls back on loadState() */
        window.localStorage.setItem('grandline_state', JSON.stringify({
            version: 1,
            focusSeconds: 0,
            preferences: {
                searchEngine: 'lycos',   // invalid
                wallpaper: 'one_piece.jpg',
                bgOpacity: 0.15,
                accentColor: '#5fae2d',
                glassBlur: 11,
                glassOpacity: 0.29,
                showStatus: true,
                showCalendar: true,
                showPomodoro: true
            }
        }));
        const reloadedBad = window.eval('loadState()');
        assert(
            reloadedBad.preferences.searchEngine === 'google',
            `Test 12 (reload bad engine): "lycos" must fall back to "google", got: ${reloadedBad.preferences.searchEngine}`
        );

        /* Test 13: Persistence round-trip */
        window.AppState.update({ preferences: { searchEngine: 'brave' } });
        assert(
            window.AppState.data.preferences.searchEngine === 'brave',
            'Test 13a (AppState update): engine not updated in AppState'
        );
        const stored = JSON.parse(window.localStorage.getItem('grandline_state'));
        assert(
            stored.preferences.searchEngine === 'brave',
            `Test 13b (localStorage persist): got ${stored.preferences.searchEngine}`
        );

        /* Test 14: Reload preserves engine */
        const reloaded = window.eval('loadState()');
        assert(
            reloaded.preferences.searchEngine === 'brave',
            `Test 14 (reload preserves engine): got ${reloaded.preferences.searchEngine}`
        );

        /* ════════════════════════════════════════════════════════
         * GROUP C — Keyboard and provider map integrity
         * ════════════════════════════════════════════════════════ */

        /* Test 15: "/" shortcut focuses search input */
        const input = document.getElementById('searchInput');
        input.blur();
        document.dispatchEvent(
            new window.KeyboardEvent('keydown', {
                key: '/',
                bubbles: true,
                cancelable: true
            })
        );
        assert(
            document.activeElement === input,
            'Test 15 ("/" shortcut): search input should be focused'
        );

        /* Test 16: All four provider base URLs are unique and use https:// */
        const PROVIDERS = ['google', 'duckduckgo', 'bing', 'brave'];
        PROVIDERS.forEach(k => {
            assert(k in searchEngines,
                `Test 16a (provider map): missing provider "${k}"`);
            assert(
                typeof searchEngines[k] === 'string' && searchEngines[k].startsWith('https://'),
                `Test 16b (provider https): "${k}" must start with https://, got: ${searchEngines[k]}`
            );
        });
        const allUrls  = PROVIDERS.map(k => searchEngines[k]);
        const uniqueSet = new Set(allUrls);
        assert(
            uniqueSet.size === allUrls.length,
            'Test 16c (unique URLs): all provider base URLs must be distinct'
        );

        console.log('SUCCESS: All Phase 5.1 search engine tests passed (16/16).');
        process.exit(0);
    } catch (e) {
        console.error(e.message || e);
        process.exit(1);
    }
});
