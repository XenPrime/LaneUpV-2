import { existsSync, readFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { resolve } from 'node:path'
import { URL } from 'node:url'

function loadLocalEnvFile() {
  const envPath = resolve(process.cwd(), '.env.local')

  if (!existsSync(envPath)) {
    return
  }

  const envContent = readFileSync(envPath, 'utf8')

  for (const rawLine of envContent.split(/\r?\n/)) {
    const line = rawLine.trim()

    if (!line || line.startsWith('#')) {
      continue
    }

    const separatorIndex = line.indexOf('=')
    if (separatorIndex === -1) {
      continue
    }

    const key = line.slice(0, separatorIndex).trim()
    const value = line.slice(separatorIndex + 1).trim()

    if (key && !(key in process.env)) {
      process.env[key] = value
    }
  }
}

loadLocalEnvFile()

const PORT = Number(process.env.RIOT_PROXY_PORT || 8787)
const API_KEY = process.env.RIOT_API_KEY
const PROXY_SECRET = process.env.RIOT_PROXY_SECRET
const ALLOWED_ORIGIN = process.env.RIOT_PROXY_ORIGIN || 'http://localhost:5173'

const ALLOWED_HOSTS = new Set([
  'americas.api.riotgames.com',
  'europe.api.riotgames.com',
  'asia.api.riotgames.com',
  'sea.api.riotgames.com',
  'na1.api.riotgames.com',
  'br1.api.riotgames.com',
  'eun1.api.riotgames.com',
  'euw1.api.riotgames.com',
  'jp1.api.riotgames.com',
  'kr.api.riotgames.com',
  'la1.api.riotgames.com',
  'la2.api.riotgames.com',
  'me1.api.riotgames.com',
  'oc1.api.riotgames.com',
  'ph2.api.riotgames.com',
  'ru.api.riotgames.com',
  'sg2.api.riotgames.com',
  'th2.api.riotgames.com',
  'tr1.api.riotgames.com',
  'tw2.api.riotgames.com',
  'vn2.api.riotgames.com',
])

function getLcuLockfileCandidates(installPathOverride) {
  const override = installPathOverride || process.env.RIOT_INSTALL_PATH
  const candidates = [
    override,
    'C:/Riot Games/League of Legends',
    'C:/Riot Games/League of Legends/Game',
    'D:/Riot Games/League of Legends',
    'D:/Riot Games/League of Legends/Game',
  ].filter(Boolean)

  return Array.from(
    new Set(
      candidates.flatMap((path) => {
        const normalizedPath = String(path).replace(/\\/g, '/').replace(/\/$/, '')
        return normalizedPath.endsWith('/lockfile')
          ? [normalizedPath]
          : [normalizedPath, `${normalizedPath}/lockfile`]
      }),
    ),
  )
}

function parseLcuLockfile(lockfile) {
  const [processName, , port, password, protocol] = lockfile.trim().split(':')

  if (!processName || !port || !password || !protocol) {
    return null
  }

  return { processName, port, password, protocol }
}

function resolveRiotClientFromDisk() {
  const candidate = 'C:/Users/YEBal/AppData/Local/Riot Games/Riot Client/Config/lockfile'

  if (!existsSync(candidate)) {
    return null
  }

  try {
    const content = readFileSync(candidate, 'utf8')
    const parsed = parseLcuLockfile(content)

    if (!parsed) {
      return null
    }

    return {
      ...parsed,
      lockfilePath: candidate,
    }
  } catch {
    return null
  }
}

function resolveLcuFromDisk(installPathOverride) {
  for (const candidate of getLcuLockfileCandidates(installPathOverride)) {
    if (!existsSync(candidate)) {
      continue
    }

    try {
      const content = readFileSync(candidate, 'utf8')
      const parsed = parseLcuLockfile(content)

      if (parsed) {
        return {
          ...parsed,
          lockfilePath: candidate,
        }
      }
    } catch {
      // Keep scanning.
    }
  }

  return null
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Laneup-Proxy-Secret, X-Proxy-Secret',
  })
  response.end(JSON.stringify(payload))
}

function isAuthorized(request) {
  if (!PROXY_SECRET) {
    return false
  }

  const headerSecret =
    request.headers['x-laneup-proxy-secret'] || request.headers['x-proxy-secret']

  return typeof headerSecret === 'string' && headerSecret === PROXY_SECRET
}

