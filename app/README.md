# Kiro Desktop Pet App Package

This directory is the KiroCrew-installable metadata package referenced by the repository's external registry. The native desktop client lives in `desktop/` and is distributed separately as macOS and Windows installers from GitHub Releases.

The App package is self-managed and contains no gateway backend or executable registration. Add the repository as an external registry on branch `main`, sync it, and install **Kiro Desktop Pet**. After enabling it, the **桌宠** entry with a Ghost icon appears in the Apps section of the KiroCrew sidebar. That page provides platform downloads and launch guidance; the native pet continues running as a separate transparent always-on-top window.

For local manifest validation:

```bash
kirocrew app install /absolute/path/to/kiro-desktop-pet/app
kirocrew app enable kiro-desktop-pet
```

The desktop window itself contains only the transparent character image. Drag to move it; click it to switch between the supplied business and casual characters.
