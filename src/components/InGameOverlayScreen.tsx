import { useState } from 'react'
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
  const [activeTab, setActiveTab] = useState<'live' | 'benchmarks' | 'reference'>(
    'live',
  )
  const threatColor = matchup ? THREAT_COLORS[matchup.threatLevel] : '#5a6382'

  return (
    <section className="screen-stack in-game-screen-stack">
      <div className="in-game-window-hero">
        <div>
          <p className="eyebrow">LaneUp live tab</p>
          <h2>In-game companion</h2>
          <p className="in-game-window-copy">
            Separate Overwolf surface for match-only context, quick checks, and
            lightweight reference.
          </p>
        </div>
        <div className="header-chip-group">
          <span className="pill">{sourceLabel}</span>
          <span className="status-chip">{liveStats.currentPhase} game</span>
        </div>
      </div>

      <div className="tab-row overlay-tab-row">
        <button
          type="button"
          className={`mini-tab ${activeTab === 'live' ? 'active' : ''}`}
          onClick={() => setActiveTab('live')}
        >
          Live tab
        </button>
        <button
          type="button"
          className={`mini-tab ${activeTab === 'benchmarks' ? 'active' : ''}`}
          onClick={() => setActiveTab('benchmarks')}
        >
          Benchmarks
        </button>
        <button
          type="button"
          className={`mini-tab ${activeTab === 'reference' ? 'active' : ''}`}
          onClick={() => setActiveTab('reference')}
        >
          Reference
        </button>
      </div>

      {activeTab === 'live' ? (
        <>
          <div className="overlay-shell overlay-shell-expanded in-game-window-panel">
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
                <p className="eyebrow">Current read</p>
                <p>{liveStats.roleFocus}</p>
              </div>
              <div className="tip-card">
                <p className="eyebrow">Lane state</p>
                <p>{liveStats.laneState}</p>
              </div>
              <div className="tip-card">
                <p className="eyebrow">Objective setup</p>
                <p>{liveStats.objectiveWindow}</p>
              </div>
              <div className="tip-card">
                <p className="eyebrow">Positioning</p>
                <p>{liveStats.positioningCue}</p>
              </div>
            </div>

            <div className="overlay-footer">
              <span>Window: live tab</span>
              <span>Hotkey: Ctrl + Shift + Space</span>
            </div>
          </div>

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

          {matchup ? (
            <article className="panel">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '10px',
                }}
              >
                <p className="eyebrow" style={{ margin: 0 }}>
                  vs {matchup.championName}
                </p>
                <span
                  className="pill"
                  style={{
                    background: `${threatColor}22`,
                    color: threatColor,
                    borderColor: `${threatColor}44`,
                  }}
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
              <p>Matchup tips will appear once champion lock-in is complete.</p>
            </article>
          ) : (
            <article className="panel">
              <p className="eyebrow">Matchup tips</p>
              <p>
                Enemy champion not yet detected. Tips will appear once the game
                loads lane assignments.
              </p>
            </article>
          )}
        </>
      ) : null}

      {activeTab === 'benchmarks' ? (
        <div className="two-column">
          <article className="panel">
            <p className="eyebrow">CS benchmark</p>
            <h3>{liveStats.csTarget}</h3>
            <p>
              Keep this tab as the quick pacing check while you farm, reset, and
              rotate.
            </p>
          </article>

          <article className="panel">
            <p className="eyebrow">Objective setup</p>
            <h3>{liveStats.objectiveWindow}</h3>
            <p>
              Neutral objective prep belongs here so the live tab can stay cleaner.
            </p>
          </article>
        </div>
      ) : null}

      {activeTab === 'reference' ? (
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
            <p className="eyebrow">Reference notes</p>
            <ul className="bullet-list">
              {liveStats.referenceNotes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      ) : null}
    </section>
  )
}
