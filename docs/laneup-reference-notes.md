# LaneUp Reference Notes

These notes were pulled from `C:\Users\YEBal\laneup-reference` in read-only mode. The source repo was not modified.

## Useful structure to carry into LaneUp2

- `manifest.json` defines separate background, desktop, and in-game windows.
- `background.html` acts as a silent controller page for lifecycle and hotkeys.
- `js/background.js` manages Overwolf window state and game event forwarding.
- `windows/desktop/*` and `windows/in-game/*` split the desktop app from the overlay experience.

## Product ideas worth keeping

- Dedicated hotkeys for both the main app and in-game overlay.
- A background service window that owns Overwolf event wiring.
- Lightweight in-game UI with champion select and live-game specific behavior.
- Riot lockfile reading through Overwolf IO instead of hardcoding LCU credentials.

## LaneUp2 direction

- Keep the React app as the single UI source of truth.
- Ship Overwolf wrapper files from `public/` so Vite copies them into `dist/`.
- Use query params to load the same React app in desktop or in-game modes.
