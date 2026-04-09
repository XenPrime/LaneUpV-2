import { useEffect, useState } from 'react'
import bottomIcon from '../assets/role-icons/bottom.png'
import jungleIcon from '../assets/role-icons/jungle.png'
import middleIcon from '../assets/role-icons/middle.png'
import topIcon from '../assets/role-icons/top.png'
import utilityIcon from '../assets/role-icons/utility.png'
import difficulty0 from '../assets/Champion_difficulty_0.png'
import difficulty1 from '../assets/Champion_difficulty_1.png'
import difficulty2 from '../assets/Champion_difficulty_2.png'
import difficulty3 from '../assets/Champion_difficulty_3.png'
import { roles } from '../data/roles'
import type { QuestState, RoleId, ScreenId } from '../types'

const roleSelectorOrder: Array<{ id: RoleId; label: string; icon: string }> = [
  { id: 'top', label: 'Top', icon: topIcon },
  { id: 'jungle', label: 'Jungle', icon: jungleIcon },
  { id: 'middle', label: 'Mid', icon: middleIcon },
  { id: 'bottom', label: 'ADC', icon: bottomIcon },
  { id: 'utility', label: 'Support', icon: utilityIcon },
]

const difficultyIconMap: Record<RoleId, { label: string; icon: string }> = {
  utility: { label: roles.utility.difficulty, icon: difficulty0 }, // Easy
  top: { label: roles.top.difficulty, icon: difficulty1 }, // Low-Medium
  middle: { label: roles.middle.difficulty, icon: difficulty2 }, // Medium
  bottom: { label: roles.bottom.difficulty, icon: difficulty3 }, // Hard
  jungle: { label: roles.jungle.difficulty, icon: difficulty3 }, // Very Hard
}

const destinationCards: Array<{
  screen: Extract<ScreenId, 'guide' | 'builds' | 'profile' | 'faq' | 'settings'>
  title: string
  description: string
  size: 'hero' | 'medium' | 'small'
}> = [
  {
    screen: 'guide',
    title: 'Role coaching guide',
    description:
      'Learn the lane job, phase plan, next-game priorities, and practical role decisions.',
    size: 'hero',
  },
  {
    screen: 'builds',
    title: 'Training lab',
    description:
      'Practice matchups, danger windows, drills, and map habits without needing live data.',
    size: 'medium',
  },
  {
    screen: 'profile',
    title: 'Progress journal',
    description:
      'Keep weekly goals, next-game reminders, and session notes inside LaneUp.',
    size: 'small',
  },
  {
    screen: 'faq',
    title: 'FAQ',
    description:
      'Get quick answers about roles, overlays, and what LaneUp is doing for you.',
    size: 'small',
  },
  {
    screen: 'settings',
    title: 'Settings',
    description:
      'Check runtime health, connect your Riot ID, and verify the local proxy is working.',
    size: 'small',
  },
]

