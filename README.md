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

## Next recommended steps

1. Scaffold the Overwolf app shell with manifest and window config.
2. Replace mock state with real LCU polling for lobby and champ select.
3. Connect `localhost:2999/liveclientdata/allgamedata` for in-game updates.
4. Add persistence for active quest, hotkeys, and overlay preferences.
5. Break the screen components into reusable overlay and panel primitives if this prototype becomes the production base.
