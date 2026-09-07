# Kiro Desktop Pet

A lightweight image-only desktop companion for KiroCrew, built with Tauri 2 and vanilla TypeScript. It supports macOS and Windows, keeps only the supplied character artwork visible in a transparent always-on-top window, and remembers the selected character.

## MVP features

- Transparent, borderless, always-on-top pet window
- No card, status pill, menu, artificial backdrop, or window chrome
- Drag the character anywhere on the desktop
- Click the character to switch between the supplied business and casual images
- Selected character persists across launches
- Cross-platform GitHub Actions release builds
- KiroCrew external registry metadata

## Repository layout

- `app-registry.json` — external registry index
- `app/app.json` — KiroCrew App manifest
- `app/desktop` — Tauri desktop application
- `mockups` — approved concept-C design evidence

## Development

Requirements: Node.js 22+, Rust 1.88+, and the platform prerequisites from the Tauri 2 documentation.

```bash
cd app/desktop
npm install
npm run tauri dev
```

## Build

```bash
cd app/desktop
npm install
npm run tauri build
```

GitHub Actions builds macOS and Windows installers when a version tag such as `v0.1.1` is pushed.

## KiroCrew external registry

Add this public repository as an external registry using branch `main`, then sync apps. During local development, install the app manifest directly from the `app` directory.

## License

MIT
