import type { RuntimeStatus } from '../types'

interface SettingsScreenProps {
  runtimeStatus: RuntimeStatus
}

function formatStatus(status: RuntimeStatus[keyof RuntimeStatus]) {
  if (typeof status === 'boolean' || status === null) {
    return String(status)
  }

  return status
}

export function SettingsScreen({ runtimeStatus }: SettingsScreenProps) {
  return (
    <section className="screen-stack">
      <div className="section-header">
        <div>
          <p className="eyebrow">Preferences and Overwolf hooks</p>
          <h2>Settings</h2>
        </div>
      </div>

      <div className="two-column">
        <article className="panel">
          <p className="eyebrow">Overlay controls</p>
          <ul className="bullet-list">
            <li>Toggle overlay hotkey with support for remapping later.</li>
            <li>Move overlay to a second monitor when available.</li>
            <li>Keep the panel pinned, hidden, or context-aware by phase.</li>
          </ul>
        </article>

        <article className="panel">
          <p className="eyebrow">Recommended in-game settings</p>
          <ul className="bullet-list">
            <li>Enable minimap scaling that makes ward and objective awareness easier.</li>
            <li>Use quick cast once comfortable, but do not force it on day one.</li>
            <li>Keep chat load manageable so new players can focus on learning.</li>
          </ul>
        </article>
      </div>

      <article className="panel">
        <p className="eyebrow">Runtime health</p>
        <div className="info-card-grid">
          <div className="info-card">
            <h3>Overwolf</h3>
            <p>{formatStatus(runtimeStatus.overwolfAvailable)}</p>
          </div>
          <div className="info-card">
            <h3>League running</h3>
            <p>{formatStatus(runtimeStatus.leagueRunning)}</p>
          </div>
          <div className="info-card">
            <h3>LCU status</h3>
            <p>{formatStatus(runtimeStatus.lcu)}</p>
          </div>
          <div className="info-card">
            <h3>Live client</h3>
            <p>{formatStatus(runtimeStatus.liveClient)}</p>
          </div>
          <div className="info-card">
            <h3>Game events</h3>
            <p>{formatStatus(runtimeStatus.gameEvents)}</p>
          </div>
          <div className="info-card">
            <h3>Lockfile path</h3>
            <p>{runtimeStatus.lockfilePath ?? 'Not found yet'}</p>
          </div>
        </div>
      </article>

      <article className="panel">
        <p className="eyebrow">Future persistence</p>
        <p>
          This screen is ready for Overwolf settings persistence, saved hotkeys,
          and whether LaneUp should auto-open during lobby, champ select,
          in-game, or post-game states.
        </p>
        {runtimeStatus.lastError ? (
          <p className="settings-error-note">Last provider error: {runtimeStatus.lastError}</p>
        ) : null}
      </article>
    </section>
  )
}
