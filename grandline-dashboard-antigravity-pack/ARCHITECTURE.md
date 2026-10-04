# Grand Line Dashboard — Architecture
Target: local-first plain HTML/CSS/JS unless the current project requires otherwise.

- Presentation: index.html, style.css
- Application: app.js/modules
- Configuration: categories, links, widget defaults
- State: versioned local preferences, tasks, focus, layout
- Assets: wallpapers/local assets

Avoid nth-child presentation hacks. Prefer semantic classes/data attributes.

State direction:
AppState
- version
- settings: wallpaper, accent, glassOpacity, blur, overlay
- links
- tasks
- widgets: visibility/layout
- search: provider
- focus: sessions/totals

Introduce fields only when their phase starts.
