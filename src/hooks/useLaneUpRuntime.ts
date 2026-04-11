import { useEffect, useRef, useState } from 'react'
import {
  initialQuestState,
  mockChampionSelectState,
  mockLiveStats,
  mockLobbyPreferences,
  mockPostGameSummary,
} from '../data/mockState'
import { roles } from '../data/roles'
import type {
  ChampionSelectState,
  CurrentLeagueIdentity,
  LiveStats,
  LobbyPreferences,
  PostGameSummary,
  ProviderStatus,
  QuestState,
  RoleId,
  RuntimeStatus,
} from '../types'
import {
  classifyChampionSelectState,
  detectAssignedRole,
  getOptionalJson,
  normalizeLobbyPreferences,
  normalizeRoleId,
  parseLockfile,
  CHAMPION_ID_TO_NAME,
  type LcuCredentials,
  type LcuChampSelectSession,
  type LcuCurrentSummoner,
  type LcuEogStatsBlock,
  type LcuLobbyResponse,
} from '../utils/lcu'
import {
  formatGameClock,
  getLiveClientData,
  inferGamePhase,
  type LiveClientSnapshot,
} from '../utils/liveClient'
import {
  addGameInfoUpdatedListener,
  getLeagueGameId,
  getRunningGameInfo,
  isOverwolfAvailable,
  readFileUtf8,
} from '../utils/overwolf'
import { getMatchupData } from '../data/archetypes'
import type { MatchupInfo } from '../types'

interface RuntimeState {
  lobby: LobbyPreferences
  championSelect: ChampionSelectState
  liveStats: LiveStats
  postGameSummary: PostGameSummary
  currentLeagueIdentity: CurrentLeagueIdentity | null
  enemyChampions: string[]
  laneOpponent: string | null
  matchup: MatchupInfo | null
  status: RuntimeStatus
}

const DEFAULT_STATUS: RuntimeStatus = {
  overwolfAvailable: false,
  leagueRunning: false,
  lcu: 'mock',
  liveClient: 'mock',
  gameEvents: 'mock',
  lockfilePath: null,
  lastError: null,
}

const DEFAULT_STATE: RuntimeState = {
  lobby: mockLobbyPreferences,
  championSelect: mockChampionSelectState,
  liveStats: mockLiveStats,
  postGameSummary: mockPostGameSummary,
  currentLeagueIdentity: null,
  enemyChampions: [],
  laneOpponent: null,
  matchup: null,
  status: DEFAULT_STATUS,
}

function getLockfileCandidates(
  installPathOverride?: string,
  executionPath?: string,
) {
  const fromExe = executionPath
    ? (() => {
        const normalized = executionPath.replace(/\\/g, '/').replace(/\/[^\/]+\.exe$/i, '')
        const parent = normalized.replace(/\/Game$/i, '')
        return [`${normalized}/lockfile`, `${parent}/lockfile`]
      })()
    : []

  const installCandidates = [
    installPathOverride,
    'C:/Riot Games/League of Legends',
    'C:/Riot Games/League of Legends/Game',
    'C:/Program Files/Riot Games/League of Legends',
    'C:/Program Files (x86)/Riot Games/League of Legends',
    'D:/Riot Games/League of Legends',
    'D:/Riot Games/League of Legends/Game',
    'D:/Program Files/Riot Games/League of Legends',
    'D:/Program Files (x86)/Riot Games/League of Legends',
  ].filter(Boolean) as string[]

  const allPaths = [
    ...fromExe,
    ...installCandidates.flatMap((path) => {
      const normalizedPath = path.replace(/\\/g, '/').replace(/\/$/, '')
      return normalizedPath.endsWith('/lockfile')
        ? [normalizedPath]
        : [normalizedPath, `${normalizedPath}/lockfile`]
    }),
  ]
  return Array.from(new Set(allPaths))
}

async function resolveLcuCredentials(
  installPathOverride?: string,
  executionPath?: string,
): Promise<{
  credentials: LcuCredentials
  lockfilePath: string
} | null> {
  if (!isOverwolfAvailable()) {
    return null
  }

  for (const path of getLockfileCandidates(installPathOverride, executionPath)) {
    const content = await readFileUtf8(path)
    if (!content) {
      continue
    }

    try {
      return {
        credentials: parseLockfile(content),
        lockfilePath: path,
      }
    } catch {
      // Keep scanning candidate paths.
    }
  }

  return null
}

