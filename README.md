# Minecraft Mixin Reference Tracker

A website that lists Minecraft repositories in order of how many other repositories on GitHub reference them in mixins.

![Minecraft Mixin Reference Tracker](https://img.shields.io/badge/Minecraft-Mixin%20Tracker-purple)

## Overview

This website tracks and displays Minecraft-related repositories that are commonly targeted by [SpongePowered Mixin](https://github.com/SpongePowered/Mixin) - a bytecode manipulation framework used extensively in Minecraft modding. It helps mod developers understand which libraries, APIs, and mods are most frequently extended or modified by other mods.

## Features

- **Ranked Repository List**: Repositories sorted by mixin reference count
- **Search & Filter**: Find repos by name, description, or category
- **Multiple Sort Options**: Sort by references, stars, or name
- **Detailed Information**: View common mixin targets and notes for each repo
- **Modern UI**: Dark theme with responsive design
- **Modal Details**: Click any repo for detailed information

## Categories Tracked

- **Base Game**: Minecraft itself
- **Modding Platforms**: Fabric API, Forge, Quilt
- **Performance Mods**: Sodium, Lithium
- **Graphics Mods**: Iris Shaders, Continuity
- **Content Mods**: Create, Botania, Applied Energistics 2
- **Modding Libraries**: Architectury, Cloth Config, GeckoLib
- **Utility Mods**: Mod Menu, REI, JourneyMap

## What are Mixins?

Mixins are a powerful bytecode manipulation framework used in Minecraft modding. They allow developers to:

- Inject code into existing Minecraft classes
- Modify method behavior without changing source code
- Maintain compatibility across different mods
- Hook into game events and behaviors

## Getting Started

### Prerequisites

- Node.js 14+ installed

### Installation

```bash
# Install dependencies
npm install

# Start the server
npm start
```

The website will be available at `http://localhost:3000`

## Project Structure

```
minecraft-mixin-reference-website/
├── public/
│   ├── index.html    # Main HTML page
│   ├── styles.css    # Styling
│   ├── app.js        # Frontend JavaScript
│   └── data.js       # Repository data
├── server.js         # Express server
├── package.json      # Project configuration
└── README.md         # This file
```

## Data Sources

The mixin reference counts are estimates based on:
- GitHub search data for mixin configurations
- Analysis of popular modding repositories
- Community knowledge about common mixin targets

## Contributing

Feel free to submit pull requests to:
- Add new repositories to the tracking list
- Update mixin reference counts
- Improve the UI/UX
- Add new features

## Related Links

- [SpongePowered Mixin](https://github.com/SpongePowered/Mixin) - The mixin framework
- [FabricMC](https://fabricmc.net/) - Fabric modding toolchain
- [MinecraftForge](https://minecraftforge.net/) - Forge modding platform
- [QuiltMC](https://quiltmc.org/) - Quilt modding toolchain

## License

MIT License - See LICENSE file for details
