export interface LiveClientSnapshot {
  activePlayer: {
    championStats?: Record<string, number>
    currentGold?: number
    level: number
    summonerName?: string
  }
  allPlayers?: Array<{
    championName: string
    isBot: boolean
    summonerName?: string
    scores?: {
      kills: number
      deaths: number
      assists: number
      creepScore: number
      wardScore: number
    }
    items?: Array<{ displayName: string }>
  }>
  gameData?: {
    gameTime: number
  }
}

export async function getLiveClientData(): Promise<LiveClientSnapshot> {
  const response = await fetch(
    'http://localhost:2999/liveclientdata/allgamedata',
  )

  if (!response.ok) {
    throw new Error(`Live Client request failed: ${response.status}`)
  }

  return response.json() as Promise<LiveClientSnapshot>
}

export function formatGameClock(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function inferGamePhase(
  totalSeconds: number,
): 'Early' | 'Mid' | 'Late' {
  if (totalSeconds < 14 * 60) {
    return 'Early'
  }

  if (totalSeconds < 28 * 60) {
    return 'Mid'
  }

  return 'Late'
}
