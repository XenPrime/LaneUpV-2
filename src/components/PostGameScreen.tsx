import type { PostGameSummary } from '../types'

interface PostGameScreenProps {
  summary: PostGameSummary
  sourceLabel: string
}

export function PostGameScreen({
  summary,
  sourceLabel,
}: PostGameScreenProps) {
  return (
    <section className="screen-stack">
      <div className="section-header">
        <div>
          <p className="eyebrow">Beginner-friendly recap</p>
          <h2>Post-game summary</h2>
        </div>
        <div className="header-chip-group">
          <span className="pill">{sourceLabel}</span>
          <span className={`pill ${summary.result === 'Victory' ? 'win' : 'loss'}`}>
            {summary.result} • {summary.grade}
          </span>
        </div>
      </div>

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
    </section>
  )
}
