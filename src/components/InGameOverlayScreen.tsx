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
          <p className="eyebrow">Live client overlay</p>
          <h2>Compact panel target: around 300px wide</h2>
        </div>
        <div className="header-chip-group">
          <span className="pill">{sourceLabel}</span>
          <span className="status-chip">{liveStats.currentPhase} game</span>
        </div>
      </div>

      <div className="overlay-shell">
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

        <div className="tip-card">
          <p className="eyebrow">Live nudge</p>
          <h3>{liveStats.tipHeadline}</h3>
          <p>{liveStats.tipBody}</p>
        </div>

        <div className="overlay-footer">
          <span>Hotkey: `Ctrl + Shift + Space`</span>
          <span>Ward reminder: ready</span>
        </div>
      </div>
    </section>
  )
}
