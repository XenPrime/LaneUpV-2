import { matchupLibrary } from '../data/trainingLab'
import { roles } from '../data/roles'
import type { RoleId } from '../types'

interface ChampionStatsScreenProps {
  activeRole: RoleId
}

export function ChampionStatsScreen({
  activeRole,
}: ChampionStatsScreenProps) {
  const role = roles[activeRole]
  const training = matchupLibrary[activeRole]

  return (
    <section className="screen-stack">
      <div className="section-header">
        <div>
          <p className="eyebrow">Training lab</p>
          <h2>{role.name} matchup and practice lab</h2>
        </div>
        <span className="pill accent">{role.name} selected</span>
      </div>

      <div className="two-column">
        <article className="panel">
          <p className="eyebrow">Lane plan</p>
          <ul className="bullet-list">
            {training.lanePlan.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <p className="eyebrow">Danger windows</p>
          <ul className="bullet-list">
            {training.dangerWindows.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>

      <div className="three-column">
        <article className="panel">
          <p className="eyebrow">Practice drills</p>
          <ul className="bullet-list">
            {training.practiceDrills.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <p className="eyebrow">Map habits</p>
          <ul className="bullet-list">
            {training.mapHabits.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <p className="eyebrow">Next game focus</p>
          <div className="champion-list">
            {training.nextGameFocus.map((item) => (
              <div key={item} className="champion-card easy compact-card">
                <p>{item}</p>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="panel footer-note-panel">
        <p>
          This lab is meant to stay useful even when no live Riot data is
          available. Treat it like your pregame prep board and postgame review
          checklist.
        </p>
      </article>
    </section>
  )
}