function getTargetUrl(requestUrl) {
  const incomingUrl = new URL(requestUrl, `http://localhost:${PORT}`)
  const host = incomingUrl.searchParams.get('host')
  const path = incomingUrl.searchParams.get('path')

  if (!host || !path) {
    return {
      error: 'Missing required query params: host and path.',
    }
  }

  if (!ALLOWED_HOSTS.has(host)) {
    return {
      error: `Host "${host}" is not allowed by the local Riot proxy.`,
    }
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const targetUrl = new URL(`https://${host}${normalizedPath}`)

  for (const [key, value] of incomingUrl.searchParams.entries()) {
    if (key === 'host' || key === 'path') {
      continue
    }

    targetUrl.searchParams.append(key, value)
  }

  return { targetUrl }
}

const server = createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers':
        'Content-Type, X-Laneup-Proxy-Secret, X-Proxy-Secret',
    })
    response.end()
    return
  }

  if (!isAuthorized(request)) {
    sendJson(response, 401, { error: 'Unauthorized: missing or invalid proxy secret.' })
    return
  }

  if (request.url === '/health') {
    sendJson(response, 200, {
      ok: true,
      hasKey: Boolean(API_KEY),
      port: PORT,
      allowedOrigin: ALLOWED_ORIGIN,
    })
    return
  }

  if (request.url?.startsWith('/lcu/health')) {
    const incomingUrl = new URL(request.url, `http://localhost:${PORT}`)
    const installPathOverride = incomingUrl.searchParams.get('installPath') || undefined
    const lcu = resolveLcuFromDisk(installPathOverride)
    sendJson(response, 200, {
      ok: Boolean(lcu),
      lockfilePath: lcu?.lockfilePath ?? null,
      port: lcu?.port ?? null,
    })
    return
  }

  if (request.url?.startsWith('/lcu/current-summoner')) {
    const incomingUrl = new URL(request.url, `http://localhost:${PORT}`)
    const installPathOverride = incomingUrl.searchParams.get('installPath') || undefined
    const lcu = resolveLcuFromDisk(installPathOverride)

    if (!lcu) {
      sendJson(response, 404, {
        error: 'League client lockfile not found on disk.',
      })
      return
    }

    try {
      const auth = Buffer.from(`:${lcu.password}`).toString('base64')
      const lcuResponse = await fetch(
        `${lcu.protocol}://127.0.0.1:${lcu.port}/lol-summoner/v1/current-summoner`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        },
      )

      const body = await lcuResponse.text()

       if (!lcuResponse.ok) {
        sendJson(response, lcuResponse.status, {
          error:
            body.trim().length > 0
              ? body
              : `League client identity request returned ${lcuResponse.status}.`,
        })
        return
      }

      response.writeHead(lcuResponse.status, {
        'Content-Type': lcuResponse.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers':
          'Content-Type, X-Laneup-Proxy-Secret, X-Proxy-Secret',
      })
      response.end(body)
    } catch (requestError) {
      sendJson(response, 502, {
        error:
          requestError instanceof Error
            ? requestError.message
            : 'Unable to call the local League client endpoint.',
      })
    }
    return
  }

  if (request.url?.startsWith('/lcu/champ-select/session')) {
    const incomingUrl = new URL(request.url, `http://localhost:${PORT}`)
    const installPathOverride = incomingUrl.searchParams.get('installPath') || undefined
    const lcu = resolveLcuFromDisk(installPathOverride)

    if (!lcu) {
      sendJson(response, 404, {
        error: 'League client lockfile not found on disk.',
      })
      return
    }

    try {
      const auth = Buffer.from(`:${lcu.password}`).toString('base64')
      const lcuResponse = await fetch(
        `${lcu.protocol}://127.0.0.1:${lcu.port}/lol-champ-select/v1/session`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        },
      )

      const body = await lcuResponse.text()

      response.writeHead(lcuResponse.status, {
        'Content-Type': lcuResponse.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers':
          'Content-Type, X-Laneup-Proxy-Secret, X-Proxy-Secret',
      })
      response.end(body)
    } catch (requestError) {
      sendJson(response, 502, {
        error:
          requestError instanceof Error
            ? requestError.message
            : 'Unable to call the local champ select endpoint.',
      })
    }
    return
  }

  if (request.url?.startsWith('/lcu/lobby')) {
    const installPathOverride = new URL(request.url, `http://localhost:${PORT}`)
      .searchParams.get('installPath') || undefined
    const lcu = resolveLcuFromDisk(installPathOverride)

    if (!lcu) {
      sendJson(response, 404, {
        error: 'League client lockfile not found on disk.',
      })
      return
    }

    try {
      const auth = Buffer.from(`:${lcu.password}`).toString('base64')
      const lcuResponse = await fetch(
        `${lcu.protocol}://127.0.0.1:${lcu.port}/lol-lobby/v2/lobby`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        },
      )

      const body = await lcuResponse.text()

      response.writeHead(lcuResponse.status, {
        'Content-Type': lcuResponse.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers':
          'Content-Type, X-Laneup-Proxy-Secret, X-Proxy-Secret',
      })
      response.end(body)
    } catch (requestError) {
      sendJson(response, 502, {
        error:
          requestError instanceof Error
            ? requestError.message
            : 'Unable to call the lobby endpoint.',
      })
    }
    return
  }

  if (request.url?.startsWith('/lcu/league/summoner')) {
    const incomingUrl = new URL(request.url, `http://localhost:${PORT}`)
    const idsParam = incomingUrl.searchParams.get('ids')
    if (!idsParam) {
      sendJson(response, 400, { error: 'Missing ids query param.' })
      return
    }

    const ids = idsParam.split(',').filter(Boolean)
    const installPathOverride = incomingUrl.searchParams.get('installPath') || undefined
    const lcu = resolveLcuFromDisk(installPathOverride)

    if (!lcu) {
      sendJson(response, 404, {
        error: 'League client lockfile not found on disk.',
      })
      return
    }

    const auth = Buffer.from(`:${lcu.password}`).toString('base64')
    const results = {}

    try {
      for (const id of ids) {
        const rankResponse = await fetch(
          `${lcu.protocol}://127.0.0.1:${lcu.port}/lol-ranked/v1/league/summoner/${id}`,
          {
            headers: {
              Authorization: `Basic ${auth}`,
            },
          },
        )

        if (!rankResponse.ok) {
          results[id] = { error: `Rank fetch failed: ${rankResponse.status}` }
          continue
        }

        results[id] = await rankResponse.json()
      }

      sendJson(response, 200, { results })
    } catch (requestError) {
      sendJson(response, 502, {
        error:
          requestError instanceof Error
            ? requestError.message
            : 'Unable to call the local ranked endpoint.',
      })
    }
    return
  }

  if (request.url === '/riotclient/active-alias') {
    const riotClient = resolveRiotClientFromDisk()

    if (!riotClient) {
      sendJson(response, 404, {
        error: 'Riot Client lockfile not found on disk.',
      })
      return
    }

    try {
      const auth = Buffer.from(`riot:${riotClient.password}`).toString('base64')
      const riotClientResponse = await fetch(
        `${riotClient.protocol}://127.0.0.1:${riotClient.port}/player-account/aliases/v1/active`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        },
      )

      const body = await riotClientResponse.text()

      if (!riotClientResponse.ok) {
        sendJson(response, riotClientResponse.status, {
          error:
            body.trim().length > 0
              ? body
              : `Riot Client alias request returned ${riotClientResponse.status}.`,
        })
        return
      }

      response.writeHead(riotClientResponse.status, {
        'Content-Type': riotClientResponse.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers':
          'Content-Type, X-Laneup-Proxy-Secret, X-Proxy-Secret',
      })
      response.end(body)
    } catch (requestError) {
      sendJson(response, 502, {
        error:
          requestError instanceof Error
            ? requestError.message
            : 'Unable to call the local Riot Client alias endpoint.',
      })
    }
    return
  }

  if (!request.url?.startsWith('/api/riot')) {
    sendJson(response, 404, { error: 'Not found.' })
    return
  }

  if (!API_KEY) {
    sendJson(response, 500, {
      error: 'RIOT_API_KEY is not set. Add it to your shell or .env loader before starting the proxy.',
    })
    return
  }

  if (!PROXY_SECRET) {
    sendJson(response, 500, {
      error: 'RIOT_PROXY_SECRET is not set. Add it to your environment before starting the proxy.',
    })
    return
  }

  const { targetUrl, error } = getTargetUrl(request.url)

  if (error) {
    sendJson(response, 400, { error })
    return
  }

  try {
    const riotResponse = await fetch(targetUrl, {
      headers: {
        'X-Riot-Token': API_KEY,
        'User-Agent': 'LaneUp2-Proxy/1.0',
      },
    })

    const contentType = riotResponse.headers.get('content-type') || 'application/json'
    const body = await riotResponse.text()

    response.writeHead(riotResponse.status, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers':
        'Content-Type, X-Laneup-Proxy-Secret, X-Proxy-Secret',
    })
    response.end(body)
  } catch (requestError) {
    sendJson(response, 502, {
      error:
        requestError instanceof Error
          ? requestError.message
          : 'Unknown proxy error while calling Riot API.',
    })
  }
})

server.listen(PORT, () => {
  console.log(`Riot proxy listening on http://localhost:${PORT}`)
})
