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
  myTeam: Array<{ cellId: number; assignedPosition?: string | null; championId?: number }>
  theirTeam?: Array<{ cellId: number; assignedPosition?: string | null; championId?: number }>
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

// ── CHAMPION ID → NAME MAP ─────────────────────────────────────────────────
// From Riot Data Dragon 16.7.1. Used to resolve champion picks in champ select
// before the game starts (LCU returns championId not name).
export const CHAMPION_ID_TO_NAME: Record<number, string> = {
  1: 'Annie', 2: 'Olaf', 3: 'Galio', 4: 'Twisted Fate', 5: 'Xin Zhao',
  6: 'Urgot', 7: 'LeBlanc', 8: 'Vladimir', 9: 'Fiddlesticks', 10: 'Kayle',
  11: 'Master Yi', 12: 'Alistar', 13: 'Ryze', 14: 'Sion', 15: 'Sivir',
  16: 'Soraka', 17: 'Teemo', 18: 'Tristana', 19: 'Warwick', 20: 'Nunu & Willump',
  21: 'Miss Fortune', 22: 'Ashe', 23: 'Tryndamere', 24: 'Jax', 25: 'Morgana',
  26: 'Zilean', 27: 'Singed', 28: 'Evelynn', 29: 'Twitch', 30: 'Karthus',
  31: "Cho'Gath", 32: 'Amumu', 33: 'Rammus', 34: 'Anivia', 35: 'Shaco',
  36: 'Dr. Mundo', 37: 'Sona', 38: 'Kassadin', 39: 'Irelia', 40: 'Janna',
  41: 'Gangplank', 42: 'Corki', 43: 'Karma', 44: 'Taric', 45: 'Veigar',
  48: 'Trundle', 50: 'Swain', 51: 'Caitlyn', 53: 'Blitzcrank', 54: 'Malphite',
  55: 'Katarina', 56: 'Nocturne', 57: 'Maokai', 58: 'Renekton', 59: 'Jarvan IV',
  60: 'Elise', 61: 'Orianna', 62: 'Wukong', 63: 'Brand', 64: 'Lee Sin',
  67: 'Vayne', 68: 'Rumble', 69: 'Cassiopeia', 72: 'Skarner', 74: 'Heimerdinger',
  75: 'Nasus', 76: 'Nidalee', 77: 'Udyr', 78: 'Poppy', 79: 'Gragas',
  80: 'Pantheon', 81: 'Ezreal', 82: 'Mordekaiser', 83: 'Yorick', 84: 'Akali',
  85: 'Kennen', 86: 'Garen', 89: 'Leona', 90: 'Malzahar', 91: 'Talon',
  92: 'Riven', 96: "Kog'Maw", 98: 'Shen', 99: 'Lux', 101: 'Xerath',
  102: 'Shyvana', 103: 'Ahri', 104: 'Graves', 105: 'Fizz', 106: 'Volibear',
  107: 'Rengar', 110: 'Varus', 111: 'Nautilus', 112: 'Viktor', 113: 'Sejuani',
  114: 'Fiora', 115: 'Ziggs', 117: 'Lulu', 119: 'Draven', 120: 'Hecarim',
  121: "Kha'Zix", 122: 'Darius', 126: 'Jayce', 127: 'Lissandra', 131: 'Diana',
  133: 'Quinn', 134: 'Syndra', 136: 'Aurelion Sol', 141: 'Kayn', 142: 'Zoe',
  143: 'Zyra', 145: "Kai'Sa", 147: 'Seraphine', 150: 'Gnar', 154: 'Zac',
  157: 'Yasuo', 161: "Vel'Koz", 163: 'Taliyah', 164: 'Camille', 166: 'Akshan',
  200: "Bel'Veth", 201: 'Braum', 202: 'Jhin', 203: 'Kindred', 221: 'Zeri',
  222: 'Jinx', 223: 'Tahm Kench', 233: 'Briar', 234: 'Viego', 235: 'Senna',
  236: 'Lucian', 238: 'Zed', 240: 'Kled', 245: 'Ekko', 246: 'Qiyana',
  254: 'Vi', 266: 'Aatrox', 267: 'Nami', 268: 'Azir', 350: 'Yuumi',
  360: 'Samira', 412: 'Thresh', 420: 'Illaoi', 421: "Rek'Sai", 427: 'Ivern',
  429: 'Kalista', 432: 'Bard', 497: 'Rakan', 498: 'Xayah', 516: 'Ornn',
  517: 'Sylas', 518: 'Neeko', 523: 'Aphelios', 526: 'Rell', 555: 'Pyke',
  711: 'Vex', 777: 'Yone', 875: 'Sett', 876: 'Lillia', 887: 'Gwen',
  888: 'Renata Glasc', 893: 'Aurora', 895: 'Nilah', 897: "K'Sante",
  901: 'Smolder', 902: 'Milio', 910: 'Hwei', 950: 'Naafiri',
  10: 'Kayle', 875: 'Sett', 163: 'Taliyah', 420: 'Illaoi',
}
