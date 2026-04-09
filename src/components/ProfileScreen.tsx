import { roles } from '../data/roles'
import type { PracticeJournalState, QuestState } from '../types'

interface ProfileScreenProps {
  quest: QuestState
  journal: PracticeJournalState
  onUpdateJournal: (next: PracticeJournalState) => void
}

export function ProfileScreen({
  quest,
  journal,
  onUpdateJournal,
}: ProfileScreenProps) {
  const activeRole = quest.activeRole ? roles[quest.activeRole] : null

  const updateField = <K extends keyof PracticeJournalState>(
    field: K,
    value: PracticeJournalState[K],
  ) => {
    onUpdateJournal({
      ...journal,
      [field]: value,
    })
  }

  return (
    <section className="screen-stack">
      <div className="section-header">
        <div>
          <p className="eyebrow">Progress journal</p>
          <h2>Offline coaching notes</h2>
        </div>
        <span className="status-chip">
          Active role: {activeRole ? activeRole.name : 'Not selected'}
        </span>
      </div>

      <div className="two-column">
        <article className="panel">
          <p className="eyebrow">Weekly goal</p>
          <textarea
            className="journal-input journal-textarea"
            value={journal.weeklyGoal}
            onChange={(event) => updateField('weeklyGoal', event.target.value)}
          />
        </article>

        <article className="panel">
          <p className="eyebrow">Next game focus</p>
          <textarea
            className="journal-input journal-textarea"
            value={journal.nextGameFocus}
            onChange={(event) => updateField('nextGameFocus', event.target.value)}
          />
        </article>
      </div>

      <div className="two-column">
        <article className="panel">
          <p className="eyebrow">Confidence</p>
          <div className="tab-row">
            {(['Building', 'Steady', 'Ready'] as const).map((option) => (
              <button
                key={option}
                type="button"
                className={`mini-tab ${journal.confidence === option ? 'active' : ''}`}
                onClick={() => updateField('confidence', option)}
              >
                {option}
              </button>
            ))}
          </div>
        </article>

        <article className="panel">
          <p className="eyebrow">How to use this</p>
          <ul className="bullet-list">
            <li>Write one clear weekly goal instead of five vague ones.</li>
            <li>Set a tiny next-game focus so you can remember it in queue.</li>
            <li>Use confidence as a self-check, not a judgment score.</li>
          </ul>
        </article>
      </div>

      <article className="panel">
        <p className="eyebrow">Session notes</p>
        <textarea
          className="journal-input journal-notes"
          value={journal.notes}
          onChange={(event) => updateField('notes', event.target.value)}
        />
      </article>
    </section>
  )
}
