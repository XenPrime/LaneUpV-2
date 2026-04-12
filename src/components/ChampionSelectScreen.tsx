import { roles } from '../data/roles'
import type { ChampionSelectState, LobbyPreferences, MatchupInfo, QuestState } from '../types'

interface ChampionSelectScreenProps {
  quest: QuestState
  lobby: LobbyPreferences
  championSelect: ChampionSelectState
  sourceLabel: string
  matchup?: MatchupInfo | null
  laneOpponent?: string | null
  enemyChampions?: string[]
}

const THREAT_COLORS: Record<string, string> = {
  High: '#e05252',
  Medium: '#e8a020',
  Low: '#2db87a',
}

function getBannerText(quest: QuestState, championSelect: ChampionSelectState) {
  if (championSelect.shouldNudgeQuest) {
    return 'No quest is set yet. LaneUp can suggest turning this assigned role into the new learning path after the match.'
  }
  if (championSelect.isAutofilled) {
    return 'Autofill detected. Your guide will focus on surviving this game rather than your quest role.'
  }
  if (championSelect.mismatchWithQuest && quest.activeRole) {
    return 'Your quest role and assigned role differ. LaneUp will prep you for this match first and preserve your quest for later.'
  }
  return 'Your queue intent and assigned role match. Stay focused on the game plan.'
}

export function ChampionSelectScreen({
  quest,
  lobby,
  championSelect,
  sourceLabel,
  matchup,
  laneOpponent,
  enemyChampions = [],
}: ChampionSelectScreenProps) {
  const assignedRole = roles[championSelect.assignedPosition]
  const activeQuestName = quest.activeRole ? roles[quest.activeRole].name : 'None'
  const bannerText = getBannerText(quest, championSelect)
  const threatColor = matchup ? THREAT_COLORS[matchup.threatLevel] : '#5a6382'

  return (
    <section className="screen-stack">
      <div className="section-header">
        <div>
          <p className="eyebrow">Champion select coach</p>
          <h2>Pregame prep</h2>
        </div>
        <div className="header-chip-group">
          <span className="pill">{sourceLabel}</span>
          <span className="pill accent">{assignedRole.name} detected</span>
        </div>
      </div>

      <div className="callout-banner">
        <strong>LaneUp read</strong>
        <p>{bannerText}</p>
      </div>

      <div className="three-column">
        <article className="panel">
          <p className="eyebrow">Quest role</p>
          <h3>{activeQuestName}</h3>
          <p>The role you are trying to learn inside LaneUp.</p>
        </article>
        <article className="panel">
          <p className="eyebrow">Queue intent</p>
          <h3>
            {roles[lobby.firstPositionPreference].name} /{' '}
            {roles[lobby.secondPositionPreference].name}
          </h3>
          <p>Your first and second position preferences.</p>
        </article>
        <article className="panel">
          <p className="eyebrow">Assigned role</p>
          <h3>{assignedRole.name}</h3>
          <p>LaneUp always preps you for the role you actually got.</p>
        </article>
      </div>

      {/* Matchup section — primary focus of this screen */}
      {matchup ? (
        <article className="panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <p className="eyebrow" style={{ margin: 0 }}>
              Lane matchup — vs {matchup.championName}
            </p>
            <span
              className="pill"
              style={{ background: `${threatColor}22`, color: threatColor, borderColor: `${threatColor}44` }}
            >
              {matchup.threatLevel} threat
            </span>
            <span className="pill" style={{ fontSize: '10px', marginLeft: 'auto' }}>
              {matchup.archetype}
            </span>
          </div>

          <div className="overlay-reference-grid">
            <div className="tip-card">
              <p className="eyebrow">Watch out for</p>
              <p>{matchup.watchOut}</p>
            </div>
            <div className="tip-card">
              <p className="eyebrow">How to win</p>
              <p>{matchup.winCondition}</p>
            </div>
            <div className="tip-card">
              <p className="eyebrow">Trading tip</p>
              <p>{matchup.tradingTip}</p>
            </div>
            <div className="tip-card">
              <p className="eyebrow">Early game plan</p>
              <p>{matchup.currentPhaseTip}</p>
            </div>
          </div>

          {enemyChampions.length > 1 && (
            <div style={{ marginTop: '12px' }}>
              <p className="eyebrow" style={{ marginBottom: '6px' }}>
                Other enemies detected
              </p>
              <div className="chip-stack">
                {enemyChampions
                  .filter((c) => c !== matchup.championName)
                  .map((champ) => (
                    <span key={champ} className="pill">
                      {champ}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </article>
      ) : laneOpponent ? (
        <article className="panel">
          <p className="eyebrow">vs {laneOpponent}</p>
          <p style={{ color: 'var(--muted)' }}>
            Full matchup tips will load once both teams lock in their champions.
          </p>
        </article>
      ) : (
        <article className="panel">
          <p className="eyebrow">Matchup tips</p>
          <p style={{ color: 'var(--muted)' }}>
            Waiting for enemy picks. Matchup tips will appear as champions are locked in.
          </p>
        </article>
      )}

      <div className="two-column">
        <article className="panel">
          <p className="eyebrow">Your champion</p>
          <h3>
            {championSelect.lockInChampion} ({assignedRole.name})
          </h3>
          <p>{championSelect.playerJob}</p>
          <div className="chip-stack">
            <span className="pill">{championSelect.hoverChampion} hovered</span>
            <span className="pill">{championSelect.lockInChampion} locked</span>
          </div>
        </article>
        <article className="panel">
          <p className="eyebrow">Comp identity</p>
          <h3>{championSelect.teamCompIdentity}</h3>
          <p>{championSelect.teamCompSummary}</p>
        </article>
      </div>

      <article className="panel">
        <p className="eyebrow">Safe guidance</p>
        <ul className="bullet-list">
          {championSelect.safeGuidance.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
    </section>
  )
}
