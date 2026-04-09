import type { LiveStats } from '../types'

interface InGameOverlayScreenProps {
  liveStats: LiveStats
  sourceLabel: string
}

export function InGameOverlayScreen({
  liveStats,
  sourceLabel,
}: InGameOverlayScreenProps) {
  return (
    <section className="screen-stack">
      <div className="section-header">
        <div>
          <p className="eyebrow">In-game overlay</p>
          <h2>Toggleable reference panel</h2>
        </div>
        <div className="header-chip-group">
          <span className="pill">{sourceLabel}</span>
          <span className="status-chip">{liveStats.currentPhase} game</span>
        </div>
      </div>

      <div className="two-column">
        <article className="panel">
          <p className="eyebrow">Compliant overlay intent</p>
          <ul className="bullet-list">
            <li>User-opened reference window with a hotkey toggle.</li>
            <li>Educational cues and neutral benchmarks instead of live commands.</li>
            <li>Compact placement away from minimap, score, shop, and ability bar.</li>
          </ul>
        </article>

        <article className="panel">
          <p className="eyebrow">Current read</p>
          <ul className="bullet-list">
            <li>{liveStats.roleFocus}</li>
            <li>{liveStats.laneState}</li>
            <li>{liveStats.objectiveWindow}</li>
          </ul>
        </article>
      </div>

      <div className="overlay-shell overlay-shell-expanded">
        <div className="overlay-top">
          <div>
            <p className="eyebrow">Current game</p>
            <h3>
              {liveStats.champion} level {liveStats.summonerLevel}
            </h3>
          </div>
          <div className="overlay-clock">{liveStats.gameTime}</div>
        </div>

        <div className="overlay-stats">
          <div className="stat-box">
            <span>KDA</span>
            <strong>
              {liveStats.kills}/{liveStats.deaths}/{liveStats.assists}
            </strong>
          </div>
          <div className="stat-box">
            <span>CS</span>
            <strong>{liveStats.cs}</strong>
          </div>
          <div className="stat-box">
            <span>Vision</span>
            <strong>{liveStats.vision}</strong>
          </div>
          <div className="stat-box">
            <span>Gold</span>
            <strong>{liveStats.gold}</strong>
          </div>
        </div>

        <div className="overlay-reference-grid">
          <div className="tip-card">
            <p className="eyebrow">CS benchmark</p>
            <p>{liveStats.csTarget}</p>
          </div>

          <div className="tip-card">
            <p className="eyebrow">Objective setup</p>
            <p>{liveStats.objectiveWindow}</p>
          </div>

          <div className="tip-card">
            <p className="eyebrow">Positioning</p>
            <p>{liveStats.positioningCue}</p>
          </div>

          <div className="tip-card">
            <p className="eyebrow">Phase focus</p>
            <p>{liveStats.roleFocus}</p>
          </div>
        </div>

        <div className="tip-card">
          <p className="eyebrow">Reference notes</p>
          <ul className="bullet-list">
            {liveStats.referenceNotes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="overlay-footer">
          <span>Hotkey: `Ctrl + Shift + Space`</span>
          <span>Open manually, use as reference, close fast</span>
        </div>
      </div>
    </section>
  )
}
