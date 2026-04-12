import { useEffect, useRef, useState } from 'react'
import {
  initialQuestState,
  mockChampionSelectState,
  mockLiveStats,
  mockLobbyPreferences,
  mockPostGameSummary,
} from '../data/mockState'
import { getMatchupData } from '../data/archetypes'
import { roles } from '../data/roles'
import type {
  ChampionSelectState,
  CurrentLeagueIdentity,
  GameflowState,
  LiveStats,
  LobbyPreferences,
  MatchupInfo,
  PostGameSummary,
  ProviderStatus,
  QuestState,
  RoleId,
  RuntimeStatus,
} from '../types'
import {
  CHAMPION_ID_TO_NAME,
  classifyChampionSelectState,
  detectAssignedRole,
  type LcuChampSelectSession,
  type LcuCurrentSummoner,
  type LcuEogStatsBlock,
  type LcuGameflowResponse,
  type LcuLobbyResponse,
  normalizeLobbyPreferences,
} from '../utils/lcu'
import {
  formatGameClock,
  inferGamePhase,
  type LiveClientSnapshot,
} from '../utils/liveClient'
import { fetchLocalProxy } from '../utils/riotApi'
import {
  addGameInfoUpdatedListener,
  getLeagueGameId,
  getRunningGameInfo,
  isOverwolfAvailable,
} from '../utils/overwolf'

interface RuntimeState {
  lobby: LobbyPreferences
  championSelect: ChampionSelectState
  liveStats: LiveStats
  postGameSummary: PostGameSummary
  currentLeagueIdentity: CurrentLeagueIdentity | null
  enemyChampions: string[]
  laneOpponent: string | null
  matchup: MatchupInfo | null
  gameflowState: GameflowState
  status: RuntimeStatus
}

function normalizeGameflowState(phase: LcuGameflowResponse | null): GameflowState {
  const normalized = phase ?? 'None'
  const validStates: GameflowState[] = [
    'None',
    'Lobby',
    'Matchmaking',
    'ReadyCheck',
    'ChampSelect',
    'GameStart',
    'InProgress',
    'WaitingForStats',
    'PreEndOfGame',
    'EndOfGame',
    'TerminatedInError',
  ]

  return validStates.includes(normalized as GameflowState)
    ? (normalized as GameflowState)
    : 'None'
}

function isLiveGameflowPhase(phase: GameflowState) {
  return phase === 'InProgress' || phase === 'GameStart'
}

const DEFAULT_STATUS: RuntimeStatus = {
  overwolfAvailable: false,
  leagueRunning: false,
  lcu: 'mock',
  liveClient: 'mock',
  gameEvents: 'mock',
  lockfilePath: null,
  lastError: null,
  gameflowState: 'None',
  enemyChampions: [],
  laneOpponent: null,
  matchup: null,
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
  gameflowState: 'None',
  status: DEFAULT_STATUS,
}