function getRoleForLiveTips(
  quest: QuestState,
  championSelect: ChampionSelectState,
): RoleId {
  return quest.activeRole ?? championSelect.assignedPosition ?? initialQuestState.activeRole!
}

function buildLiveStats(
  snapshot: LiveClientSnapshot,
  roleId: RoleId,
): LiveStats | null {
  const seconds = snapshot.gameData?.gameTime
  if (typeof seconds !== 'number') {
    return null
  }

  const player =
    snapshot.allPlayers?.find(
      (candidate) =>
        candidate.summonerName &&
        candidate.summonerName === snapshot.activePlayer.summonerName,
    ) ?? snapshot.allPlayers?.find((candidate) => !candidate.isBot)

  const phase = inferGamePhase(seconds)
  const role = roles[roleId]
  const rolePhaseTip =
    phase === 'Early'
      ? role.simplePhases.early
      : phase === 'Mid'
        ? role.simplePhases.mid
        : role.simplePhases.late

  return {
    champion: player?.championName ?? 'Current champion',
    summonerLevel: snapshot.activePlayer.level,
    kills: player?.scores?.kills ?? 0,
    deaths: player?.scores?.deaths ?? 0,
    assists: player?.scores?.assists ?? 0,
    cs: player?.scores?.creepScore ?? 0,
    vision: player?.scores?.wardScore ?? 0,
    gold: Math.round(snapshot.activePlayer.currentGold ?? 0),
    gameTime: formatGameClock(seconds),
    currentPhase: phase,
    roleFocus: `${role.name} ${phase.toLowerCase()} focus: ${rolePhaseTip}`,
    laneState:
      phase === 'Early'
        ? 'Lane fundamentals still matter most. Farm, spacing, and safe trades come first.'
        : phase === 'Mid'
          ? 'Wave control and grouped movement matter more than isolated skirmishes.'
          : 'Deaths become more expensive now, so setup and positioning are higher value.',
    csTarget:
      roleId === 'utility'
        ? 'CS is secondary for Support. Track map presence, wards, and safe movement instead.'
        : `Use CS as a neutral benchmark for ${phase.toLowerCase()} game discipline rather than a hard command.`,
    objectiveWindow:
      phase === 'Early'
        ? 'Think about the next objective by preparing the map early, not by forcing action.'
        : phase === 'Mid'
          ? 'Mid game is usually about arriving on time with vision and teammates.'
          : 'Late game objective setup matters more than one extra risky wave.',
    positioningCue:
      roleId === 'bottom'
        ? 'Stay on the safe side of the fight and hit what is reachable without stepping into danger first.'
        : roleId === 'utility'
          ? 'Stand where you can protect teammates without becoming the easiest engage target.'
          : 'Play from visible, safer space before you commit deeper into fog or choke points.',
    referenceNotes: [
      'This overlay should stay descriptive and educational, not reactive or commanding.',
      'Use it as a quick reminder layer during pauses in attention, not as a second minimap.',
      `${role.name} fundamentals still matter more than fancy reads when the game gets messy.`,
    ],
    // Smart live tips based on actual stats
    csPaceTip: (() => {
      if (roleId === 'utility') return 'CS is not your priority as Support. Focus on vision control and protecting your carry.'
      const minutesPlayed = seconds / 60
      if (minutesPlayed < 2) return 'Game just started — focus on last-hitting every minion in the first wave.'
      const csPerMin = cs / minutesPlayed
      const expectedCs = Math.round(minutesPlayed * 8)
      const csDiff = cs - expectedCs
      if (csPerMin < 5)
        return `You are ${Math.abs(csDiff)} CS below the 8/min pace. Last-hitting is your highest priority right now — nothing else matters as much.`
      if (csPerMin < 7)
        return `CS pace is ${csPerMin.toFixed(1)}/min — a bit below 8/min target. Stay on waves and only leave when there is nothing to last-hit.`
      return `CS pace is ${csPerMin.toFixed(1)}/min — on track. Keep the wave discipline and look for fights between waves.`
    })(),
    kpTip: (() => {
      const myKills = player?.scores?.kills ?? 0
      const myAssists = player?.scores?.assists ?? 0
      const teamKills = (snapshot.allPlayers ?? [])
        .filter((p) => p.team === player?.team)
        .reduce((sum, p) => sum + (p.scores?.kills ?? 0), 0)
      const kp = teamKills > 0 ? Math.round(((myKills + myAssists) / teamKills) * 100) : 0
      if (phase === 'Early')
        return 'Early game — focus on your lane before tracking kill participation.'
      if (kp < 25)
        return `Kill participation is ${kp}%. You are missing too many fights. Check the minimap and move toward your team before objectives.`
      if (kp < 45)
        return `Kill participation at ${kp}%. Try to join one more skirmish per objective window.`
      return `Kill participation is ${kp}% — solid. You are making yourself useful in fights. Keep it up.`
    })(),
    visionTip: (() => {
      const minutesPlayed = seconds / 60
      if (minutesPlayed < 3) return 'Place your starting ward in the bush that covers the most common gank path for your lane.'
      const wardBenchmarks: Partial<Record<RoleId, number>> = {
        utility: 1.5, jungle: 1.0, top: 0.5, middle: 0.6, bottom: 0.4,
      }
      const benchmark = wardBenchmarks[roleId] ?? 0.5
      const actualWardsPerMin = vision / minutesPlayed
      if (actualWardsPerMin < benchmark * 0.6)
        return `Vision score is low for ${role.name}. Buy a Control Ward on your next back and place it at the next objective before it spawns.`
      if (actualWardsPerMin < benchmark)
        return `Vision is slightly below the ${role.name} benchmark. Add one more ward placement per minute around objectives.`
      return `Vision score is on track for ${role.name}. Keep warding objective areas before they spawn.`
    })(),
  }
}