interface HomeScreenProps {
  quest: QuestState
  selectedRole: RoleId | null
  onSelectRole: (role: RoleId) => void
  onStartQuest: () => void
  onSkip: () => void
  onOpenScreen: (screen: ScreenId) => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export function HomeScreen({
  quest,
  selectedRole,
  onSelectRole,
  onStartQuest,
  onSkip,
  onOpenScreen,
  theme,
  onToggleTheme,
}: HomeScreenProps) {
  const [showDestinations, setShowDestinations] = useState(Boolean(quest.activeRole))
  const [isTransitioning, setIsTransitioning] = useState(false)
  const activeQuestRole = quest.activeRole
  const pendingQuestChange =
    selectedRole !== null && selectedRole !== activeQuestRole
  const acceptedRole = activeQuestRole ?? selectedRole

  useEffect(() => {
    if (!quest.activeRole) {
      const resetTimer = window.setTimeout(() => {
        setShowDestinations(false)
        setIsTransitioning(false)
      }, 0)

      return () => {
        window.clearTimeout(resetTimer)
      }
    }

    const startTimer = window.setTimeout(() => {
      setIsTransitioning(true)
    }, 0)
    const revealTimer = window.setTimeout(() => {
      setShowDestinations(true)
    }, 110)
    const settleTimer = window.setTimeout(() => {
      setIsTransitioning(false)
    }, 420)

    return () => {
      window.clearTimeout(startTimer)
      window.clearTimeout(revealTimer)
      window.clearTimeout(settleTimer)
    }
  }, [quest.activeRole])

  return (
    <section className="screen-stack">
      <div
        className={`client-home-shell ${
          showDestinations ? 'show-destinations' : 'startup-only'
        } ${isTransitioning ? 'is-transitioning' : ''}`}
      >
        <div className="welcome-block">
          <div className="welcome-actions">
            <div className="welcome-actions-row">
              <button
                type="button"
                className="secondary-button"
                onClick={() => onOpenScreen('settings')}
              >
                Settings
              </button>
              <label className="theme-toggle" aria-label="Toggle light and dark mode">
                <span className="theme-toggle-label">
                  {theme === 'light' ? 'Light' : 'Dark'}
                </span>
                <button
                  type="button"
                  className={`theme-toggle-switch ${theme === 'dark' ? 'dark' : ''}`}
                  onClick={onToggleTheme}
                  aria-pressed={theme === 'dark'}
                >
                  <span className="theme-toggle-knob" />
                </button>
              </label>
            </div>
          </div>
          <p className="eyebrow centered">First login setup</p>
          <h2 className="welcome-title">Welcome to LaneUp</h2>
          <p className="welcome-copy">
            Pick the role you want to learn first, then choose what part of
            LaneUp you want to open.
          </p>
        </div>

        <div className="quest-strip">
          <span className="status-chip">
            Active quest: {activeQuestRole ? roles[activeQuestRole].name : 'Not set'}
          </span>
          <button className="secondary-button" onClick={onSkip} type="button">
            Decide later
          </button>
        </div>

        <div className="honor-role-stage">
          {roleSelectorOrder.map((role) => (
            <button
              key={role.id}
              type="button"
              className={`role-selector-card ${
                selectedRole === role.id ? 'selected' : ''
              }`}
              onClick={() => onSelectRole(role.id)}
            >
              <div className="role-selector-backdrop" />
              <div className="role-selector-icon">
                <img src={role.icon} alt="" className="role-selector-icon-image" />
              </div>
              <span className="role-selector-name">{role.label}</span>
              <span className="role-selector-subtitle difficulty-pill">
                <span className="difficulty-label">Difficulty</span>
                <img
                  src={difficultyIconMap[role.id].icon}
                  alt=""
                  className="difficulty-icon"
                />
                <span className="sr-only">{difficultyIconMap[role.id].label}</span>
              </span>
            </button>
          ))}
        </div>

        {pendingQuestChange && selectedRole ? (
          <div className="quest-confirm-strip reveal-in">
            <div>
              <p className="eyebrow">Quest change</p>
              <h3>
                {activeQuestRole
                  ? `Switch from ${roles[activeQuestRole].name} to ${roles[selectedRole].name}?`
                  : `Start your ${roles[selectedRole].name} quest?`}
              </h3>
              <p>
                {activeQuestRole
                  ? 'Your current quest will stay active until you confirm the new one.'
                  : 'Confirm your first role before opening the starter menu.'}
              </p>
            </div>
            <button className="primary-button" onClick={onStartQuest} type="button">
              Accept Quest
            </button>
          </div>
        ) : null}

        {showDestinations && acceptedRole ? (
          <div className="client-grid reveal-in">
            {destinationCards.map((card) => (
              <button
                key={card.screen}
                type="button"
                className={`client-card ${card.size}`}
                onClick={() => {
                  onOpenScreen(card.screen)
                }}
              >
                <div className="client-card-overlay" />
                <div className="client-card-content">
                  <p className="eyebrow">{roles[acceptedRole].name} starter path</p>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
