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
  queueIntent: {
    firstChoice: 'utility',
    secondChoice: 'middle',
  },
  hoverChampion: 'Lux',
  lockInChampion: 'Lux',
  teamCompIdentity: 'Protect-and-poke teamfight comp',
  teamCompSummary:
    'Your team has decent range, solid follow-up, and wants slower front-to-back fights rather than hard dives.',
  playerJob:
    'You are the bridge between wave control and team setup. Clear mid safely, move first when possible, and add poke before fights fully start.',
  safeGuidance: [
    'Your quest role is Support, but this match is Mid. Show assigned-role guidance without overwriting the long-term quest.',
    'Your comp wants cleaner setup, not random skirmishes. Play for wave control and grouped follow-up.',
    'Enemy engage is stronger than yours, so avoid standing first in fog and let fights start on your terms.',
  ],
  allySlots: [
    { slotLabel: 'You', champion: 'Lux', role: 'middle', relation: 'self' },
    { slotLabel: 'Ally 1', champion: 'Garen', role: 'top', relation: 'ally' },
    { slotLabel: 'Ally 2', champion: 'Sejuani', role: 'jungle', relation: 'ally' },
    { slotLabel: 'Ally 3', champion: 'Jinx', role: 'bottom', relation: 'ally' },
    { slotLabel: 'Ally 4', champion: 'Lulu', role: 'utility', relation: 'party' },
  ],
  enemySlots: [
    { champion: 'Malphite', role: 'top', threat: 'Reliable engage if grouped too tightly.' },
    { champion: 'Jarvan IV', role: 'jungle', threat: 'Strong early pathing pressure into river fights.' },
    { champion: 'Yasuo', role: 'middle', threat: 'Punishes poor spacing once fights get messy.' },
    { champion: 'Kai’Sa', role: 'bottom', threat: 'Dangerous follow-up if your frontline breaks.' },
    { champion: 'Nautilus', role: 'utility', threat: 'Primary pick tool in grouped fights.' },
  ],
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
  roleFocus: 'Play around wave priority, then move with your nearest teammate.',
  laneState: 'Mid wave can be cleared safely before the next river check.',
  csTarget: 'At 18:42, a stable benchmark is around 125-140 CS. You are behind pace, so farm is still valuable.',
  objectiveWindow: 'Dragon is the next likely teamfight. Resetting on time matters more than one extra risky wave.',
  positioningCue:
    'Stand where you can hit front targets without becoming the first visible champion in fog.',
  referenceNotes: [
    'Treat this panel as a reference overlay, not a command system.',
    'If wave is not secure, default back to farm before trying to move first.',
    'Your safest contribution is poke plus follow-up from behind your frontline.',
  ],
  csPaceTip:
    'CS pace is behind ideal mid-lane tempo, so wave cleanup is still one of the safest ways to improve this game.',
  kpTip:
    'Kill participation is healthy enough to matter, but there is still room to arrive faster on objective fights.',
  visionTip:
    'Vision score is on pace for a utility-heavy game, but one earlier ward before the next objective would make setup cleaner.',
}

export const mockPostGameSummary: PostGameSummary = {
  result: 'Victory',
  grade: 'B+',
  matchStory:
    'You were useful in grouped fights and helped objective setups, but several deaths came from staying on the map one step too long before resets.',
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
  deathPatterns: [
    {
      title: 'Late mid-lane reset',
      detail:
        'One death happened after staying for an extra wave with dragon timing approaching. The bigger issue was timing, not mechanics.',
      mapZone: 'Mid river entrance',
    },
    {
      title: 'Side-lane isolation',
      detail:
        'A later death happened while collecting a side wave without enough nearby support. The map state asked for safer grouping.',
      mapZone: 'Bottom outer lane',
    },
    {
      title: 'Fog-first positioning',
      detail:
        'One death started by walking into vision first instead of letting frontline or wards reveal space.',
      mapZone: 'Baron river choke',
    },
  ],
  deathMapSummary:
    'Your deaths were concentrated near transition areas between lane and river, which usually points to timing and positioning mistakes rather than lane fundamentals.',
}
