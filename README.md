# LaneUp2

LaneUp2 is a coded secondary prototype for a beginner-focused League of Legends companion app built for the Overwolf platform. This version converts the earlier HTML prototype direction into a React + TypeScript app shell so the product can move toward real LCU and Live Client integrations.

## Current status

This repo now contains a working frontend prototype with:

- onboarding and quest selection
- fully written role guides for Support, Top, Jungle, Mid, and ADC
- champion select mismatch and autofill messaging
- an in-game overlay mock with live stat cards
- a post-game recap screen
- a settings screen ready for Overwolf persistence hooks

The Riot and Overwolf integrations are not wired yet, but the utility layer is in place for the next step.

## Tech stack

- React
- TypeScript
- Vite
- plain CSS with component-oriented structure

## Project structure

```text
src/
├── components/   # Screen-level UI pieces
├── data/         # Role content and mock app state
├── utils/        # LCU and Live Client helpers
├── App.tsx       # App shell and navigation
├── App.css       # Main app styling
├── index.css     # Global styles
└── types.ts      # Shared product types
```

## Getting started

```bash
npm install
npm run dev
```

Open the local Vite URL in your browser to explore the prototype.

## Temporary Riot dev key setup

For local development with Riot's 24-hour development key, do not put the key
directly in the frontend. Use the included local proxy instead.

1. Create a local env file based on `.env.example`
2. Set `RIOT_API_KEY` to your current dev key
3. Start the proxy:

```bash
npm run dev:riot
```

4. In another terminal, run the app:

```bash
npm run dev
```

The frontend can then call the local proxy at
`http://localhost:8787/api/riot`. This keeps the temporary key out of the
client bundle and out of GitHub.

## Next recommended steps

1. Scaffold the Overwolf app shell with manifest and window config.
2. Replace mock state with real LCU polling for lobby and champ select.
3. Connect `localhost:2999/liveclientdata/allgamedata` for in-game updates.
4. Add persistence for active quest, hotkeys, and overlay preferences.
5. Break the screen components into reusable overlay and panel primitives if this prototype becomes the production base.