function getNumericStat(
  payload: Record<string, number | string | null> | undefined,
  ...keys: string[]
) {
  if (!payload) {
    return null
  }

  for (const key of keys) {
    const value = payload[key]
    if (typeof value === 'number') {
      return value
    }
  }

  return null
}

function buildPostGameSummary(
  payload: LcuEogStatsBlock,
  roleId: RoleId,
): PostGameSummary | null {
  const stats = payload.data?.stats ?? payload.stats
  const kills =
    payload.data?.kills ??
    getNumericStat(stats, 'CHAMPIONS_KILLED', 'kills', 'kills_total') ??
    0
  const deaths =
    payload.data?.deaths ??
    getNumericStat(stats, 'NUM_DEATHS', 'deaths', 'deaths_total') ??
    0
  const assists =
    payload.data?.assists ??
    getNumericStat(stats, 'ASSISTS', 'assists', 'assists_total') ??
    0
  const vision =
    payload.data?.visionScore ??
    getNumericStat(stats, 'VISION_SCORE', 'visionScore') ??
    0
  const cs =
    getNumericStat(stats, 'MINIONS_KILLED', 'neutralMinionsKilled', 'totalMinionsKilled') ??
    0

  const score = kills + assists - deaths + Math.floor(vision / 8)
  const grade =
    score >= 22 ? 'S-' : score >= 16 ? 'A-' : score >= 10 ? 'B+' : score >= 5 ? 'B' : 'C'

  const resultValue = payload.data?.gameResult ?? payload.gameResult ?? ''
  const result = /win/i.test(resultValue) ? 'Victory' : 'Defeat'

  const strengths: string[] = []
  const focusNextGame: string[] = []

  if (deaths <= 4) {
    strengths.push('You kept your deaths manageable, which protected your tempo and item timing.')
  }
  if (vision >= 20 || roleId === 'utility') {
    strengths.push('Your vision contribution gave your team safer information around fights and objectives.')
  }
  if (kills + assists >= 10) {
    strengths.push('You were involved in enough takedowns to matter in the game instead of drifting on the map.')
  }

  if (strengths.length < 3) {
    strengths.push('You stayed in the game long enough to keep learning instead of mentally checking out after mistakes.')
  }
  if (strengths.length < 3) {
    strengths.push('You have a usable baseline now - the next gains come from cleaner resets and map timing.')
  }

  if (deaths >= 6) {
    focusNextGame.push('Respect danger a bit earlier so you stop losing tempo to repeat deaths before the next objective.')
  }
  if (cs < 120 && roleId !== 'utility') {
    focusNextGame.push('Protect your farm more consistently so your gold curve matches the stage of the game.')
  }
  if (vision < 15 && roleId !== 'bottom') {
    focusNextGame.push('Add more ward timing before you move into river or jungle so fights start with information.')
  }

  if (focusNextGame.length < 3) {
    focusNextGame.push('Reset a little earlier before major objectives so you arrive with health, wards, and time to set up.')
  }
  if (focusNextGame.length < 3) {
    focusNextGame.push('Choose one lane assignment with purpose instead of hovering between plays and arriving late.')
  }
  if (focusNextGame.length < 3) {
    focusNextGame.push('Use the next game to repeat the same fundamentals rather than trying to fix everything at once.')
  }

  return {
    result,
    grade,
    matchStory:
      deaths >= 6
        ? 'The game stayed playable, but repeated deaths pulled tempo away from your stronger moments and objective setups.'
        : 'Your game held together because your mistakes stayed limited enough for the rest of your decisions to matter.',
    strengths: strengths.slice(0, 3),
    focusNextGame: focusNextGame.slice(0, 3),
    deathPatterns: [
      {
        title: 'Objective timing death',
        detail:
          'One or more deaths likely came from staying on the map too long before a major fight window.',
        mapZone: 'River approach',
      },
      {
        title: 'Transition death',
        detail:
          'The risky moments happened while moving between lane and river rather than during clean setup.',
        mapZone: 'Lane-to-river path',
      },
      {
        title: 'Vision gap death',
        detail:
          'At least one death pattern suggests moving into space before information was secured.',
        mapZone: 'Fog edge',
      },
    ],
    deathMapSummary:
      'Without exact coordinates yet, the review should still explain the likely type of death pattern and what game-state mistake caused it.',
  }
}

