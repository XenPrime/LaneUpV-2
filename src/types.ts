export type RoleId = 'top' | 'jungle' | 'middle' | 'bottom' | 'utility'

export type ScreenId =
  | 'home'
  | 'guide'
  | 'builds'
  | 'profile'
  | 'faq'
  | 'champ-select'
  | 'in-game'
  | 'post-game'
  | 'settings'

export interface RoleInfoCard {
  title: string
  description: string
}

export interface RoleChecklistItem {
  title: string
  detail: string
}

export interface RoleScenarioTip {
  situation: string
  response: string
}

export interface RoleContent {
  id: RoleId
  name: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Medium-Hard'
  summary: string
  simpleSummary: string
  responsibilityCards: RoleInfoCard[]
  simpleResponsibilityCards: RoleInfoCard[]
  responsibilities: string[]
  simpleResponsibilities: string[]
  phases: {
    early: string
    mid: string
    late: string
  }
  simplePhases: {
    early: string
    mid: string
    late: string
  }
  goodFights: string[]
  avoidFights: string[]
  synergyTitle: string
  synergyPoints: string[]
  nextGameChecklist: RoleChecklistItem[]
  matchupReminders: RoleScenarioTip[]
  practiceHabits: string[]
  championRecommendations: {
    easy: Array<{
      champion: string
      reason: string
    }>
    hard: Array<{
      champion: string
      reason: string
    }>
  }
  simpleChampionRecommendations: Array<{
    champion: string
    reason: string
  }>
  footerNote: string
}

export interface QuestState {
  activeRole: RoleId | null
  rolePickedDuringOnboarding: RoleId | null
}

export interface PracticeJournalState {
  weeklyGoal: string
  nextGameFocus: string
  notes: string
  confidence: 'Building' | 'Steady' | 'Ready'
}

export interface RiotAccountConfig {
  gameName: string
  tagLine: string
  regionalRouting: 'americas' | 'europe' | 'asia' | 'sea'
}

export interface RiotRecentMatch {
  matchId: string
  champion: string
  queueLabel: string
  result: 'Victory' | 'Defeat'
  kills: number
  deaths: number
  assists: number
  roleLabel: string
  startedAt: string
  durationLabel: string
}

export interface CurrentLeagueIdentity {
  displayName: string
  gameName: string | null
  tagLine: string | null
}

export interface LobbyPreferences {
  firstPositionPreference: RoleId
  secondPositionPreference: RoleId
}

export interface ChampionSelectState {
  assignedPosition: RoleId
  isAutofilled: boolean
  mismatchWithQuest: boolean
  shouldNudgeQuest: boolean
  queueIntent: {
    firstChoice: RoleId
    secondChoice: RoleId
  }
  hoverChampion: string
  lockInChampion: string
  teamCompIdentity: string
  teamCompSummary: string
  playerJob: string
  safeGuidance: string[]
  allySlots: Array<{
    slotLabel: string
    champion: string
    role: RoleId
    relation: 'self' | 'party' | 'ally'
  }>
  enemySlots: Array<{
    champion: string
    role: RoleId
    threat: string
  }>
}

export interface MatchupInfo {
  championName: string
  archetype: string
  threatLevel: 'Low' | 'Medium' | 'High'
  tradingTip: string
  watchOut: string
  winCondition: string
  currentPhaseTip: string
}

export interface LiveStats {
  champion: string
  summonerLevel: number
  kills: number
  deaths: number
  assists: number
  cs: number
  vision: number
  gold: number
  gameTime: string
  currentPhase: 'Early' | 'Mid' | 'Late'
  roleFocus: string
  laneState: string
  csTarget: string
  objectiveWindow: string
  positioningCue: string
  referenceNotes: string[]
  csPaceTip: string
  kpTip: string
  visionTip: string
}

export interface PostGameSummary {
  result: 'Victory' | 'Defeat'
  grade: string
  strengths: string[]
  focusNextGame: string[]
  matchStory: string
  deathPatterns: Array<{
    title: string
    detail: string
    mapZone: string
  }>
  deathMapSummary: string
}

export type GameflowState =
  | 'None'
  | 'Lobby'
  | 'Matchmaking'
  | 'ReadyCheck'
  | 'ChampSelect'
  | 'GameStart'
  | 'InProgress'
  | 'WaitingForStats'
  | 'PreEndOfGame'
  | 'EndOfGame'
  | 'TerminatedInError'

export type ProviderStatus = 'mock' | 'searching' | 'connected' | 'idle' | 'error'

export interface RuntimeStatus {
  overwolfAvailable: boolean
  leagueRunning: boolean
  lcu: ProviderStatus
  liveClient: ProviderStatus
  gameEvents: ProviderStatus
  lockfilePath: string | null
  lastError: string | null
  gameflowState: GameflowState
  enemyChampions: string[]
  laneOpponent: string | null
  matchup: MatchupInfo | null
}
