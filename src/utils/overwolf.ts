const LEAGUE_GAME_ID = 5426

export interface RunningGameInfo {
  id?: number
  isRunning?: boolean
  title?: string
}

export function isOverwolfAvailable() {
  return typeof window !== 'undefined' && typeof window.overwolf !== 'undefined'
}

export function getLeagueGameId() {
  return LEAGUE_GAME_ID
}

export async function getRunningGameInfo(): Promise<RunningGameInfo | null> {
  if (!isOverwolfAvailable()) {
    return null
  }

  const overwolf = window.overwolf
  if (!overwolf) {
    return null
  }

  return new Promise((resolve) => {
    overwolf.games.getRunningGameInfo((info: RunningGameInfo | null) => {
      resolve(info ?? null)
    })
  })
}

export function addGameInfoUpdatedListener(
  handler: (info: unknown) => void,
): () => void {
  if (!isOverwolfAvailable()) {
    return () => {}
  }

  const overwolf = window.overwolf
  if (!overwolf) {
    return () => {}
  }

  overwolf.games.onGameInfoUpdated.addListener(handler)
  return () => overwolf.games.onGameInfoUpdated.removeListener(handler)
}

export async function readFileUtf8(path: string): Promise<string | null> {
  if (!isOverwolfAvailable()) {
    return null
  }

  const overwolf = window.overwolf
  if (!overwolf) {
    return null
  }

  return new Promise((resolve) => {
    overwolf.io.readFileContents(
      path,
      overwolf.io.enums.eEncoding.UTF8,
      (result: { success: boolean; content?: string }) => {
        resolve(result.success ? result.content ?? null : null)
      },
    )
  })
}
