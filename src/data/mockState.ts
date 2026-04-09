import type {
  ChampionSelectState,
  LiveStats,
  LobbyPreferences,
  PostGameSummary,
  QuestState,
} from '../types'

export const initialQuestState: QuestState = {
  activeRole: 'utility',
  rolePickedDuringOnboarding: 'utility',
}

export const mockLobbyPreferences: LobbyPreferences = {
  firstPositionPreference: 'utility',
  secondPositionPreference: 'middle',
}

export const mockChampionSelectState: ChampionSelectState = {
  assignedPosition: 'middle',
  isAutofilled: false,
  mismatchWithQuest: true,
  shouldNudgeQuest: false,
}

export const mockLiveStats: LiveStats = {
  champion: 'Lux',
  summonerLevel: 26,
  kills: 2,
  deaths: 3,
  assists: 11,
  cs: 21,
  vision: 27,
  gold: 6840,
  gameTime: '18:42',
  currentPhase: 'Mid',
  tipHeadline: 'Move first, then ward',
  tipBody:
    'Your lane is pushed. Use that timing to ward river with your teammate instead of drifting there alone after the wave bounces back.',
}

export const mockPostGameSummary: PostGameSummary = {
  result: 'Victory',
  grade: 'B+',
  strengths: [
    'You placed vision before objective fights instead of after them.',
    'You died only once during lane, which kept your gold stable.',
    'You followed winning fights instead of starting every fight yourself.',
  ],
  focusNextGame: [
    'Reset earlier before dragon so you are on the map with wards and health.',
    'Spend less time hovering mid when your ADC is collecting a large bot wave.',
    'Upgrade your trinket usage into a habit: ward, sweep, then move with purpose.',
  ],
}
