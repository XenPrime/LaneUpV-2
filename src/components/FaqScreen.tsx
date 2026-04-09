export function FaqScreen() {
  return (
    <section className="screen-stack">
      <div className="section-header">
        <div>
          <p className="eyebrow">FAQ</p>
          <h2>Quick beginner answers</h2>
        </div>
      </div>

      <div className="two-column">
        <article className="panel">
          <p className="eyebrow">Common questions</p>
          <ul className="bullet-list">
            <li>What role should I start with if I am brand new?</li>
            <li>What does LaneUp track during champ select and in game?</li>
            <li>Why did the overlay switch to a different role this match?</li>
          </ul>
        </article>

        <article className="panel">
          <p className="eyebrow">Answer style</p>
          <ul className="bullet-list">
            <li>Short definitions instead of jargon-heavy explanations.</li>
            <li>Clear examples tied to roles, maps, and game phases.</li>
            <li>Support-first guidance when the player does not know where to begin.</li>
          </ul>
        </article>
      </div>
    </section>
  )
}
