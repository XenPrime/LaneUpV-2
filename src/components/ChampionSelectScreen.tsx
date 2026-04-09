import { roles } from '../data/roles'
import type { ChampionSelectState, LobbyPreferences, QuestState } from '../types'

interface ChampionSelectScreenProps {
  quest: QuestState
  lobby: LobbyPreferences
  championSelect: ChampionSelectState
  sourceLabel: string
}

export function ChampionSelectScreen({
  quest,
  lobby,
  championSelect,
  sourceLabel,
}: ChampionSelectScreenProps) {
  const assignedRole = roles[championSelect.assignedPosition]
  const activeQuestName = quest.activeRole ? roles[quest.activeRole].name : 'None'

  let bannerText =
    'Normal load. The assigned role matches what the player queued for.'

  if (championSelect.shouldNudgeQuest) {
    bannerText =
      'No quest is set, so LaneUp can gently suggest turning this assigned role into a quest after champ select.'
  } else if (championSelect.isAutofilled && championSelect.mismatchWithQuest) {
    bannerText =
      'Autofill plus quest mismatch. Lead with the assigned-role guide, then preserve the original quest for future games.'
  } else if (championSelect.isAutofilled) {
    bannerText =
      'True autofill detected. Show a stronger note and switch the guide to the assigned role right away.'
  } else if (championSelect.mismatchWithQuest) {
    bannerText =
      'Secondary role or mismatch detected. Load the assigned-role guide while keeping the experience supportive instead of alarmist.'
  }

  return (
    <section className="screen-stack">
      <div className="section-header">
        <div>
          <p className="eyebrow">LCU-driven overlay logic</p>
          <h2>Champion select companion</h2>
        </div>
        <div className="header-chip-group">
          <span className="pill">{sourceLabel}</span>
          <span className="pill accent">{assignedRole.name} detected</span>
        </div>
      </div>

      <div className="callout-banner">
        <strong>Banner logic</strong>
        <p>{bannerText}</p>
      </div>

      <div className="three-column">
        <article className="panel">
          <p className="eyebrow">Active quest</p>
          <h3>{activeQuestName}</h3>
          <p>What the player has been learning in LaneUp.</p>
        </article>

        <article className="panel">
          <p className="eyebrow">Queue preferences</p>
          <h3>
            {roles[lobby.firstPositionPreference].name} /{' '}
            {roles[lobby.secondPositionPreference].name}
          </h3>
          <p>First and second positions pulled from the lobby state.</p>
        </article>

        <article className="panel">
          <p className="eyebrow">Assigned position</p>
          <h3>{assignedRole.name}</h3>
          <p>The role pulled from `assignedPosition` during champ select.</p>
        </article>
      </div>

      <div className="two-column">
        <article className="panel">
          <p className="eyebrow">Guide tab</p>
          <ul className="bullet-list">
            <li>Three game phases stay visible for the assigned role.</li>
            <li>Beginner reminders stay fundamentals-only, not matchup-heavy.</li>
            <li>Quest state can be updated after the game without blocking this one.</li>
          </ul>
        </article>

        <article className="panel">
          <p className="eyebrow">Synergy tab</p>
          <ul className="bullet-list">
            {assignedRole.synergyPoints.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  )
}
