# Grand Line Dashboard — Baseline Audit Report

**Date:** 2026-10-04  
**Phase:** 0 — Baseline and Safety  
**Status:** Baseline Completed  

---

## 1. Project Overview & File Structure

The project currently is a local-first single-page personal Firefox new-tab dashboard.

### File Tree
- [`index.html`](file:///home/jonsnow/firefox-newtab/index.html): Main dashboard file containing inline CSS (`<style>`), HTML structure, and inline JavaScript (`<script>`).
- [`index.backup.html`](file:///home/jonsnow/firefox-newtab/index.backup.html): A Python script wrapping an older variant of `index.html`.
- [`one_piece.jpg`](file:///home/jonsnow/firefox-newtab/one_piece.jpg): Local background wallpaper image asset.
- [`grandline-dashboard-antigravity-pack/`](file:///home/jonsnow/firefox-newtab/grandline-dashboard-antigravity-pack/): Project management documentation pack ([`AGENTS.md`](file:///home/jonsnow/firefox-newtab/grandline-dashboard-antigravity-pack/AGENTS.md), [`MASTER_PLAN.md`](file:///home/jonsnow/firefox-newtab/grandline-dashboard-antigravity-pack/MASTER_PLAN.md), [`ARCHITECTURE.md`](file:///home/jonsnow/firefox-newtab/grandline-dashboard-antigravity-pack/ARCHITECTURE.md), [`PHASE_STATUS.md`](file:///home/jonsnow/firefox-newtab/grandline-dashboard-antigravity-pack/PHASE_STATUS.md), [`TASK_CHECKLIST.md`](file:///home/jonsnow/firefox-newtab/grandline-dashboard-antigravity-pack/TASK_CHECKLIST.md), [`BUG_TRACKER.md`](file:///home/jonsnow/firefox-newtab/grandline-dashboard-antigravity-pack/BUG_TRACKER.md), [`PROMPTS.md`](file:///home/jonsnow/firefox-newtab/grandline-dashboard-antigravity-pack/PROMPTS.md), [`README.md`](file:///home/jonsnow/firefox-newtab/grandline-dashboard-antigravity-pack/README.md)).

---

## 2. Architecture & Tech Stack

- **Technology Stack:** Plain HTML5, CSS3, and native Vanilla JavaScript (ES6+). No build tools, transpliers, or framework dependencies.
- **Layout & Design:**
  - CSS Grid & Flexbox layout (`.page`, `.topbar`, `.content`, `.board-grid`, `.side`).
  - Glassmorphism aesthetic utilizing `backdrop-filter: blur(11px) saturate(125%)`, CSS variables (`--glass`, `--glass-strong`, `--glass-border`, `--accent`), and subtle linear gradients.
  - Brittle transparency workaround present: specific nth-child panels (`.board-grid > .panel:nth-child(3)`, `.board-grid > .panel:nth-child(5)`) have inline overridden backgrounds to reveal background character artwork.
- **State Management:**
  - Minimal unversioned state via `localStorage.getItem("focusSeconds")`.
  - Timer and calendar state held in in-memory JavaScript global variables (`calendarDate`, `remainingSeconds`, `timerId`, `focusRunningSeconds`).

---

## 3. Implemented Features & Modules

1. **Top Bar:**
   - **View Tabs:** Home vs. Projects tab switching (toggles `.active` classes on section elements).
   - **Search Shell:** Single search input form configured to redirect to Google Search (`https://www.google.com/search?q=...`). Keyboard shortcut `/` focuses input when not focused.
   - **Status Bar:** Displays location label ("Home"), accumulated focus time today (`focusValue`), live clock, and current date (`timeValue`, `dayLabel`).
2. **Home Board Grid:**
   - Categories: Work, AI, Entertainment, Learn, Social.
   - Links: Pre-populated hardcoded bookmark cards with Google S2 favicon service images (`https://www.google.com/s2/favicons?domain=...`).
3. **Projects View:**
   - Static list of 4 personal project cards (TrainPulse, Self-Healing RAG, Recommendation System, AETHER).
4. **Side Widgets:**
   - **Interactive Calendar:** Displays monthly view with next/previous month navigation and today highlight.
   - **Pomodoro Timer:** Preset modes (Focus 25m, Short Break 5m, Long Break 15m), play/pause, reset, skip. Updates accumulated `focusSeconds` in `localStorage` second-by-second during 25m focus sessions.
5. **Bottom-Right Navigation Controls:**
   - Menu button (`#menuButton` toggles `.menu-open` class on `.page`, but `.menu-open` styles are missing in CSS).
   - Settings button (`#settingsButton` triggers a browser `alert()`).
   - Add tab button (`#addProject` triggers a browser `alert()`).

---

## 4. Hardcoded Data & Data Flow

- **Bookmarks & Categories:** Entirely hardcoded inside DOM elements within `index.html` (lines 689–816).
- **Projects List:** Hardcoded HTML card elements in `index.html` (lines 824–841).
- **Search Provider:** Hardcoded to Google Search in form submit handler (`index.html` line 956).
- **Wallpaper:** Hardcoded image path `one_piece.jpg` in CSS `body` background declaration.

---

## 5. Identified Alerts, Bugs, and UX/Architectural Issues

- **ALERT UI (BUG-001):** Native browser `alert()` popups used for `#addProject` and `#settingsButton` actions.
- **NON-FUNCTIONAL CONTROLS (BUG-002):** Settings button does not open a modal or configuration drawer. Menu button toggles `.menu-open` CSS class on `.page`, but no corresponding styling exists in CSS.
- **HARDCODED CONTENT (BUG-003):** Bookmarks and category structures are hardcoded into HTML markup instead of being data-driven.
- **BRITTLE STYLING (BUG-004):** Usage of `.board-grid > .panel:nth-child(3)` and `.panel:nth-child(5)` selector rules for transparency adjustments.
- **STATIC WALLPAPER & THEME (BUG-005):** Wallpaper image path and CSS color theme variables are fixed.
- **FIXED SEARCH ENGINE (BUG-006):** Search engine engine button is static and submit target cannot be changed.
- **UNVERSIONED STATE (BUG-007):** `localStorage` only stores raw `focusSeconds` string without schema versioning or guard validation.
- **POMODORO RESILIENCE (BUG-015):** Timer state is lost on page reload; timer running seconds directly mutate `focusSeconds` every second rather than on session completion.

---

## 6. Next Steps & Phase Progression

With Phase 0 baseline audit documented, the project is ready for:
1. Updating `PHASE_STATUS.md` to reflect Phase 0 completion.
2. Proceeding to Phase 1 (Extract CSS/JS and clean structure).