async function getOptionalLocalProxyJson<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined> = {},
): Promise<T | null> {
  try {
    return await fetchLocalProxy<T>(path, params)
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes('404') ||
        error.message.includes('500') ||
        error.message.includes('503'))
    ) {
      return null
    }

    throw error
  }
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

  const kills = player?.scores?.kills ?? 0
  const deaths = player?.scores?.deaths ?? 0
  const assists = player?.scores?.assists ?? 0
  const cs = player?.scores?.creepScore ?? 0
  const vision = player?.scores?.wardScore ?? 0
  const minutesPlayed = seconds / 60
  const csPerMin = minutesPlayed > 0 ? cs / minutesPlayed : 0
  const teamKills = (snapshot.allPlayers ?? [])
    .filter((candidate) => candidate.team === player?.team)
    .reduce((sum, candidate) => sum + (candidate.scores?.kills ?? 0), 0)
  const kp =
    teamKills > 0 ? Math.round(((kills + assists) / teamKills) * 100) : 0

  return {
    champion: player?.championName ?? 'Current champion',
    summonerLevel: snapshot.activePlayer.level,
    kills,
    deaths,
    assists,
    cs,
    vision,
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
    csPaceTip:
      roleId === 'utility'
        ? 'CS is not your priority as Support. Focus on vision control and protecting your carry.'
        : csPerMin < 5
          ? `You are below ideal farm pace at ${csPerMin.toFixed(1)} CS/min. Stay on waves before taking extra map risks.`
          : csPerMin < 7
            ? `CS pace is ${csPerMin.toFixed(1)} CS/min. Good enough to keep pressure, but there is still room to clean up missed waves.`
            : `CS pace is ${csPerMin.toFixed(1)} CS/min. You are staying on schedule for this phase.`,
    kpTip:
      phase === 'Early'
        ? 'Early game priority is lane control first, then collapse when fights are clearly reachable.'
        : kp < 25
          ? `Kill participation is ${kp}%. You are missing too many fights or arriving too late to matter.`
          : kp < 45
            ? `Kill participation is ${kp}%. You are contributing, but one more timely rotation per objective cycle would help.`
            : `Kill participation is ${kp}%. You are staying meaningfully involved in your team’s fights.`,
    visionTip:
      roleId === 'utility'
        ? 'As Support, keep vision tied to your team’s next move instead of dropping wards after the fact.'
        : vision < 10
          ? 'Vision score is low for the current phase. Add wards before moving into river or jungle.'
          : vision < 20
            ? 'Vision is serviceable, but you can still improve objective setup by warding a little earlier.'
            : 'Vision contribution is healthy for this game state. Keep placing information before the fight starts.',
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
    getNumericStat(
      stats,
      'MINIONS_KILLED',
      'neutralMinionsKilled',
      'totalMinionsKilled',
    ) ?? 0

  const score = kills + assists - deaths + Math.floor(vision / 8)
  const grade =
    score >= 22 ? 'S-' : score >= 16 ? 'A-' : score >= 10 ? 'B+' : score >= 5 ? 'B' : 'C'

  const resultValue = payload.data?.gameResult ?? payload.gameResult ?? ''
  const result = /win/i.test(resultValue) ? 'Victory' : 'Defeat'

  const strengths: string[] = []
  const focusNextGame: string[] = []

  if (deaths <= 4) {
    strengths.push(
      'You kept your deaths manageable, which protected your tempo and item timing.',
    )
  }
  if (vision >= 20 || roleId === 'utility') {
    strengths.push(
      'Your vision contribution gave your team safer information around fights and objectives.',
    )
  }
  if (kills + assists >= 10) {
    strengths.push(
      'You were involved in enough takedowns to matter in the game instead of drifting on the map.',
    )
  }

  while (strengths.length < 3) {
    strengths.push(
      'You stayed in the game long enough to keep learning instead of mentally checking out after mistakes.',
    )
  }

  if (deaths >= 6) {
    focusNextGame.push(
      'Respect danger a bit earlier so you stop losing tempo to repeat deaths before the next objective.',
    )
  }
  if (cs < 120 && roleId !== 'utility') {
    focusNextGame.push(
      'Protect your farm more consistently so your gold curve matches the stage of the game.',
    )
  }
  if (vision < 15 && roleId !== 'bottom') {
    focusNextGame.push(
      'Add more ward timing before you move into river or jungle so fights start with information.',
    )
  }

  while (focusNextGame.length < 3) {
    focusNextGame.push(
      'Use the next game to repeat the same fundamentals rather than trying to fix everything at once.',
    )
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

function resolveEnemyChampionsFromChampSelect(
  session: LcuChampSelectSession | null,
  assignedRole: RoleId,
) {
  const enemyChampions =
    session?.theirTeam
      ?.map((player) => CHAMPION_ID_TO_NAME[player.championId ?? -1])
      .filter((champion): champion is string => Boolean(champion)) ?? []

  const laneOpponent =
    session?.theirTeam
      ?.find((player) => detectAssignedRole(player.cellId, session.theirTeam ?? []) === assignedRole)
      ?.championId ?? null

  return {
    enemyChampions,
    laneOpponent: laneOpponent ? CHAMPION_ID_TO_NAME[laneOpponent] ?? null : enemyChampions[0] ?? null,
  }
}

export function useLaneUpRuntime(quest: QuestState, riotInstallPath?: string) {
  const [runtime, setRuntime] = useState<RuntimeState>(DEFAULT_STATE)
  const runtimeRef = useRef(runtime)
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
        let leagueRunning =
          runningInfo?.id === getLeagueGameId() && runningInfo?.isRunning === true

        let lcuStatus: ProviderStatus = overwolfReady ? 'searching' : 'mock'
        let liveClientStatus: ProviderStatus = leagueRunning
          ? 'searching'
          : overwolfReady
            ? 'idle'
            : 'mock'
        let gameEventsStatus: ProviderStatus = overwolfReady
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
        let nextEnemyChampions = runtimeRef.current.enemyChampions
        let nextLaneOpponent = runtimeRef.current.laneOpponent
        let nextMatchup = runtimeRef.current.matchup
        let nextGameflowState = runtimeRef.current.gameflowState

        const proxyParams = riotInstallPath?.trim()
          ? { installPath: riotInstallPath.trim() }
          : {}

        const lcuHealth = await getOptionalLocalProxyJson<{
          ok: boolean
          lockfilePath: string | null
          port: string | null
        }>('/lcu/health', proxyParams)

        if (lcuHealth?.ok) {
          lockfilePath = lcuHealth.lockfilePath
          lcuStatus = 'connected'

          try {
            const [
              lobbyResponse,
              sessionResponse,
              eogResponse,
              currentSummonerResponse,
              gameflowPhase,
            ] = await Promise.all([
              getOptionalLocalProxyJson<LcuLobbyResponse>('/lcu/lobby', proxyParams),
              getOptionalLocalProxyJson<LcuChampSelectSession>('/lcu/champ-select', proxyParams),
              getOptionalLocalProxyJson<LcuEogStatsBlock>('/lcu/eog-stats', proxyParams),
              getOptionalLocalProxyJson<LcuCurrentSummoner>('/lcu/current-summoner', proxyParams),
              getOptionalLocalProxyJson<LcuGameflowResponse>('/lcu/gameflow-phase', proxyParams),
            ])

            nextGameflowState = normalizeGameflowState(gameflowPhase)
            if (isLiveGameflowPhase(nextGameflowState)) {
              leagueRunning = true
              liveClientStatus = 'searching'
              gameEventsStatus = 'connected'
            }

            nextLobby = normalizeLobbyPreferences(lobbyResponse, nextLobby)

            let assignedRole = nextChampionSelect.assignedPosition
            if (sessionResponse) {
              assignedRole =
                detectAssignedRole(
                  sessionResponse.localPlayerCellId,
                  sessionResponse.myTeam,
                ) ?? assignedRole

              nextChampionSelect = classifyChampionSelectState(
                quest,
                nextLobby,
                assignedRole,
              )

              const enemyInfo = resolveEnemyChampionsFromChampSelect(
                sessionResponse,
                assignedRole,
              )
              nextEnemyChampions = enemyInfo.enemyChampions
              nextLaneOpponent = enemyInfo.laneOpponent
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
          } catch (error) {
            lcuStatus = 'error'
            lastError =
              error instanceof Error ? error.message : 'LCU connection failed.'
          }
        }

        if (leagueRunning) {
          try {
            const liveClientSnapshot = await fetchLocalProxy<LiveClientSnapshot>(
              '/liveclient/allgamedata',
            )
            const mappedLiveStats = buildLiveStats(
              liveClientSnapshot,
              getRoleForLiveTips(quest, nextChampionSelect),
            )

            if (mappedLiveStats) {
              nextLiveStats = mappedLiveStats
              liveClientStatus = 'connected'

              const myPlayerEntry = liveClientSnapshot.allPlayers?.find(
                (player) =>
                  player.summonerName === liveClientSnapshot.activePlayer.summonerName,
              )
              const myTeamId = myPlayerEntry?.team ?? 'ORDER'
              const enemies =
                liveClientSnapshot.allPlayers
                  ?.filter((player) => player.team !== myTeamId && !player.isBot)
                  .map((player) => player.championName)
                  .filter(Boolean) ?? []

              if (enemies.length > 0) {
                nextEnemyChampions = enemies
                nextLaneOpponent = nextLaneOpponent ?? enemies[0]
              }
            }
          } catch (error) {
            liveClientStatus = 'error'
            lastError =
              error instanceof Error
                ? error.message
                : 'Live Client data unavailable.'
          }
        }

        if (nextLaneOpponent) {
          const matchupData = getMatchupData(nextLaneOpponent)
          nextMatchup = {
            championName: matchupData.championName,
            archetype: matchupData.archetype,
            threatLevel: matchupData.threatLevel,
            tradingTip: matchupData.tradingTip,
            watchOut: matchupData.watchOut,
            winCondition: matchupData.winCondition,
            currentPhaseTip:
              nextGameflowState === 'InProgress'
                ? matchupData.phaseTips.mid
                : matchupData.phaseTips.early,
          }
        } else {
          nextMatchup = null
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
          gameflowState: nextGameflowState,
          status: {
            overwolfAvailable: overwolfReady,
            leagueRunning,
            lcu: lcuStatus,
            liveClient: liveClientStatus,
            gameEvents: gameEventsStatus,
            lockfilePath,
            lastError,
            gameflowState: nextGameflowState,
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

  return runtime
}
