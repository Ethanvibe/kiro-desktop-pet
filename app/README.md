# Kiro Desktop Pet App Package

This directory is the KiroCrew-installable metadata package referenced by the repository's external registry. The native desktop client lives in `desktop/` and is distributed separately as macOS and Windows installers from GitHub Releases.

The App package is gateway-managed so KiroCrew copies its visual UI, the two transparent character images, and the minimal skin-setting route. Add the repository as an external registry on branch `main`, sync it, explicitly trust this third-party App, and install **Kiro Desktop Pet**. After enabling it, the **桌宠** entry with a Ghost icon appears in the Apps section of the KiroCrew sidebar. Choose either character there; the selection is persisted in the App data directory and is picked up automatically by the native transparent pet window.

For local manifest validation:

```bash
kirocrew app install /absolute/path/to/kiro-desktop-pet/app
kirocrew app enable kiro-desktop-pet
```

The desktop window itself contains only the transparent character image. Drag to move it; click it to switch between the supplied business and casual characters.
