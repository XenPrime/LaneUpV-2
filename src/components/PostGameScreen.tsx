import type { PostGameSummary, RiotRecentMatch } from '../types'

interface PostGameScreenProps {
  summary: PostGameSummary
  sourceLabel: string
  isMockData?: boolean
  riotHistoryStatus: 'idle' | 'searching' | 'connected' | 'error'
  riotHistoryError: string | null
  resolvedAccount: string | null
  recentMatches: RiotRecentMatch[]
}

export function PostGameScreen({
  summary,
  sourceLabel,
  riotHistoryStatus,
  riotHistoryError,
  resolvedAccount,
  recentMatches,
  isMockData = false,
}: PostGameScreenProps) {
  return (
    <section className="screen-stack">
      <div className="section-header">
        <div>
          <p className="eyebrow">Post-game review</p>
          <h2>Improvement recap</h2>
        </div>
        <div className="header-chip-group">
          <span className="pill">{sourceLabel}</span>
          {isMockData ? (
            <span className="pill" style={{ color: 'var(--muted)', borderColor: 'var(--border)' }}>
              Preview data
            </span>
          ) : (
            <span className="pill" style={{ color: 'var(--green)', borderColor: 'var(--green-border)' }}>
              Live data
            </span>
          )}
          <span className={`pill ${summary.result === 'Victory' ? 'win' : 'loss'}`}>
            {summary.result} • {summary.grade}
          </span>
        </div>
      </div>

      <article className="callout-banner">
        <strong>Match story</strong>
        <p>{summary.matchStory}</p>
      </article>

      <div className="two-column">
        <article className="panel">
          <p className="eyebrow">What went well</p>
          <ul className="bullet-list">
            {summary.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <p className="eyebrow">Focus next game</p>
          <ul className="bullet-list">
            {summary.focusNextGame.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>

      <div className="two-column">
        <article className="panel">
          <p className="eyebrow">Death pattern review</p>
          <div className="champion-list">
            {summary.deathPatterns.map((pattern) => (
              <div key={pattern.title} className="champion-card hard compact-card">
                <h3>{pattern.title}</h3>
                <p>{pattern.detail}</p>
                <span className="death-zone-chip">{pattern.mapZone}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <p className="eyebrow">Death map read</p>
          <div className="death-map-card">
            <div className="death-map-grid" aria-hidden="true">
              <span className="death-dot death-dot-one" />
              <span className="death-dot death-dot-two" />
              <span className="death-dot death-dot-three" />
            </div>
            <p>{summary.deathMapSummary}</p>
          </div>
        </article>
      </div>

      <article className="panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">Recent Riot history</p>
            <h3>Proxy-backed match samples</h3>
          </div>
          <div className="header-chip-group">
            <span className="pill">{riotHistoryStatus}</span>
            <span className="pill">{resolvedAccount ?? 'No Riot ID linked yet'}</span>
          </div>
        </div>

        {recentMatches.length > 0 ? (
          <div className="champion-list">
            {recentMatches.map((match) => (
              <div key={match.matchId} className="draft-card">
                <span>{match.queueLabel}</span>
                <strong>
                  {match.champion} • {match.roleLabel} • {match.result}
                </strong>
                <p>
                  {match.kills}/{match.deaths}/{match.assists} KDA • {match.durationLabel} • {match.startedAt}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>
            Add your Riot ID in Settings to test recent-match history through the local proxy before
            we wire deeper post-game automation.
          </p>
        )}

        {riotHistoryError ? (
          <p className="settings-error-note">Riot history issue: {riotHistoryError}</p>
        ) : null}
      </article>
    </section>
  )
}
