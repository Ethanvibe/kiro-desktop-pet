# Kiro Desktop Pet App Package

This directory is the complete KiroCrew App referenced by the repository's external registry. Users add the public GitHub repository on branch `main`, sync Apps, trust this repository-bound App, install it, and enable it.

On macOS, KiroCrew runs the lifecycle hook in `backend/hooks.py`. The hook starts the bundled `native/macos/overlay.js` through the system `osascript` runtime and closes it when the App is disabled or KiroCrew exits. The helper creates a transparent, borderless, always-on-top Cocoa panel; clicking the character switches skin and dragging moves it anywhere on the desktop. Skin and screen position are stored under the App's own data directory.

The App requires KiroCrew Desktop and macOS. It downloads no dependency, opens no network connection, and installs no separate application.
