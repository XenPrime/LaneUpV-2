import { useMemo, useState } from 'react'
import './App.css'
import { ChampionStatsScreen } from './components/ChampionStatsScreen'
import { ChampionSelectScreen } from './components/ChampionSelectScreen'
import { FaqScreen } from './components/FaqScreen'
import { HomeScreen } from './components/HomeScreen'
import { InGameOverlayScreen } from './components/InGameOverlayScreen'
import { PostGameScreen } from './components/PostGameScreen'
import { ProfileScreen } from './components/ProfileScreen'
import { RoleGuideScreen } from './components/RoleGuideScreen'
import { SettingsScreen } from './components/SettingsScreen'
import {
  initialQuestState,
  mockChampionSelectState,
  mockLiveStats,
  mockLobbyPreferences,
  mockPostGameSummary,
} from './data/mockState'
import { useRiotMatchHistory } from './hooks/useRiotMatchHistory'
import { useLaneUpRuntime } from './hooks/useLaneUpRuntime'
import { roles } from './data/roles'
import type {
  PracticeJournalState,
  ProviderStatus,
  RiotAccountConfig,
  RoleId,
  RuntimeStatus,
  ScreenId,
} from './types'

function formatProviderStatus(label: string, status: ProviderStatus) {
  const text =
    status === 'connected'
      ? 'Connected'
      : status === 'searching'
        ? 'Searching'
        : status === 'idle'
          ? 'Idle'
          : status === 'error'
            ? 'Error'
            : 'Mock'

  return `${label}: ${text}`
}

function getRuntimeBanner(status: RuntimeStatus) {
  if (!status.overwolfAvailable) {
    return 'Browser preview mode. Overwolf, League game events, and local Riot data will attach when the app runs inside Overwolf.'
  }

  if (!status.leagueRunning) {
    return 'Overwolf detected. Waiting for League to launch so LaneUp2 can attach live local data and in-game windows.'
  }

  if (status.lcu === 'connected' && status.liveClient === 'connected') {
    return 'League detected. Local client data and live game data are connected.'
  }

  if (status.lcu === 'error' || status.liveClient === 'error') {
    return 'League is running, but one of the local data providers still needs attention. LaneUp2 is falling back gracefully where needed.'
  }

  return 'League detected. LaneUp2 is still attaching to local data sources.'
}

