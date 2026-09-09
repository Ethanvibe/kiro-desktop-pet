# Kiro Desktop Pet App Package

This directory is the complete KiroCrew App referenced by the repository's external registry. Users add the public GitHub repository on branch `main`, sync Apps, trust only this repository-bound App, install it, and open **桌宠** from the sidebar.

The App runs entirely inside KiroCrew. It has no native desktop client, installer, backend route, network access, or external runtime. The page loads the two bundled transparent PNG files, shows one small character without a card or artificial background, switches skin when the character is clicked, and lets the user drag it within the page. Skin and position are remembered in the page's local browser storage.
