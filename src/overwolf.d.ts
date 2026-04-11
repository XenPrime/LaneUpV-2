export {}

interface OverwolfRunningGameInfo {
  id?: number
  isRunning?: boolean
  title?: string
  executionPath?: string
  processPath?: string
}

interface OverwolfFileReadResult {
  success: boolean
  content?: string
}

interface OverwolfHttpResult {
  status: string
  statusCode: number
  data: string
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
  web: {
    enums: {
      HttpRequestMethods: {
        GET: string
        POST: string
      }
    }
    sendHttpRequest: (
      url: string,
      method: string,
      headers: Array<{ key: string; value: string }>,
      data: object,
      callback: (result: OverwolfHttpResult) => void,
    ) => void
  }
}

declare global {
  interface Window {
    overwolf?: OverwolfApi
  }
}
