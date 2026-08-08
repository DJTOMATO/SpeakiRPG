# Speaki RPG Electron Client

Speaki RPG is an unofficial Electron client for the browser MMORPG Speaki RPG with built-in Discord Rich Presence support.

This desktop wrapper improves your Speaki experience by automatically reading game stats from the page or clipboard and publishing your player name, level, and EXP to Discord.

## Key Features

- **Discord Rich Presence integration**
  - Share your current Speaki RPG status in Discord automatically.
  - Displays player name, level, and EXP progress where available.
- **Automatic page capture**
  - Reads player data directly from the game DOM when the game page is loaded.
  - Works even when the game is running in the Electron webview.
- **Clipboard fallback support**
  - Monitors clipboard changes and parses game text data if page DOM capture is unavailable.
- **Manual refresh shortcut**
  - Press `Ctrl+Shift+D` to force a Rich Presence update from the current game page.
- **Discord activity buttons**
  - Includes quick action buttons for the Speaki MMO website and the SpeakiRPG GitHub releases page.
- **Auto-updating presence**
  - Periodically refreshes presence after loading a game page and whenever the game stats change.

## Why use this app?

Speaki RPG is designed for players who want a lightweight desktop launcher for the web game while keeping their Discord friends informed about their progress.

The client is especially useful if you want:

- Rich presence updates without manually copying text.
- Automatic detection of player name and level.
- A consistent desktop interface for Speaki RPG.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/DJTOMATO/BetterSpeakiMMO.git
cd BetterSpeakiMMO
```

2. Install dependencies:

```bash
npm install
```

3. Run the app:

```bash
npm start
```

## Build for release

Build the Electron app using electron-builder:

```bash
npm run build
```

This project includes an `electron-builder` configuration for Windows NSIS packaging.

## Usage

- Open the client and navigate to the Speaki RPG login/game page.
- The app will attempt to capture your current player stats from the game page.
- If DOM capture is not available, it will read clipboard text and parse player stats from copied game data.
- Your self-updating Rich Presence is sent to Discord using the configured RPC client.

## Supported stats

- Player name
- Level
- EXP progress (when available)

## Known details

- This client is not affiliated with Speaki RPG’s official developers.
- The app does not ship any game assets.
- Discord Rich Presence buttons may depend on the Discord client and presence support.

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository.
2. Create a new branch for your changes.
3. Commit with clear messages.
4. Submit a pull request.

Issues and improvements are best tracked via GitHub issues.

## License

This project is licensed under the GNU License. See the `LICENSE` file for details.

## Support

For questions or bug reports, open an issue in this repository.
