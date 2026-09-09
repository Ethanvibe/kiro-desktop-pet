# Kiro Desktop Pet

A small image-only pet that runs entirely inside KiroCrew. GitHub is the source of truth: users add this repository as an external App source, install the App, and use it directly from the KiroCrew sidebar. No separate desktop application, installer, or runtime is required.

## Features

- Runs entirely in the KiroCrew **桌宠** page
- Uses the two bundled transparent character images
- Displays one small character with no card or artificial background
- Click the character to switch between business and casual skins
- Drag the character anywhere within the page
- Remembers the selected skin and position in the page
- No backend, network access, native installer, or extra dependency

## Install from GitHub

Add this public repository as a KiroCrew external registry using branch `main`:

```text
https://github.com/Ethanvibe/kiro-desktop-pet
```

Sync Apps, trust only `kiro-desktop-pet` for this repository, install and enable it, then open **桌宠** from the Apps section of the KiroCrew sidebar.

## Repository layout

- `app-registry.json` — external registry index
- `app/app.json` — KiroCrew App manifest
- `app/ui/index.mjs` — self-contained KiroCrew page
- `app/ui/assets` — bundled transparent character images

## License

MIT