export function useLaneUpRuntime(quest: QuestState, riotInstallPath?: string) {
  const [runtime, setRuntime] = useState<RuntimeState>(DEFAULT_STATE)
  const runtimeRef = useRef(runtime)
  const lcuRef = useRef<LcuCredentials | null>(null)
  const pollingRef = useRef(false)

  useEffect(() => {
    runtimeRef.current = runtime
  }, [runtime])

  useEffect(() => {
    const refresh = async () => {
      if (pollingRef.current) {
        return
      }

      pollingRef.current = true

      try {
        const overwolfReady = isOverwolfAvailable()
        const runningInfo = await getRunningGameInfo()
        const leagueRunning =
          runningInfo?.id === getLeagueGameId() && runningInfo?.isRunning === true

        let lcuStatus: ProviderStatus = overwolfReady ? 'searching' : 'mock'
        let liveClientStatus: ProviderStatus = leagueRunning ? 'searching' : overwolfReady ? 'idle' : 'mock'
        const gameEventsStatus: ProviderStatus = overwolfReady
          ? leagueRunning
            ? 'connected'
            : 'idle'
          : 'mock'

        let lockfilePath = runtimeRef.current.status.lockfilePath
        let lastError: string | null = null

        let nextLobby = runtimeRef.current.lobby
        let nextChampionSelect = runtimeRef.current.championSelect
        let nextLiveStats = runtimeRef.current.liveStats
        let nextPostGame = runtimeRef.current.postGameSummary
        let nextCurrentLeagueIdentity = runtimeRef.current.currentLeagueIdentity

        // Matchup tracking
        let nextEnemyChampions: string[] = runtimeRef.current.enemyChampions
        let nextLaneOpponent: string | null = runtimeRef.current.laneOpponent
        let nextMatchup: MatchupInfo | null = runtimeRef.current.matchup

        if (overwolfReady && !lcuRef.current) {
          const resolved = await resolveLcuCredentials(
            riotInstallPath,
            (runningInfo as { executionPath?: string } | null)?.executionPath,
          )
          if (resolved) {
            lcuRef.current = resolved.credentials
            lockfilePath = resolved.lockfilePath
            lcuStatus = 'connected'
          } else {
            lcuStatus = 'searching'
          }
        }

        if (lcuRef.current) {
          try {
            const [lobbyResponse, sessionResponse, eogResponse, currentSummonerResponse] = await Promise.all([
              getOptionalJson<LcuLobbyResponse>(
                lcuRef.current.port,
                lcuRef.current.password,
                '/lol-lobby/v2/lobby',
              ),
              getOptionalJson<LcuChampSelectSession>(
                lcuRef.current.port,
                lcuRef.current.password,
                '/lol-champ-select/v1/session',
              ),
              getOptionalJson<LcuEogStatsBlock>(
                lcuRef.current.port,
                lcuRef.current.password,
                '/lol-end-of-game/v1/eog-stats-block',
              ),
              getOptionalJson<LcuCurrentSummoner>(
                lcuRef.current.port,
                lcuRef.current.password,
                '/lol-summoner/v1/current-summoner',
              ),
            ])

            nextLobby = normalizeLobbyPreferences(lobbyResponse, nextLobby)

            if (sessionResponse) {
              const assignedRole =
                detectAssignedRole(
                  sessionResponse.localPlayerCellId,
                  sessionResponse.myTeam,
                ) ?? nextChampionSelect.assignedPosition

              nextChampionSelect = classifyChampionSelectState(
                quest,
                nextLobby,
                assignedRole,
              )
            }

            if (eogResponse) {
              const postGame = buildPostGameSummary(
                eogResponse,
                getRoleForLiveTips(quest, nextChampionSelect),
              )
              if (postGame) {
                nextPostGame = postGame
              }
            }

            if (currentSummonerResponse) {
              nextCurrentLeagueIdentity = {
                displayName: currentSummonerResponse.displayName ?? 'League player',
                gameName: currentSummonerResponse.gameName ?? null,
                tagLine: currentSummonerResponse.tagLine ?? null,
              }
            }

            lcuStatus = 'connected'
          } catch (error) {
            lcuStatus = 'error'
            lastError = error instanceof Error ? error.message : 'LCU connection failed.'
          }
        }

        if (leagueRunning) {
          try {
            const liveClientSnapshot = await getLiveClientData()
            const mappedLiveStats = buildLiveStats(
              liveClientSnapshot,
              getRoleForLiveTips(quest, nextChampionSelect),
            )

            if (mappedLiveStats) {
              nextLiveStats = mappedLiveStats
              liveClientStatus = 'connected'

              // Detect enemies from live game data
              if (liveClientSnapshot.allPlayers && liveClientSnapshot.allPlayers.length > 0) {
                const myPlayerEntry = liveClientSnapshot.allPlayers.find(
                  (p) => p.summonerName === liveClientSnapshot.activePlayer.summonerName,
                )
                const myTeamId = myPlayerEntry?.team ?? 'ORDER'
                const enemies = liveClientSnapshot.allPlayers
                  .filter((p) => p.team !== myTeamId && !p.isBot)
                  .map((p) => p.championName)
                  .filter(Boolean)
                if (enemies.length > 0) {
                  nextEnemyChampions = enemies
                  // Keep champ-select opponent if already resolved, else use first enemy
                  if (!nextLaneOpponent && enemies[0]) {
                    nextLaneOpponent = enemies[0]
                  }
                  if (nextLaneOpponent) {
                    const matchupData = getMatchupData(nextLaneOpponent)
                    const phase = mappedLiveStats.currentPhase
                    nextMatchup = {
                      championName: matchupData.championName,
                      archetype: matchupData.archetype,
                      threatLevel: matchupData.threatLevel,
                      tradingTip: matchupData.tradingTip,
                      watchOut: matchupData.watchOut,
                      winCondition: matchupData.winCondition,
                      currentPhaseTip:
                        phase === 'Mid'
                          ? matchupData.phaseTips.mid
                          : phase === 'Late'
                          ? matchupData.phaseTips.late
                          : matchupData.phaseTips.early,
                    }
                  }
                }
              }
            }
          } catch (error) {
            liveClientStatus = 'error'
            lastError =
              error instanceof Error ? error.message : 'Live Client data unavailable.'
          }
        }

        setRuntime({
          lobby: nextLobby,
          championSelect: nextChampionSelect,
          liveStats: nextLiveStats,
          postGameSummary: nextPostGame,
          currentLeagueIdentity: nextCurrentLeagueIdentity,
          enemyChampions: nextEnemyChampions,
          laneOpponent: nextLaneOpponent,
          matchup: nextMatchup,
          status: {
            overwolfAvailable: overwolfReady,
            leagueRunning,
            lcu: lcuStatus,
            liveClient: liveClientStatus,
            gameEvents: gameEventsStatus,
            lockfilePath,
            lastError,
            enemyChampions: nextEnemyChampions,
            laneOpponent: nextLaneOpponent,
            matchup: nextMatchup,
          },
        })
      } finally {
        pollingRef.current = false
      }
    }

    const cleanupListener = addGameInfoUpdatedListener(() => {
      void refresh()
    })

    void refresh()
    const interval = window.setInterval(() => {
      void refresh()
    }, 2000)

    return () => {
      cleanupListener()
      window.clearInterval(interval)
    }
  }, [quest, riotInstallPath])

  const runtimeWithMatchup = {
    ...runtime,
    enemyChampions: runtime.enemyChampions,
    laneOpponent: runtime.laneOpponent,
    matchup: runtime.matchup,
  }
  return runtimeWithMatchup
}
