import type {
  ChampionSelectState,
  LobbyPreferences,
  QuestState,
  RoleId,
} from '../types'
import { mockChampionSelectState } from '../data/mockState'
import { roles } from '../data/roles'

export interface LcuCredentials {
  port: string
  password: string
  protocol: string
}

export type LcuGameflowResponse = string

export interface LcuChampSelectSession {
  localPlayerCellId: number
  myTeam: Array<{ cellId: number; assignedPosition?: string | null }>
}

export interface LcuLobbyResponse {
  firstPositionPreference?: string | null
  secondPositionPreference?: string | null
}

export interface LcuCurrentSummoner {
  displayName?: string | null
  gameName?: string | null
  tagLine?: string | null
}

export interface LcuEogStatsBlock {
  data?: {
    stats?: Record<string, number | string | null>
    gameId?: number
    queueType?: string
    gameEndedInEarlySurrender?: boolean
    gameEndedInSurrender?: boolean
    gameResult?: string
    championName?: string
    kills?: number
    deaths?: number
    assists?: number
    visionScore?: number
  }
  stats?: Record<string, number | string | null>
  gameResult?: string
  championName?: string
}

export function parseLockfile(lockfile: string): LcuCredentials {
  const [processName, , port, password, protocol] = lockfile.trim().split(':')
  if (!processName || !port || !password || !protocol) {
    throw new Error('Invalid Riot lockfile format.')
  }
  return { port, password, protocol }
}

export function createLcuHeaders(password: string): HeadersInit {
  return {
    Authorization: `Basic ${btoa(`:${password}`)}`,
  }
}

// Unified LCU request helper.
// In Overwolf context uses overwolf.web.sendHttpRequest which skips the
// self-signed-cert error that native fetch throws for https://127.0.0.1.
// Falls back to native fetch for browser preview mode.
async function lcuRequest(
  port: string,
  password: string,
  endpoint: string,
): Promise<{ ok: boolean; status: number; json: () => Promise<unknown> } | null> {
  const url = `https://127.0.0.1:${port}${endpoint}`
  const authValue = `Basic ${btoa(`:${password}`)}`
  const ow = typeof window !== 'undefined' ? window.overwolf : undefined

  if (ow?.web?.sendHttpRequest) {
    return new Promise((resolve) => {
      ow.web.sendHttpRequest(
        url,
        ow.web.enums.HttpRequestMethods.GET,
        [{ key: 'Authorization', value: authValue }],
        {},
        (result) => {
          if (!result || result.statusCode === 0) {
            resolve(null)
            return
          }
          resolve({
            ok: result.statusCode >= 200 && result.statusCode < 300,
            status: result.statusCode,
            json: () => {
              try {
                return Promise.resolve(JSON.parse(result.data) as unknown)
              } catch {
                return Promise.reject(new Error('Invalid JSON from LCU'))
              }
            },
          })
        },
      )
    })
  }

  // Browser preview fallback — may fail on SSL cert, which is expected outside Overwolf
  try {
    const response = await fetch(url, {
      headers: { Authorization: authValue },
    })
    return {
      ok: response.ok,
      status: response.status,
      json: () => response.json() as Promise<unknown>,
    }
  } catch {
    return null
  }
}

export async function getJson<T>(
  port: string,
  password: string,
  endpoint: string,
): Promise<T> {
  const result = await lcuRequest(port, password, endpoint)
  if (!result) {
    throw new Error(`LCU request failed: no response for ${endpoint}`)
  }
  if (!result.ok) {
    throw new Error(`LCU request failed: ${result.status}`)
  }
  return result.json() as Promise<T>
}

export async function getOptionalJson<T>(
  port: string,
  password: string,
  endpoint: string,
): Promise<T | null> {
  const result = await lcuRequest(port, password, endpoint)
  if (!result) return null
  if (result.status === 404 || result.status === 500 || result.status === 503) {
    return null
  }
  if (!result.ok) {
    throw new Error(`LCU request failed: ${result.status}`)
  }
  return result.json() as Promise<T>
}

export function normalizeRoleId(value?: string | null): RoleId | null {
  switch (value) {
    case 'top':
      return 'top'
    case 'jungle':
      return 'jungle'
    case 'middle':
    case 'mid':
      return 'middle'
    case 'bottom':
    case 'bot':
    case 'adc':
      return 'bottom'
    case 'utility':
    case 'support':
      return 'utility'
    default:
      return null
  }
}

export function detectAssignedRole(
  localPlayerCellId: number,
  myTeam: Array<{ cellId: number; assignedPosition?: string | null }>,
): RoleId | null {
  const me = myTeam.find((player) => player.cellId === localPlayerCellId)
  return normalizeRoleId(me?.assignedPosition)
}

export function normalizeLobbyPreferences(
  lobby: LcuLobbyResponse | null,
  fallback: LobbyPreferences,
): LobbyPreferences {
  return {
    firstPositionPreference:
      normalizeRoleId(lobby?.firstPositionPreference) ?? fallback.firstPositionPreference,
    secondPositionPreference:
      normalizeRoleId(lobby?.secondPositionPreference) ?? fallback.secondPositionPreference,
  }
}

export function classifyChampionSelectState(
  quest: QuestState,
  lobby: LobbyPreferences,
  assignedPosition: RoleId,
): ChampionSelectState {
  const queuedForAssigned =
    lobby.firstPositionPreference === assignedPosition ||
    lobby.secondPositionPreference === assignedPosition
  const hasQuest = quest.activeRole !== null
  const mismatchWithQuest = hasQuest && quest.activeRole !== assignedPosition
  const isAutofilled = !queuedForAssigned

  return {
    ...mockChampionSelectState,
    assignedPosition,
    isAutofilled,
    mismatchWithQuest,
    shouldNudgeQuest: !hasQuest,
    queueIntent: {
      firstChoice: lobby.firstPositionPreference,
      secondChoice: lobby.secondPositionPreference,
    },
    teamCompSummary: `Assigned role is ${roles[assignedPosition].name}. Prep the player for this match first, then preserve the saved quest context for the longer learning path.`,
  }
}
