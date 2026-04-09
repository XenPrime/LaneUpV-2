import type { RoleId } from '../types'

export const matchupLibrary: Record<
  RoleId,
  {
    lanePlan: string[]
    dangerWindows: string[]
    practiceDrills: string[]
    mapHabits: string[]
    nextGameFocus: string[]
  }
> = {
  utility: {
    lanePlan: [
      'Levels 1-3: protect health bars first, then look for poke or peel windows.',
      'First recall: buy a Control Ward and refresh lane vision before forcing another trade.',
      'First dragon setup: leave lane only after the wave is stable and your ADC can farm safely.',
    ],
    dangerWindows: [
      'Enemy engage support hits level 2 first.',
      'Bot lane disappears from vision while river is dark.',
      'Your ADC is farming alone while you are warding too deep.',
    ],
    practiceDrills: [
      'Place one vision ward before 1:30 every game.',
      'Call out one roam timer after your first base.',
      'Track whether you bought a Control Ward on each recall.',
    ],
    mapHabits: [
      'Refresh river vision before dragon timers instead of after enemies arrive.',
      'Hover near the teammate carrying the most gold once laning ends.',
      'Move first with your jungler when entering fog.',
    ],
    nextGameFocus: [
      'Peel first, engage second.',
      'Buy vision on every base.',
      'Leave lane only after bot wave is safe.',
    ],
  },
  top: {
    lanePlan: [
      'Levels 1-3: last-hit first and only trade when your minion wave is bigger.',
      'First recall: return with defensive stats if the lane is volatile, not greed.',
      'After first tower plate: decide if you are freezing near tower or crashing to reset.',
    ],
    dangerWindows: [
      'Enemy wave is stacked and you are trading inside it.',
      'You are past river with no ward and no teleport advantage.',
      'Enemy jungler shows bot and then disappears before your next shove.',
    ],
    practiceDrills: [
      'Call out one freeze, one slow push, and one crash each game.',
      'Use Teleport only for an objective, tower save, or fight you can name ahead of time.',
      'Track every death caused by overextending without vision.',
    ],
    mapHabits: [
      'Ward the long lane before walking up for the next three minions.',
      'Check dragon timer before committing Teleport for lane.',
      'Push side lane only when the opposite-side objective matters.',
    ],
    nextGameFocus: [
      'Trade with wave advantage only.',
      'Do not burn Teleport casually.',
      'Pick split push or group before 14 minutes.',
    ],
  },
  jungle: {
    lanePlan: [
      'First clear: finish a clean path before forcing low-percent ganks.',
      'First reset: buy tempo items and reset toward the objective side of the map.',
      'Before dragon: ping lanes 30 seconds early and clear vision first.',
    ],
    dangerWindows: [
      'You skip camps and fall a level behind trying to rescue losing lanes.',
      'Smite is down and you still start a neutral objective.',
      'You path into river without lane priority.',
    ],
    practiceDrills: [
      'Say your first clear out loud before the game starts.',
      'Review whether each gank had wave position plus lane follow-up.',
      'Count missed camp respawns after the match.',
    ],
    mapHabits: [
      'Look at the nearest pushing lane before every river entry.',
      'Base so you arrive on the side of the next objective.',
      'Trade cross-map when the enemy jungler shows first.',
    ],
    nextGameFocus: [
      'Full clear cleanly.',
      'Only gank with setup.',
      'Protect Smite for objectives.',
    ],
  },
  middle: {
    lanePlan: [
      'Levels 1-3: keep wave neutral until you know jungle pathing.',
      'Before roams: shove, confirm play, then move.',
      'After each roam: get back to mid fast enough to catch the next wave.',
    ],
    dangerWindows: [
      'You leave lane without crashing the wave.',
      'Both river sides are dark before 2:30.',
      'Enemy mid has prio and you still contest river first.',
    ],
    practiceDrills: [
      'Only roam after a successful shove three times in a row.',
      'Ward one side of river and play toward that side.',
      'Track whether your roam cost more than one wave.',
    ],
    mapHabits: [
      'Move first for dragon only when your wave is handled.',
      'Mirror your jungler on the side they want to contest.',
      'Reset after pushing when the next objective window is opening.',
    ],
    nextGameFocus: [
      'Wave first, roam second.',
      'Ward before 2:30.',
      'Return to mid quickly after each play.',
    ],
  },
  bottom: {
    lanePlan: [
      'Early lane: take the safe CS before any ego trade.',
      'First item window: start contesting space only after you can actually hold it.',
      'Before dragon: push bot wave first so the enemy has to answer farm or move.',
    ],
    dangerWindows: [
      'Enemy support hits level 2 first.',
      'Assassins are missing and you still walk through fog alone.',
      'You chase damage forward instead of hitting the nearest safe target.',
    ],
    practiceDrills: [
      'Track CS at 10 minutes after every game.',
      'In every fight, name the nearest safe target before autoing.',
      'Review every death that happened while farming one extra wave alone.',
    ],
    mapHabits: [
      'Stand on the same side as your support when possible.',
      'Rotate only after the wave is handled, not before.',
      'Play near vision and teammates after lane ends.',
    ],
    nextGameFocus: [
      'Farm first.',
      'Respect level spikes.',
      'Backline positioning over greedy damage.',
    ],
  },
}
