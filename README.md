# Kiro Desktop Pet

A transparent, always-on-top desktop pet launched and managed by KiroCrew on macOS. GitHub is the source of truth: users add this repository as an external App source, install and enable the App, and KiroCrew starts the native helper automatically. There is no separate installer or application to manage.

## Features

- Floats anywhere on the macOS desktop, outside the KiroCrew window
- Uses a transparent, borderless, always-on-top native Cocoa panel
- Uses the two bundled transparent character images
- Click the character to switch between business and casual skins
- Drag the character anywhere across the screen and Spaces
- Remembers the selected skin and screen position
- Starts with the KiroCrew App and closes when the App is disabled or KiroCrew exits
- No network access, downloaded dependency, or separate installation

## Requirements

- macOS
- KiroCrew Desktop (the browser dashboard cannot create native windows)

## Install from GitHub

Add this public repository as a KiroCrew external registry using branch `main`:

```text
https://github.com/Ethanvibe/kiro-desktop-pet
```

Sync Apps, trust only `kiro-desktop-pet` for this repository, install and enable it. The desktop pet appears automatically; the **桌宠** sidebar page remains available as an in-KiroCrew preview.

## Repository layout

- `app-registry.json` — external registry index
- `app/app.json` — KiroCrew App manifest
- `app/backend/hooks.py` — starts and stops the native helper with the App lifecycle
- `app/native/macos/overlay.js` — dependency-free Cocoa overlay hosted by macOS `osascript`
- `app/ui/index.mjs` — self-contained KiroCrew preview page
- `app/ui/assets` — bundled transparent character images

## License

MIT
