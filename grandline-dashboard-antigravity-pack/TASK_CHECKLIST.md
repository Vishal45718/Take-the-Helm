# Grand Line Dashboard — Task Checklist
## Phase 0
- [ ] Inspect current files and behavior
- [ ] Create baseline backup
- [ ] Document current features and bugs
- [ ] Verify baseline

## Phase 1
- [x] Extract CSS to style.css
- [x] Extract JS to app.js
- [x] Remove dead/duplicate code
- [x] Verify visual/functional parity

## Phase 2
- [x] Move categories/links to config
- [x] Render dynamically
- [x] Validate config
- [x] Remove repeated hardcoded markup

## Phase 3
- [x] Versioned local state layer (Verified)
- [x] Replace alert() with toast/modal (Verified)
- [x] Functional settings panel
- [x] Reset/default handling

## Phase 4
- [x] Wallpaper picker/upload
- [x] Accent color
- [x] Glass opacity
- [x] Blur
- [x] Background overlay
- [x] Settings validation/hardening
- [x] Widget visibility
- [x] Persist preferences

## Phase 5
- [x] Google search
- [x] DuckDuckGo
- [x] Bing
- [x] Optional Brave
- [x] Provider selector + persistence
- [x] Search keyboard UX (Phase 5.1 complete)
- [x] Centralized searchEngines map (google, duckduckgo, bing, brave)
- [x] buildSearchUrl() pure helper — safe URL generation via encodeURIComponent
- [x] Provider validated through state.js validatePreferences()
- [x] test-search.js — 16 tests (providers, encoding, empty, invalid, persistence, reload, keyboard)

## Phase 6
- [ ] Widget abstraction
- [ ] Reliable Pomodoro
- [ ] Calendar polish
- [ ] Tasks
- [ ] Focus statistics

## Phase 7
- [ ] Drag/drop layout
- [ ] Keyboard shortcuts
- [ ] Command palette
- [ ] Responsive layout
- [ ] Accessibility

## Phase 8
- [ ] Versioned state/migrations
- [ ] Export/import
- [ ] Evaluate IndexedDB

## Phase 9
- [ ] Smoke tests
- [ ] Responsive test
- [ ] Accessibility test
- [ ] Performance audit
- [ ] Console-error cleanup
- [ ] Documentation
