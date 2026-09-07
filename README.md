# Kiro Desktop Pet

A lightweight floating desktop companion for KiroCrew, built with Tauri 2 and vanilla TypeScript. It supports macOS and Windows, transparent always-on-top windows, drag-to-move interaction, and persistent outfit switching.

## MVP features

- Transparent, borderless, always-on-top pet window
- Drag the pet anywhere on the desktop
- Click to open a radial action menu
- Outfit-first interaction with business and casual skins
- Selected outfit persists across launches
- Task, rest, and hide quick actions
- Cross-platform GitHub Actions release builds
- KiroCrew external registry metadata

## Repository layout

- `app-registry.json` — external registry index
- `app/app.json` — KiroCrew App manifest
- `app/desktop` — Tauri desktop application
- `mockups` — approved concept-C design evidence

## Development

Requirements: Node.js 22+, Rust stable, and the platform prerequisites from the Tauri 2 documentation.

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

GitHub Actions builds macOS and Windows installers when a version tag such as `v0.1.0` is pushed.

## KiroCrew external registry

Add this public repository as an external registry using branch `main`, then sync apps. During local development, install the app manifest directly from the `app` directory.

## License

MIT
