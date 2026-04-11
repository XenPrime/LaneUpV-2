# LaneUp2

LaneUp2 is the React + TypeScript rewrite of the LaneUp Overwolf companion app for League of Legends. It provides role guides, champion select coaching, live in-game overlays, and post-game recaps for beginner players.

## Status

The app is a working Overwolf prototype with real LCU and Live Client integrations wired up. The following are connected:

- LCU polling for lobby preferences, champ select role detection, autofill detection, and post-game stats
- Live Client Data API for in-game stats (kills, deaths, cs, gold, game time)
- Overwolf game event listener for match start, match end, and player death
- All 5 role guides (Top, Jungle, Mid, ADC, Support) with Simple and Detailed modes
- Post-game recap screen with performance grade and focus areas
- Settings screen with Riot install path override and account config

## Tech stack

- React + TypeScript
- Vite (build tool)
- Plain CSS
- Overwolf platform (Windows only for live data)

## Project structure

```
src/
├── components/         # Screen-level UI (HomeScreen, ChampionSelectScreen, etc.)
├── data/               # Role content, mock state
├── hooks/
│   ├── useLaneUpRuntime.ts   # Core runtime: LCU polling, live client, game events
│   └── useRiotMatchHistory.ts
├── utils/
│   ├── lcu.ts          # LCU fetch wrapper (uses overwolf.web.sendHttpRequest in Overwolf)
│   ├── liveClient.ts   # Live Client Data API helpers
│   ├── overwolf.ts     # Overwolf API wrappers with isOverwolfAvailable() guards
│   └── riotApi.ts      # Riot API helpers (match history, requires API key)
├── App.tsx             # App shell, screen routing, state
├── types.ts            # Shared types
public/
├── manifest.json       # Overwolf manifest (windows at top level — required)
├── background.html     # Overwolf background page
├── js/
│   ├── background.js   # Background controller: game launch, hotkeys, window management
│   └── constants.js    # Shared constants
├── windows/
│   ├── desktop.html    # Redirects to index.html?shell=desktop
│   └── in-game.html    # Redirects to index.html?shell=in-game&screen=in-game
```

## Windows setup (to test in Overwolf)

### 1. Prerequisites

- Node.js 18+ installed
- Git installed
- Overwolf installed: https://www.overwolf.com/download
- League of Legends installed

### 2. Clone and install

```bash
git clone https://github.com/XenPrime/LaneUpV-2.git
cd LaneUpV-2
npm install
```

### 3. Build the app

The Overwolf windows load the built files from `dist/`, not the source files.  
You must run the build before loading it in Overwolf:

```bash
npm run build
```

This creates a `dist/` folder with the compiled app.

### 4. Load in Overwolf developer mode

1. Open Overwolf
2. Press `Ctrl+Alt+D` or go to **Settings → About → Enable Developer Mode**
3. Go to **Settings → Extensions** (or press `Ctrl+Alt+D` and find the Extension Viewer)
4. Click **Load unpacked extension**
5. Navigate to the `dist/` folder inside your cloned repo and select it
6. The LaneUp2 icon should appear in the Overwolf dock

### 5. Testing LCU connection

The app reads League's `lockfile` to get the LCU port and password. To test:

1. Launch League of Legends (the client, not a game)
2. Open LaneUp2 from the Overwolf dock
3. Go to the **Settings** screen — it shows LCU, Live Client, and Overwolf status indicators
4. If LCU shows `Searching`, the lockfile wasn't found — enter your League install path manually in the settings field (e.g. `C:\Riot Games\League of Legends`)
5. If LCU shows `Connected`, the champ select screen will auto-populate when you queue up

### 6. During a game

- The in-game overlay opens automatically when League launches (hotkey: `Ctrl+Shift+Space` to toggle)
- The desktop window can be toggled with `Ctrl+Shift+L`
- Live stats update every 2 seconds from `localhost:2999/liveclientdata/allgamedata`

### 7. After a game

The post-game screen auto-populates from the LCU end-of-game stats block. Navigate to it via the Post-Game tab.

## Browser preview (Mac or no Overwolf)

You can preview the UI in any browser without Overwolf:

```bash
npm run dev
```

Open the local Vite URL. All Overwolf-specific features (LCU, live data, hotkeys) will show as **Mock** mode, but all screens, role guides, and navigation work normally.

## Riot API key (optional — for match history only)

LCU and Live Client work without any Riot API key. The API key is only needed for the match history feature in the Profile screen.

1. Get a development key from https://developer.riotgames.com
2. Copy `.env.example` to `.env.local`
3. Set `RIOT_API_KEY=your_key_here`
4. Start the local proxy: `npm run dev:riot`
5. Run the app: `npm run dev`

Production key approval is pending — the rest of the app works without it.

## Known issues / TODO

- Death position heatmap requires match timeline data (needs production Riot API key)
- Post-game screen uses stats from LCU end-of-game block — only available immediately after the game ends before the client resets
- Overwolf window positions are not yet persisted between sessions

## Sending this to Claude

To continue development in a new session, paste this README into the chat along with any specific files you want reviewed or changed.
