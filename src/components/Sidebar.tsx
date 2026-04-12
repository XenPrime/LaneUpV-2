import type { ScreenId } from '../types'

const screens: Array<{ id: ScreenId; label: string; kicker: string }> = [
  { id: 'home', label: 'Home', kicker: 'Quest setup' },
  { id: 'guide', label: 'Role Guide', kicker: 'Learn fundamentals' },
  { id: 'builds', label: 'Stats & Builds', kicker: 'Champions and items' },
  { id: 'runes', label: 'Rune Guide', kicker: 'Every path & keystone' },
  { id: 'profile', label: 'Profile', kicker: 'Progress and habits' },
  { id: 'faq', label: 'FAQ', kicker: 'Quick answers' },
  { id: 'champ-select', label: 'Champ Select', kicker: 'Role detection' },
  { id: 'in-game', label: 'In-Game Overlay', kicker: 'Live tips' },
  { id: 'post-game', label: 'Post-Game', kicker: 'Recap and growth' },
  { id: 'settings', label: 'Settings', kicker: 'Controls and app prefs' },
]

interface SidebarProps {
  activeScreen: ScreenId
  onChangeScreen: (screen: ScreenId) => void
}

export function Sidebar({ activeScreen, onChangeScreen }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <div className="brand-mark">LU</div>
        <div>
          <p className="eyebrow">Overwolf prototype</p>
          <h1>LaneUp2</h1>
        </div>
      </div>

      <div className="sidebar-copy">
        Beginner-friendly League help that stays calm, readable, and role-aware.
      </div>

      <nav className="nav-list" aria-label="LaneUp screens">
        {screens.map((screen) => (
          <button
            key={screen.id}
            className={`nav-item ${activeScreen === screen.id ? 'active' : ''}`}
            onClick={() => onChangeScreen(screen.id)}
            type="button"
          >
            <span className="nav-label">{screen.label}</span>
            <span className="nav-kicker">{screen.kicker}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}
