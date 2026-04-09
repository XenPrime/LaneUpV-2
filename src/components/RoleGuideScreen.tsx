import { roleOrder, roles } from '../data/roles'
import type { RoleId } from '../types'

interface RoleGuideScreenProps {
  activeRole: RoleId
  onSelectRole: (role: RoleId) => void
  guideMode: 'detailed' | 'simple'
  onToggleGuideMode: () => void
}

export function RoleGuideScreen({
  activeRole,
  onSelectRole,
  guideMode,
  onToggleGuideMode,
}: RoleGuideScreenProps) {
  const role = roles[activeRole]
  const isSimple = guideMode === 'simple'
  const visibleSummary = isSimple ? role.simpleSummary : role.summary
  const visibleResponsibilityCards = isSimple
    ? role.simpleResponsibilityCards
    : role.responsibilityCards
  const visiblePhases = isSimple ? role.simplePhases : role.phases
  const visibleEasyChampions = isSimple
    ? role.simpleChampionRecommendations
    : role.championRecommendations.easy

  return (
    <section className="screen-stack">
      <div className="section-header">
        <div>
          <p className="eyebrow">Role fundamentals</p>
          <h2>{role.name} guide</h2>
        </div>

        <div className="guide-header-actions">
          <label className="guide-mode-toggle" aria-label="Toggle simple guide mode">
            <span className="guide-mode-label">
              {isSimple ? 'Simple Mode' : 'Detailed Mode'}
            </span>
            <button
              type="button"
              className={`theme-toggle-switch ${isSimple ? 'dark' : ''}`}
              onClick={onToggleGuideMode}
              aria-pressed={isSimple}
            >
              <span className="theme-toggle-knob" />
            </button>
          </label>

          <div className="tab-row">
          {roleOrder.map((roleId) => (
            <button
              key={roleId}
              type="button"
              className={`mini-tab ${activeRole === roleId ? 'active' : ''}`}
              onClick={() => onSelectRole(roleId)}
            >
              {roles[roleId].name}
            </button>
          ))}
          </div>
        </div>
      </div>

      <article className="panel">
        <p className="eyebrow">Role identity</p>
        <h3>{role.title}</h3>
        <p>{visibleSummary}</p>
      </article>

      <article className="panel">
        <p className="eyebrow">Next game checklist</p>
        <div className="info-card-grid">
          {role.nextGameChecklist.map((item) => (
            <div key={item.title} className="info-card">
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="panel">
        <p className="eyebrow">Core info cards</p>
        <div className="info-card-grid">
          {visibleResponsibilityCards.map((card) => (
            <div key={card.title} className="info-card">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </article>

      <div className="three-column">
        <article className="panel phase-panel">
          <p className="eyebrow">Early game</p>
          <p>{visiblePhases.early}</p>
        </article>
        <article className="panel phase-panel">
          <p className="eyebrow">Mid game</p>
          <p>{visiblePhases.mid}</p>
        </article>
        <article className="panel phase-panel">
          <p className="eyebrow">Late game</p>
          <p>{visiblePhases.late}</p>
        </article>
      </div>

      {!isSimple ? (
        <div className="two-column">
          <article className="panel">
            <p className="eyebrow">Good times to fight</p>
            <ul className="bullet-list">
              {role.goodFights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="panel">
            <p className="eyebrow">Avoid fighting when</p>
            <ul className="bullet-list">
              {role.avoidFights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      ) : null}

      {!isSimple ? (
        <article className="panel">
          <p className="eyebrow">{role.synergyTitle}</p>
          <ul className="bullet-list">
            {role.synergyPoints.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      ) : null}

      <div className="two-column">
        <article className="panel">
          <p className="eyebrow">Matchup reminders</p>
          <div className="champion-list">
            {role.matchupReminders.map((tip) => (
              <div key={tip.situation} className="champion-card easy compact-card">
                <h3>{tip.situation}</h3>
                <p>{tip.response}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <p className="eyebrow">Practice habits</p>
          <ul className="bullet-list">
            {role.practiceHabits.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>

      <div className={isSimple ? 'one-column' : 'two-column'}>
        <article className="panel">
          <p className="eyebrow">
            {isSimple ? 'Best beginner champions' : 'Good beginner champions'}
          </p>
          <div className="champion-list">
            {visibleEasyChampions.map((entry) => (
              <div key={entry.champion} className="champion-card easy">
                <h3>{entry.champion}</h3>
                <p>{entry.reason}</p>
              </div>
            ))}
          </div>
        </article>

        {!isSimple ? (
          <article className="panel">
            <p className="eyebrow">Avoid if you're brand new</p>
            <div className="champion-list">
              {role.championRecommendations.hard.map((entry) => (
                <div key={entry.champion} className="champion-card hard">
                  <h3>{entry.champion}</h3>
                  <p>{entry.reason}</p>
                </div>
              ))}
            </div>
          </article>
        ) : null}
      </div>

      {!isSimple ? (
        <article className="panel footer-note-panel">
          <p>{role.footerNote}</p>
        </article>
      ) : null}
    </section>
  )
}
