export interface RiotProxyRequest {
  host: string
  path: string
  params?: Record<string, string | number | boolean | undefined>
}

const DEFAULT_PROXY_URL = 'http://localhost:8787/api/riot'
const PROXY_SECRET_HEADER = 'X-Laneup-Proxy-Secret'

function getProxyRoot() {
  const base = new URL(getProxyBaseUrl())
  return `${base.origin}`
}

function getProxyBaseUrl() {
  const proxyBaseUrl = import.meta.env.VITE_RIOT_PROXY_URL
  return typeof proxyBaseUrl === 'string' && proxyBaseUrl.length > 0
    ? proxyBaseUrl
    : DEFAULT_PROXY_URL
}

export async function fetchFromRiotProxy<T>({
  host,
  path,
  params = {},
}: RiotProxyRequest): Promise<T> {
  const proxyUrl = new URL(getProxyBaseUrl())
  proxyUrl.searchParams.set('host', host)
  proxyUrl.searchParams.set('path', path)

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) {
      continue
    }

    proxyUrl.searchParams.set(key, String(value))
  }

  const proxySecret = import.meta.env.VITE_RIOT_PROXY_SECRET
  const response = await fetch(proxyUrl, {
    headers:
      typeof proxySecret === 'string' && proxySecret.length > 0
        ? { [PROXY_SECRET_HEADER]: proxySecret }
        : undefined,
  })

  if (!response.ok) {
    let errorMessage = `Riot proxy request failed: ${response.status}`

    try {
      const errorBody = (await response.json()) as { error?: string; message?: string }
      errorMessage = errorBody.error ?? errorBody.message ?? errorMessage
    } catch {
      // Keep the default error message when the body is empty or non-JSON.
    }

    throw new Error(errorMessage)
  }

  return response.json() as Promise<T>
}

export async function fetchFromLcuProxy<T>(path: string, params: Record<string, string> = {}) {
  const proxyRoot = getProxyRoot()
  const url = new URL(`${proxyRoot}${path}`)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }

  const proxySecret = import.meta.env.VITE_RIOT_PROXY_SECRET
  const response = await fetch(url.toString(), {
    headers:
      typeof proxySecret === 'string' && proxySecret.length > 0
        ? { [PROXY_SECRET_HEADER]: proxySecret }
        : undefined,
  })

  if (!response.ok) {
    let errorMessage = `LCU proxy request failed: ${response.status}`

    try {
      const errorBody = (await response.json()) as { error?: string; message?: string }
      errorMessage = errorBody.error ?? errorBody.message ?? errorMessage
    } catch {
      // keep default message
    }

    throw new Error(errorMessage)
  }

  return response.json() as Promise<T>
}
