# Kiro Desktop Pet App Package

This directory is the KiroCrew-installable package referenced by the repository's external registry.

The desktop client lives in `desktop/`. For the MVP, build or run the client manually, then install this directory into KiroCrew from the App Store's **Install from Path** section.

```bash
kirocrew app install /absolute/path/to/kiro-desktop-pet/app
kirocrew app enable kiro-desktop-pet
```

Public releases provide macOS and Windows installers. A later release will add platform-specific one-click installer handoff after both unsigned packages have been validated.
