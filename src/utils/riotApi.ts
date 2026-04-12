export interface RiotProxyRequest {
  host: string
  path: string
  params?: Record<string, string | number | boolean | undefined>
}

const DEFAULT_PROXY_URL = 'http://localhost:8787/api/riot'

function getProxyBaseUrl() {
  const proxyBaseUrl = import.meta.env.VITE_RIOT_PROXY_URL
  return typeof proxyBaseUrl === 'string' && proxyBaseUrl.length > 0
    ? proxyBaseUrl
    : DEFAULT_PROXY_URL
}

export function getLocalProxyUrl(path: string, params: Record<string, string | number | boolean | undefined> = {}) {
  const proxyUrl = new URL(getProxyBaseUrl().replace('/api/riot', path))

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) {
      continue
    }

    proxyUrl.searchParams.set(key, String(value))
  }

  return proxyUrl.toString()
}

export async function fetchLocalProxy<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined> = {},
): Promise<T> {
  const response = await fetch(getLocalProxyUrl(path, params))

  if (!response.ok) {
    let errorMessage = `Local proxy request failed: ${response.status}`

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

  const response = await fetch(proxyUrl)

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
