# Antigravity Prompts — Use One at a Time

## 00 — Baseline
```text
Audit the current Grand Line dashboard before changing anything. Inspect every project file, current architecture, features, hardcoded data, alerts, state handling, and bugs. Create BASELINE.md with findings and update PHASE_STATUS.md. Do not refactor yet.
```

## 01 — Backup
```text
Create a safe baseline backup/tag of the current dashboard and document restoration. Do not change application behavior. Update PHASE_STATUS.md.
```

## 02 — Extract CSS
```text
Move all CSS from index.html into style.css without changing visual behavior. Preserve selectors where possible. Verify the dashboard visually and fix any regressions.
```

## 03 — Extract JavaScript
```text
Move dashboard JavaScript from index.html into app.js without changing behavior. Preserve all functionality and remove only clearly dead code. Verify there are no console errors.
```

## 04 — Config
```text
Move all hardcoded categories and links into one configuration module and render the existing UI from it. Preserve the exact current links and layout. Do not add features.
```

## 05 — Config Validation
```text
Add lightweight validation for categories, IDs, names, and URLs. Fail safely with useful developer-facing errors. Do not add a backend.
```

## 06 — State Layer
```text
Create a small versioned localStorage state layer with defaults and corrupted-data recovery. Preserve existing user data where possible. Do not add IndexedDB or cloud sync.
```

## 07 — Replace Alerts
```text
Remove every alert() and replace it with a reusable glassmorphism toast/modal matching the current UI. Preserve messages and behavior. Support Escape/click dismissal.
```

## 08 — Real Settings
```text
Turn the settings control into a functional settings panel with close, Escape, and reset-to-default behavior. Do not add future theme features yet.
```

## 09 — Wallpaper
```text
Implement local wallpaper selection and upload. Keep the current One Piece wallpaper as the default personal wallpaper. Persist the selected wallpaper locally without changing the layout.
```

## 10 — Theme Controls
```text
Add accent color, glass opacity, blur intensity, and background overlay controls using CSS variables instead of nth-child hacks. Preserve current values as defaults and persist them locally.
```

## 11 — Search Providers
```text
Refactor search into a provider system supporting Google, DuckDuckGo, and Bing. Add a provider selector and persist the choice. Keep the current provider as default.
```

## 12 — Search UX
```text
Improve search UX with keyboard focus, Enter-to-search, Escape-to-clear, and visible provider state. Keep the existing visual language.
```

## 13 — Widget Architecture
```text
Introduce a minimal widget abstraction for existing widgets without adding new widgets. Keep all existing widgets working.
```

## 14 — Tasks
```text
Add a local task widget with create, complete, delete, and persistence using the shared state layer. Match the existing glass UI.
```

## 15 — Pomodoro
```text
Make Pomodoro state reliable: prevent duplicate timers, survive reloads safely, and record completed sessions in local focus statistics.
```

## 16 — Focus Stats
```text
Add a local daily/weekly focus-statistics view based only on recorded Pomodoro sessions. Keep it lightweight and readable.
```

## 17 — Calendar
```text
Audit and polish the calendar widget. Fix verified date, timezone, state, or rendering issues. Do not add external calendar sync.
```

## 18 — Drag/Drop
```text
Add drag-and-drop widget positioning with a local layout model, persistence, stable defaults, and reset-layout.
```

## 19 — Shortcuts
```text
Add configurable keyboard shortcuts for search and selected configured links. Do not hijack browser/system shortcuts. Show shortcuts in settings.
```

## 20 — Command Palette
```text
Add a lightweight keyboard-first command palette for configured links, categories, search, and settings.
```

## 21 — Responsive
```text
Perform a responsive pass for desktop, tablet, and narrow screens. Prevent overflow, clipping, and unreadable widgets while preserving the desktop composition.
```

## 22 — Accessibility
```text
Perform an accessibility pass: semantic labels, keyboard navigation, focus states, button/link semantics, reduced motion, and adequate contrast without destroying the glass aesthetic.
```

## 23 — Export/Import
```text
Implement validated JSON export/import for dashboard configuration and local preferences. Never replace valid state with malformed imported data.
```

## 24 — Quality Audit
```text
Audit console errors, broken links, configuration, state recovery, responsive behavior, accessibility, performance, and dead code. Fix only verified issues and update all status files.
```

## 25 — Documentation
```text
Create a concise README covering architecture, local setup, configuration, state storage, wallpaper handling, customization, known limitations, and deferred features.
```
