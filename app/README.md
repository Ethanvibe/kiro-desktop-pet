# Kiro Desktop Pet App Package

This directory is the KiroCrew-installable metadata package referenced by the repository's external registry. The native desktop client lives in `desktop/` and is distributed separately as macOS and Windows installers from GitHub Releases.

The App package is self-managed and contains no gateway backend or executable registration. Add the repository as an external registry on branch `main`, sync it, and install **Kiro Desktop Pet**. Then install the native package for the local platform from the corresponding GitHub release.

For local manifest validation:

```bash
kirocrew app install /absolute/path/to/kiro-desktop-pet/app
kirocrew app enable kiro-desktop-pet
```

The desktop window itself contains only the transparent character image. Drag to move it; click it to switch between the supplied business and casual characters.
