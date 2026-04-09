export {}

interface OverwolfRunningGameInfo {
  id?: number
  isRunning?: boolean
  title?: string
}

interface OverwolfFileReadResult {
  success: boolean
  content?: string
}

interface OverwolfApi {
  games: {
    getRunningGameInfo: (
      callback: (info: OverwolfRunningGameInfo | null) => void,
    ) => void
    onGameInfoUpdated: {
      addListener: (handler: (info: unknown) => void) => void
      removeListener: (handler: (info: unknown) => void) => void
    }
  }
  io: {
    enums: {
      eEncoding: {
        UTF8: string
      }
    }
    readFileContents: (
      path: string,
      encoding: string,
      callback: (result: OverwolfFileReadResult) => void,
    ) => void
  }
}

declare global {
  interface Window {
    overwolf?: OverwolfApi
  }
}