function App() {
  const params = new URLSearchParams(window.location.search)
  const requestedScreen = params.get('screen') as ScreenId | null
  const shellMode = params.get('shell')
  const storedTheme =
    typeof window !== 'undefined' ? window.localStorage.getItem('laneup2-theme') : null
  const storedGuideMode =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('laneup2-guide-mode')
      : null
  const storedJournal =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('laneup2-practice-journal')
      : null
  const storedRiotAccount =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('laneup2-riot-account')
      : null
  const storedRiotInstallPath =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('laneup2-riot-install-path')
      : null

  const initialScreen: ScreenId =
    requestedScreen &&
    [
      'home',
      'guide',
      'builds',
      'profile',
      'faq',
      'champ-select',
      'in-game',
      'post-game',
      'settings',
    ].includes(requestedScreen)
      ? requestedScreen
      : shellMode === 'in-game'
        ? 'in-game'
        : 'home'

  const [activeScreen, setActiveScreen] = useState<ScreenId>(initialScreen)
  const [theme, setTheme] = useState<'light' | 'dark'>(
    storedTheme === 'dark' ? 'dark' : 'light',
  )
  const [guideMode, setGuideMode] = useState<'detailed' | 'simple'>(
    storedGuideMode === 'simple' ? 'simple' : 'detailed',
  )
  const [journal, setJournal] = useState<PracticeJournalState>(() => {
    if (storedJournal) {
      try {
        return JSON.parse(storedJournal) as PracticeJournalState
      } catch {
        return {
          weeklyGoal: 'Play two games with one role and one learning goal.',
          nextGameFocus: 'Pick one simple habit and repeat it all game.',
          notes: 'What felt hard? What felt easier than last time?',
          confidence: 'Building',
        }
      }
    }

    return {
      weeklyGoal: 'Play two games with one role and one learning goal.',
      nextGameFocus: 'Pick one simple habit and repeat it all game.',
      notes: 'What felt hard? What felt easier than last time?',
      confidence: 'Building',
    }
  })
  const [riotAccount, setRiotAccount] = useState<RiotAccountConfig>(() => {
    if (storedRiotAccount) {
      try {
        return JSON.parse(storedRiotAccount) as RiotAccountConfig
      } catch {
        return {
          gameName: '',
          tagLine: '',
          regionalRouting: 'americas',
        }
      }
    }

    return {
      gameName: '',
      tagLine: '',
      regionalRouting: 'americas',
    }
  })
  const [riotInstallPath, setRiotInstallPath] = useState<string>(
    storedRiotInstallPath ?? '',
  )
  const [riotHistoryLoadRequestCount, setRiotHistoryLoadRequestCount] = useState(0)
  const [quest, setQuest] = useState(initialQuestState)
  const [selectedRole, setSelectedRole] = useState<RoleId | null>(
    initialQuestState.rolePickedDuringOnboarding,
  )
  const [guideRole, setGuideRole] = useState<RoleId>(quest.activeRole ?? 'utility')
  const runtime = useLaneUpRuntime(quest, riotInstallPath)
  const riotMatchHistory = useRiotMatchHistory(
    riotAccount,
    riotHistoryLoadRequestCount,
  )

  const heroSummary = useMemo(() => {
    if (activeScreen === 'champ-select') {
      return getRuntimeBanner(runtime.status)
    }

    const role = quest.activeRole ? roles[quest.activeRole] : null
    if (!role) {
      return getRuntimeBanner(runtime.status)
    }

    return `${role.name} quest active. ${getRuntimeBanner(runtime.status)}`
  }, [activeScreen, quest.activeRole, runtime.status])

  const startQuest = () => {
    if (!selectedRole) {
      return
    }

    setQuest({
      activeRole: selectedRole,
      rolePickedDuringOnboarding: selectedRole,
    })
    setGuideRole(selectedRole)
  }

  const skipQuest = () => {
    setQuest({
      activeRole: null,
      rolePickedDuringOnboarding: null,
    })
    setActiveScreen('champ-select')
  }

  const toggleTheme = () => {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light'
      window.localStorage.setItem('laneup2-theme', nextTheme)
      return nextTheme
    })
  }

  const toggleGuideMode = () => {
    setGuideMode((currentMode) => {
      const nextMode = currentMode === 'detailed' ? 'simple' : 'detailed'
      window.localStorage.setItem('laneup2-guide-mode', nextMode)
      return nextMode
    })
  }

  const updateJournal = (nextJournal: PracticeJournalState) => {
    setJournal(nextJournal)
    window.localStorage.setItem(
      'laneup2-practice-journal',
      JSON.stringify(nextJournal),
    )
  }

  const updateRiotAccount = (nextAccount: RiotAccountConfig) => {
    setRiotAccount(nextAccount)
    window.localStorage.setItem('laneup2-riot-account', JSON.stringify(nextAccount))
  }

  const updateRiotInstallPath = (nextPath: string) => {
    setRiotInstallPath(nextPath)
    window.localStorage.setItem('laneup2-riot-install-path', nextPath)
  }

  const requestRiotHistoryLoad = () => {
    setRiotHistoryLoadRequestCount((count) => count + 1)
  }

  const showTopBanner = import.meta.env.VITE_SHOW_TOP_BANNER === 'true'

  return (
    <div className="app-shell" data-theme={theme}>
      <main className="content-shell">
        {showTopBanner && activeScreen !== 'home' ? (
          <section className="top-banner">
            <div>
              <p className="eyebrow">Secondary coded prototype</p>
              <h2>LaneUp2 product shell</h2>
            </div>
            <div className="top-banner-actions">
              <p className="top-banner-copy">
                {shellMode === 'in-game'
                  ? 'In-game Overwolf window mode. The overlay stays compact and focused on live guidance.'
                  : heroSummary}
              </p>
              <div className="top-right-actions">
                <label className="theme-toggle" aria-label="Toggle light and dark mode">
                  <span className="theme-toggle-label">
                    {theme === 'light' ? 'Light' : 'Dark'}
                  </span>
                  <button
                    type="button"
                    className={`theme-toggle-switch ${theme === 'dark' ? 'dark' : ''}`}
                    onClick={toggleTheme}
                    aria-pressed={theme === 'dark'}
                  >
                    <span className="theme-toggle-knob" />
                  </button>
                </label>
                {shellMode !== 'in-game' ? (
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setActiveScreen('home')}
                  >
                    Home
                  </button>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        {activeScreen === 'home' ? (
          <HomeScreen
            quest={quest}
            selectedRole={selectedRole}
            onSelectRole={setSelectedRole}
            onStartQuest={startQuest}
            onSkip={skipQuest}
            onOpenScreen={setActiveScreen}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        ) : null}

        {activeScreen === 'guide' ? (
          <RoleGuideScreen
            activeRole={guideRole}
            onSelectRole={setGuideRole}
            guideMode={guideMode}
            onToggleGuideMode={toggleGuideMode}
            onBackToHome={() => setActiveScreen('home')}
          />
        ) : null}

        {activeScreen === 'builds' ? (
          <ChampionStatsScreen activeRole={guideRole} />
        ) : null}

        {activeScreen === 'profile' ? (
          <ProfileScreen
            quest={quest}
            journal={journal}
            onUpdateJournal={updateJournal}
          />
        ) : null}

        {activeScreen === 'faq' ? <FaqScreen /> : null}

        {activeScreen === 'champ-select' ? (
          <ChampionSelectScreen
            quest={quest}
            lobby={runtime.lobby ?? mockLobbyPreferences}
            championSelect={runtime.championSelect ?? mockChampionSelectState}
            sourceLabel={formatProviderStatus('LCU', runtime.status.lcu)}
            onBackToHome={() => setActiveScreen('home')}
          />
        ) : null}

        {activeScreen === 'in-game' ? (
          <InGameOverlayScreen
            liveStats={runtime.liveStats ?? mockLiveStats}
            sourceLabel={formatProviderStatus('Live Client', runtime.status.liveClient)}
          />
        ) : null}

        {activeScreen === 'post-game' ? (
          <PostGameScreen
            summary={runtime.postGameSummary ?? mockPostGameSummary}
            sourceLabel={formatProviderStatus('Post-game', runtime.status.lcu)}
            riotHistoryStatus={riotMatchHistory.status}
            riotHistoryError={riotMatchHistory.error}
            resolvedAccount={riotMatchHistory.resolvedAccount}
            recentMatches={riotMatchHistory.matches}
          />
        ) : null}

        {activeScreen === 'settings' ? (
          <SettingsScreen
            runtimeStatus={runtime.status}
            riotAccount={riotAccount}
            onUpdateRiotAccount={updateRiotAccount}
            riotInstallPath={riotInstallPath}
            onUpdateRiotInstallPath={updateRiotInstallPath}
            onLoadRiotHistory={requestRiotHistoryLoad}
            riotHistoryStatus={riotMatchHistory.status}
            resolvedAccount={riotMatchHistory.resolvedAccount}
            riotHistoryError={riotMatchHistory.error}
            currentLeagueIdentity={runtime.currentLeagueIdentity}
          />
        ) : null}
      </main>
    </div>
  )
}

export default App
