<div align="center">
  <img src="public/icon.ico" alt="Fernlaunch" width="128" />
  
  # 🌿 Fernlaunch
  
  **A modern, open-source Minecraft launcher built with Electron & React**
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
  [![GitHub release](https://img.shields.io/github/v/release/FernLauncher/fernlauncher)](https://github.com/FernLauncher/fernlauncher/releases)
  [![Platform](https://img.shields.io/badge/platform-Windows-blue)](https://github.com/FernLauncher/fernlauncher/releases)

</div>

---

## Features

### Game Support
- Vanilla Minecraft (all versions)
- **Fabric**, **Quilt**, **Forge** (1.8.9, 1.12.2, 1.21+), **NeoForge**
- Auto Java detection & download (Java 8, 17, 21)

### Instance Management
- Create, copy, export & import instances
- Instance groups & custom icons
- Per-instance settings (memory, Java, JVM args, resolution)
- Playtime tracking

### Mod Management
- Browse & install mods from **Modrinth** and **CurseForge**
- Auto-install mod dependencies
- Resource pack & shader pack browser
- Server list manager

### Modpack Support
- **Modrinth** modpacks (fully automatic)
- **CurseForge** modpacks (with manual download fallback for blocked files)
- Live installation progress

### Other Features
- Microsoft account authentication
- Dark / Light / System theme
- English & French translations
- Auto-updater via GitHub Releases
- Console window with colored logs
- Screenshots viewer
- Minecraft log viewer

---

## Installation

Download the latest installer from the [Releases](https://github.com/FernLauncher/fernlauncher/releases) page.

**Requirements:**
- Windows 10/11 (64-bit)
- Internet connection for first setup

Java is automatically downloaded if not found on your system.

---

## Building from Source

**Prerequisites:**
- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/)

```bash
# Clone the repository
git clone https://github.com/FernLauncher/fernlauncher.git
cd fernlauncher

# Install dependencies
pnpm install

# Run in development mode
pnpm run dev

# Build installer
pnpm run dist
```

---

## Translations

Currently available:
- 🇺🇸 English (100%)
- 🇫🇷 Français (20%)

---

## Roadmap

- [ ] ATLauncher / FTB / Technic modpack support
- [ ] Offline account support
- [ ] macOS & Linux support
- [ ] More language translations
- [ ] Mod update checker

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">
  Made with 🌿 by <a href="https://github.com/FernLauncher">FernLauncher</a>
</div>