import { roles } from '../data/roles'
import type { ChampionSelectState, LobbyPreferences, QuestState } from '../types'
import { useLiveChampionSelect } from '../hooks/useLiveChampionSelect'
import { useLiveLobby } from '../hooks/useLiveLobby'

interface ChampionSelectScreenProps {
  quest: QuestState
  lobby: LobbyPreferences
  championSelect: ChampionSelectState
  sourceLabel: string
  onBackToHome: () => void
}

function getBannerText(
  quest: QuestState,
  championSelect: ChampionSelectState,
) {
  if (championSelect.shouldNudgeQuest) {
    return 'No quest is set yet. LaneUp can suggest turning this assigned role into the new learning path after the match.'
  }

  if (championSelect.isAutofilled) {
    return 'Autofill or off-role detection should switch the prep view into supportive fallback guidance for this game without throwing away the saved quest.'
  }

  if (championSelect.mismatchWithQuest && quest.activeRole) {
    return 'Your saved quest and your current assigned role are different, so champ select should prepare you for this match first and preserve the long-term role plan for later.'
  }

  return 'Your current role intent and this lobby line up cleanly, so the prep flow can stay focused and simple.'
}

export function ChampionSelectScreen({
  quest,
  lobby,
  championSelect,
  sourceLabel,
  onBackToHome,
}: ChampionSelectScreenProps) {
  const assignedRole = roles[championSelect.assignedPosition]
  const activeQuestName = quest.activeRole ? roles[quest.activeRole].name : 'None'
  const bannerText = getBannerText(quest, championSelect)
  const live = useLiveChampionSelect()
  const liveLobby = useLiveLobby()

  if (!live.participants) {
    return (
      <section className="screen-stack">
        <div className="section-header">
          <div>
            <p className="eyebrow">Champion select coach</p>
            <h2>Pregame role and comp prep</h2>
          </div>
          <div className="header-chip-group">
            <span className="pill">{sourceLabel}</span>
            <span className="pill">Waiting for champ select</span>
            <button className="secondary-button" type="button" onClick={onBackToHome}>
              Back to home
            </button>
          </div>
        </div>

        <div className="callout-banner">
          <strong>Status</strong>
          <p>Game not detected. Open League champ select to load live data.</p>
          {live.error ? <p className="error-text">{live.error}</p> : null}
        </div>
      </section>
    )
  }

  return (
    <section className="screen-stack">
      <div className="section-header">
        <div>
          <p className="eyebrow">Champion select coach</p>
          <h2>Pregame role and comp prep</h2>
        </div>
        <div className="header-chip-group">
          <span className="pill">{sourceLabel}</span>
          <span className="pill accent">{assignedRole.name} detected</span>
          {liveLobby.intent ? (
            <span className="pill">Queue intent: {roles[liveLobby.intent.firstPositionPreference].name} / {roles[liveLobby.intent.secondPositionPreference].name}</span>
          ) : (
            <span className="pill">Queue intent: not set</span>
          )}
          <button className="secondary-button" type="button" onClick={onBackToHome}>
            Back to home
          </button>
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
          <p>The long-term role the player is trying to learn inside LaneUp.</p>
        </article>

        <article className="panel">
          <p className="eyebrow">Queue intent</p>
          <h3>
            {roles[lobby.firstPositionPreference].name} /{' '}
            {roles[lobby.secondPositionPreference].name}
          </h3>
          <p>
            First and second choices match the player intent layer we want to preserve.
          </p>
        </article>

        <article className="panel">
          <p className="eyebrow">Assigned role</p>
          <h3>{assignedRole.name}</h3>
          <p>Champion select should always prep the player for the actual role they got.</p>
        </article>
      </div>

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

      <div className="two-column">
        <article className="panel">
          <p className="eyebrow">Ally draft view</p>
          {live.participants ? (
            <div className="draft-list">
              {live.byTeam.allies.map((slot) => (
                <div key={`${slot.summonerId}`} className="draft-card">
                  <strong>{slot.summonerName}</strong>
                  <span>{slot.role ? roles[slot.role].name : 'Unassigned'}</span>
                  <p>
                    {slot.rank ?? 'Unranked'}
                    {slot.winrate ? ` · ${slot.winrate}` : ''}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="draft-list">
              {championSelect.allySlots.map((slot) => (
                <div key={slot.slotLabel} className="draft-card">
                  <strong>{slot.slotLabel}</strong>
                  <span>{roles[slot.role].name}</span>
                  <p>{slot.champion}</p>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="panel">
          <p className="eyebrow">Enemy comp threats</p>
          {live.participants ? (
            <div className="draft-list">
              {live.byTeam.enemies.map((slot) => (
                <div key={`${slot.summonerId}`} className="draft-card">
                  <strong>{slot.summonerName}</strong>
                  <span>{slot.role ? roles[slot.role].name : 'Unassigned'}</span>
                  <p>
                    {slot.rank ?? 'Unranked'}
                    {slot.winrate ? ` · ${slot.winrate}` : ''}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="draft-list">
              {championSelect.enemySlots.map((slot) => (
                <div key={`${slot.champion}-${slot.role}`} className="draft-card">
                  <strong>{slot.champion}</strong>
                  <span>{roles[slot.role].name}</span>
                  <p>{slot.threat}</p>
                </div>
              ))}
            </div>
          )}
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
