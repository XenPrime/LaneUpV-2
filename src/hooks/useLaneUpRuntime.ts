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
  parseLockfile,
  type LcuCredentials,
  type LcuChampSelectSession,
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

interface RuntimeState {
  lobby: LobbyPreferences
  championSelect: ChampionSelectState
  liveStats: LiveStats
  postGameSummary: PostGameSummary
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
  status: DEFAULT_STATUS,
}

function getLockfileCandidates() {
  const storedInstallPath =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('laneup2-riot-install-path')
      : null

  const installCandidates = [
    storedInstallPath,
    'C:/Riot Games/League of Legends',
    'C:/Program Files/Riot Games/League of Legends',
    'C:/Program Files (x86)/Riot Games/League of Legends',
    'D:/Riot Games/League of Legends',
    'D:/Program Files/Riot Games/League of Legends',
    'D:/Program Files (x86)/Riot Games/League of Legends',
  ].filter(Boolean) as string[]

  return Array.from(new Set(installCandidates)).map((path) =>
    path.endsWith('/lockfile') ? path : `${path}/lockfile`,
  )
}

async function resolveLcuCredentials(): Promise<{
  credentials: LcuCredentials
  lockfilePath: string
} | null> {
  if (!isOverwolfAvailable()) {
    return null
  }

  for (const path of getLockfileCandidates()) {
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
    tipHeadline: `${role.name} ${phase.toLowerCase()} focus`,
    tipBody: rolePhaseTip,
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
    strengths: strengths.slice(0, 3),
    focusNextGame: focusNextGame.slice(0, 3),
  }
}

export function useLaneUpRuntime(quest: QuestState) {
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

        if (overwolfReady && !lcuRef.current) {
          const resolved = await resolveLcuCredentials()
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
            const [lobbyResponse, sessionResponse, eogResponse] = await Promise.all([
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
          status: {
            overwolfAvailable: overwolfReady,
            leagueRunning,
            lcu: lcuStatus,
            liveClient: liveClientStatus,
            gameEvents: gameEventsStatus,
            lockfilePath,
            lastError,
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
    }, 4000)

    return () => {
      cleanupListener()
      window.clearInterval(interval)
    }
  }, [quest])

  return runtime
}
