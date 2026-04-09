import type {
  ChampionSelectState,
  LobbyPreferences,
  QuestState,
  RoleId,
} from '../types'

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

export async function getJson<T>(
  port: string,
  password: string,
  endpoint: string,
): Promise<T> {
  const response = await fetch(`https://127.0.0.1:${port}${endpoint}`, {
    headers: createLcuHeaders(password),
  })

  if (!response.ok) {
    throw new Error(`LCU request failed: ${response.status}`)
  }

  return response.json() as Promise<T>
}

export async function getOptionalJson<T>(
  port: string,
  password: string,
  endpoint: string,
): Promise<T | null> {
  const response = await fetch(`https://127.0.0.1:${port}${endpoint}`, {
    headers: createLcuHeaders(password),
  })

  if (response.status === 404 || response.status === 500 || response.status === 503) {
    return null
  }

  if (!response.ok) {
    throw new Error(`LCU request failed: ${response.status}`)
  }

  return response.json() as Promise<T>
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
    assignedPosition,
    isAutofilled,
    mismatchWithQuest,
    shouldNudgeQuest: !hasQuest,
  }
}
