#  Grand Line Dashboard — Take the Helm

A sleek, local-first, glassmorphism new-tab dashboard for **Firefox** and modern web browsers. Built with zero dependencies, 100% native HTML5, CSS3, and Vanilla JavaScript (ES6+).

---

##  Features

- ** Glassmorphism & Theme Customization**
  - Custom background wallpaper URLs and local asset support.
  - Dynamic background overlay opacity control ($0.0 - 1.0$).
  - Adjustable glass blur strength ($0\text{px} - 30\text{px}$) and opacity.
  - Customizable accent color picker with CSS variable integration.

- **🔍 Multi-Provider Search System**
  - Instant selection between **Google**, **DuckDuckGo**, **Bing**, and **Brave Search**.
  - Safe URI encoding (`encodeURIComponent`) for query parameters and Unicode strings.
  - Quick-focus keyboard shortcut (`/` key to focus the search bar).

- ** Pomodoro & Focus Time Tracker**
  - Built-in timer with presets for **Focus (25m)**, **Short Break (5m)**, and **Long Break (15m)**.
  - Second-by-second focus time tracking persisted across sessions.

- ** Interactive Calendar & Clock**
  - Monthly calendar navigator with today-highlighting and smooth navigation.
  - Real-time clock and day display.

- ** Config-Driven Bookmark & Project Hub**
  - Dynamic category rendering (**Work**, **AI**, **Entertainment**, **Learn**, **Social**) via [`config.js`](file:///home/jonsnow/firefox-newtab/config.js).
  - Clean project showcase cards for personal projects and quick links.

- ** Hardened State Management Layer**
  - Schema-versioned local storage integration ([`state.js`](file:///home/jonsnow/firefox-newtab/state.js)).
  - Automated state sanitization, boundary clamping, hex-color normalization, and graceful fallback to defaults on corrupted state.

- ** Dynamic Widget Visibility Toggles**
  - Settings drawer toggles to selectively show or hide the status bar, calendar, and Pomodoro widgets.

---

##  Repository Architecture

```
firefox-newtab/
├── index.html              # Main dashboard HTML shell
├── app.js                  # UI controller, event listeners, search engine & widget logic
├── config.js               # Centralized configuration (categories, bookmarks, projects)
├── state.js                # Versioned state persistence, validation & localStorage layer
├── style.css               # Glassmorphism design system, layout & CSS custom properties
├── one_piece.jpg           # Default background wallpaper asset
├── package.json            # Node.js project manifest & test scripts
├── test-state.js           # Unit tests for state persistence & schema migrations
├── test-hardening.js       # Tests for input validation, clamping & fallback defaults
├── test-settings.js        # Integration tests for settings drawer & live applying
├── test-toast.js           # Integration tests for modal overlays & toast notifications
├── test-visibility.js      # Integration tests for widget visibility toggling
├── test-wallpaper.js       # Integration tests for wallpaper overlay & CSS variable application
└── test-search.js          # Comprehensive suite (16 tests) for search engine logic
```

---

##  Quick Start & How to Run

Because **Grand Line Dashboard** is built with zero framework dependencies, running it is instantaneous.

### Option 1: Direct File Opening
Simply double-click [`index.html`](file:///home/jonsnow/firefox-newtab/index.html) or open it directly in your browser:
```bash
# Linux / macOS
firefox index.html

# Or open via file URL in any browser:
# file:///path/to/firefox-newtab/index.html
```

### Option 2: Local HTTP Server (Recommended)
You can serve the directory using any static file server:

**Using Python:**
```bash
python3 -m http.server 8080
```
Then navigate to `http://localhost:8080` in your browser.

**Using Node (`npx`):**
```bash
npx serve .
```

### Option 3: Set as Firefox New Tab Page
1. Install a Firefox add-on such as **Custom New Tab Page** or **New Tab Override**.
2. Set the custom URL to `http://localhost:8080` or your local file path `file:///absolute/path/to/firefox-newtab/index.html`.

---

## 🧪 Testing & Verification Commands

The repository features an automated Node.js + `jsdom` unit and integration test suite covering state durability, settings validation, DOM updates, toast overlays, and multi-provider search logic.

### 1. Install Dependencies
Before running tests for the first time, install the required dev dependencies (`jsdom`):
```bash
npm install
```

### 2. Run Complete Test Suite
To run all test suites at once:
```bash
npm test
```

*Expected output:*
```text
SUCCESS: All state-layer tests passed.
SUCCESS: All Settings Hardening tests passed.
SUCCESS: All Settings panel tests passed.
SUCCESS: All toast modal tests passed.
SUCCESS: All Widget Visibility tests passed.
SUCCESS: All Wallpaper Overlay tests passed.
SUCCESS: All Phase 5.1 search engine tests passed (16/16).
```

### 3. Run Individual Test Modules
You can also run specific test scripts individually:

- **State Layer & Migrations:**
  ```bash
  node test-state.js
  ```

- **Settings Hardening & Clamping:**
  ```bash
  node test-hardening.js
  ```

- **Settings Panel & Live Updates:**
  ```bash
  node test-settings.js
  ```

- **Toast Notifications & Modals:**
  ```bash
  node test-toast.js
  ```

- **Widget Visibility:**
  ```bash
  node test-visibility.js
  ```

- **Wallpaper Overlay:**
  ```bash
  node test-wallpaper.js
  ```

- **Search Engine Provider System:**
  ```bash
  node test-search.js
  ```

---

## 🔧 Configuration & Customization

### Modifying Bookmarks & Projects
To add or edit your bookmarks, categories, and project cards, edit [`config.js`](file:///home/jonsnow/firefox-newtab/config.js):

```javascript
const DASHBOARD_CONFIG = {
  categories: [
    {
      id: "work",
      title: "Work",
      links: [
        { name: "GitHub", url: "https://github.com", icon: "github" },
        // Add more links here...
      ]
    }
  ],
  projects: [
    {
      title: "Project Name",
      description: "Brief summary of the project",
      tags: ["Tag1", "Tag2"],
      link: "https://example.com"
    }
  ]
};
```

---

##  License

Distributed under the MIT License. See `LICENSE` for details.
