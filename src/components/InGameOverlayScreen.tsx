import type { LiveStats, MatchupInfo } from '../types'

interface InGameOverlayScreenProps {
  liveStats: LiveStats
  sourceLabel: string
  matchup?: MatchupInfo | null
  laneOpponent?: string | null
}

const THREAT_COLORS: Record<string, string> = {
  High: '#e05252',
  Medium: '#e8a020',
  Low: '#2db87a',
}

export function InGameOverlayScreen({
  liveStats,
  sourceLabel,
  matchup,
  laneOpponent,
}: InGameOverlayScreenProps) {
  const threatColor = matchup ? THREAT_COLORS[matchup.threatLevel] : '#5a6382'

  return (
    <section className="screen-stack">
      <div className="section-header">
        <div>
          <p className="eyebrow">In-game overlay</p>
          <h2>Live reference panel</h2>
        </div>
        <div className="header-chip-group">
          <span className="pill">{sourceLabel}</span>
          <span className="status-chip">{liveStats.currentPhase} game</span>
        </div>
      </div>

      {/* Live stat cards */}
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
      </div>

      {/* Smart live tips */}
      <div className="two-column">
        <article className="panel">
          <p className="eyebrow">CS pace</p>
          <p>{liveStats.csPaceTip}</p>
        </article>
        <article className="panel">
          <p className="eyebrow">Kill participation</p>
          <p>{liveStats.kpTip}</p>
        </article>
      </div>
      <div className="two-column">
        <article className="panel">
          <p className="eyebrow">Vision</p>
          <p>{liveStats.visionTip}</p>
        </article>
        <article className="panel">
          <p className="eyebrow">{liveStats.currentPhase} game focus</p>
          <p>{liveStats.roleFocus}</p>
        </article>
      </div>

      {/* Matchup panel — shown when a lane opponent is known */}
      {matchup ? (
        <article className="panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <p className="eyebrow" style={{ margin: 0 }}>
              vs {matchup.championName}
            </p>
            <span
              className="pill"
              style={{ background: `${threatColor}22`, color: threatColor, borderColor: `${threatColor}44` }}
            >
              {matchup.threatLevel} threat
            </span>
            <span className="pill" style={{ marginLeft: 'auto', fontSize: '10px' }}>
              {matchup.archetype}
            </span>
          </div>

          <div className="overlay-reference-grid">
            <div className="tip-card">
              <p className="eyebrow">Watch out</p>
              <p>{matchup.watchOut}</p>
            </div>
            <div className="tip-card">
              <p className="eyebrow">Win condition</p>
              <p>{matchup.winCondition}</p>
            </div>
            <div className="tip-card">
              <p className="eyebrow">Trading tip</p>
              <p>{matchup.tradingTip}</p>
            </div>
            <div className="tip-card">
              <p className="eyebrow">{matchup.championName} this phase</p>
              <p>{matchup.currentPhaseTip}</p>
            </div>
          </div>
        </article>
      ) : laneOpponent ? (
        <article className="panel">
          <p className="eyebrow">vs {laneOpponent}</p>
          <p style={{ color: 'var(--muted)' }}>
            Matchup tips will appear once champion lock-in is complete.
          </p>
        </article>
      ) : (
        <article className="panel">
          <p className="eyebrow">Matchup tips</p>
          <p style={{ color: 'var(--muted)' }}>
            Enemy champion not yet detected. Tips will appear once the game loads lane assignments.
          </p>
        </article>
      )}

      <div className="overlay-footer">
        <span>Hotkey: Ctrl + Shift + Space</span>
        <span>Open as reference · close fast</span>
      </div>
    </section>
  )
}
