import { useEffect, useState } from 'react'
import type {
  CurrentLeagueIdentity,
  RiotAccountConfig,
  RuntimeStatus,
} from '../types'

interface SettingsScreenProps {
  runtimeStatus: RuntimeStatus
  riotAccount: RiotAccountConfig
  onUpdateRiotAccount: (account: RiotAccountConfig) => void
  riotInstallPath: string
  onUpdateRiotInstallPath: (path: string) => void
  onLoadRiotHistory: () => void
  riotHistoryStatus: 'idle' | 'searching' | 'connected' | 'error'
  resolvedAccount: string | null
  riotHistoryError: string | null
  currentLeagueIdentity: CurrentLeagueIdentity | null
}

interface RiotProxyHealth {
  ok: boolean
  hasKey: boolean
  port: number
}

interface LcuProxyHealth {
  ok: boolean
  lockfilePath: string | null
  port: string | null
}

interface LcuProxyIdentity {
  displayName?: string | null
  gameName?: string | null
  tagLine?: string | null
}

interface RiotClientAliasIdentity {
  active?: boolean
  game_name?: string | null
  tag_line?: string | null
}

function formatStatus(status: RuntimeStatus[keyof RuntimeStatus]) {
  if (typeof status === 'boolean' || status === null) {
    return String(status)
  }

  if (Array.isArray(status)) {
    return status.length > 0 ? status.join(', ') : 'None'
  }

  if (typeof status === 'object') {
    return status ? 'Available' : 'None'
  }

  return status
}

function getProxyHealthUrl() {
  const proxyBaseUrl = import.meta.env.VITE_RIOT_PROXY_URL
  if (typeof proxyBaseUrl === 'string' && proxyBaseUrl.length > 0) {
    return proxyBaseUrl.replace('/api/riot', '/health')
  }

  return 'http://localhost:8787/health'
}

function getLcuProxyHealthUrl(installPath?: string) {
  const url = new URL(getProxyHealthUrl().replace('/health', '/lcu/health'))
  if (installPath && installPath.trim()) {
    url.searchParams.set('installPath', installPath.trim())
  }
  return url.toString()
}

function getLcuProxyIdentityUrl(installPath?: string) {
  const url = new URL(getProxyHealthUrl().replace('/health', '/lcu/current-summoner'))
  if (installPath && installPath.trim()) {
    url.searchParams.set('installPath', installPath.trim())
  }
  return url.toString()
}

function getRiotClientAliasUrl() {
  return getProxyHealthUrl().replace('/health', '/riotclient/active-alias')
}

export function SettingsScreen({
  runtimeStatus,
  riotAccount,
  onUpdateRiotAccount,
  riotInstallPath,
  onUpdateRiotInstallPath,
  onLoadRiotHistory,
  riotHistoryStatus,
  resolvedAccount,
  riotHistoryError,
  currentLeagueIdentity,
}: SettingsScreenProps) {
  const [riotProxy, setRiotProxy] = useState<{
    status: 'searching' | 'connected' | 'error'
    data: RiotProxyHealth | null
    error: string | null
  }>({
    status: 'searching',
    data: null,
    error: null,
  })
  const [lcuProxy, setLcuProxy] = useState<{
    status: 'searching' | 'connected' | 'error'
    data: LcuProxyHealth | null
    identity: CurrentLeagueIdentity | null
    error: string | null
  }>({
    status: 'searching',
    data: null,
    identity: null,
    error: null,
  })
  const [riotClientAlias, setRiotClientAlias] = useState<{
    identity: CurrentLeagueIdentity | null
    error: string | null
  }>({
    identity: null,
    error: null,
  })

  useEffect(() => {
    let isCancelled = false

    const loadProxyHealth = async () => {
      try {
        const response = await fetch(getProxyHealthUrl())

        if (!response.ok) {
          throw new Error(`Proxy health request failed: ${response.status}`)
        }

        const data = (await response.json()) as RiotProxyHealth

        if (isCancelled) {
          return
        }

        setRiotProxy({
          status: data.ok && data.hasKey ? 'connected' : 'error',
          data,
          error: data.hasKey ? null : 'Proxy is running, but no Riot key was detected.',
        })
      } catch (error) {
        if (isCancelled) {
          return
        }

        setRiotProxy({
          status: 'error',
          data: null,
          error: error instanceof Error ? error.message : 'Proxy health check failed.',
        })
      }
    }

    void loadProxyHealth()

    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    let isCancelled = false

    const loadLcuProxy = async () => {
      try {
        const healthResponse = await fetch(getLcuProxyHealthUrl(riotInstallPath))

        if (!healthResponse.ok) {
          throw new Error(`LCU health request failed: ${healthResponse.status}`)
        }

        const healthData = (await healthResponse.json()) as LcuProxyHealth

        if (!healthData.ok) {
          if (isCancelled) {
            return
          }

          setLcuProxy({
            status: 'error',
            data: healthData,
            identity: null,
            error: 'League client lockfile was not found by the local proxy.',
          })
          return
        }

        const identityResponse = await fetch(getLcuProxyIdentityUrl(riotInstallPath))
        const identityBody = (await identityResponse.json()) as LcuProxyIdentity | { error?: string }

        if (isCancelled) {
          return
        }

        if (!identityResponse.ok) {
          setLcuProxy({
            status: 'error',
            data: healthData,
            identity: null,
            error:
              'error' in identityBody && identityBody.error
                ? identityBody.error
                : `LCU identity request failed: ${identityResponse.status}`,
          })
          return
        }

        setLcuProxy({
          status: 'connected',
          data: healthData,
          identity: {
            displayName:
              'displayName' in identityBody ? identityBody.displayName ?? 'League player' : 'League player',
            gameName: 'gameName' in identityBody ? identityBody.gameName ?? null : null,
            tagLine: 'tagLine' in identityBody ? identityBody.tagLine ?? null : null,
          },
          error: null,
        })
      } catch (error) {
        if (isCancelled) {
          return
        }

        setLcuProxy({
          status: 'error',
          data: null,
          identity: null,
          error: error instanceof Error ? error.message : 'LCU proxy check failed.',
        })
      }
    }

    void loadLcuProxy()

    return () => {
      isCancelled = true
    }
  }, [riotInstallPath])

  useEffect(() => {
    let isCancelled = false

    const loadRiotClientAlias = async () => {
      try {
        const response = await fetch(getRiotClientAliasUrl())
        const body = (await response.json()) as RiotClientAliasIdentity | { error?: string }

        if (isCancelled) {
          return
        }

        if (!response.ok) {
          setRiotClientAlias({
            identity: null,
            error:
              'error' in body && body.error
                ? body.error
                : `Riot Client alias request failed: ${response.status}`,
          })
          return
        }

        setRiotClientAlias({
          identity: {
            displayName:
              'game_name' in body && body.game_name && 'tag_line' in body && body.tag_line
                ? `${body.game_name}#${body.tag_line}`
                : 'Riot player',
            gameName: 'game_name' in body ? body.game_name ?? null : null,
            tagLine: 'tag_line' in body ? body.tag_line ?? null : null,
          },
          error: null,
        })
      } catch (error) {
        if (isCancelled) {
          return
        }

        setRiotClientAlias({
          identity: null,
          error:
            error instanceof Error ? error.message : 'Riot Client alias check failed.',
        })
      }
    }

    void loadRiotClientAlias()

    return () => {
      isCancelled = true
    }
  }, [])

  const detectedIdentity =
    riotClientAlias.identity ?? lcuProxy.identity ?? currentLeagueIdentity
  const shouldShowLegacyLcuIdentityError =
    !riotClientAlias.identity && Boolean(lcuProxy.error)

  useEffect(() => {
    if (!detectedIdentity?.gameName || !detectedIdentity?.tagLine) {
      return
    }

    if (riotAccount.gameName.trim() || riotAccount.tagLine.trim()) {
      return
    }

    onUpdateRiotAccount({
      ...riotAccount,
      gameName: detectedIdentity.gameName,
      tagLine: detectedIdentity.tagLine,
    })
  }, [
    detectedIdentity?.gameName,
    detectedIdentity?.tagLine,
    onUpdateRiotAccount,
    riotAccount,
  ])

  return (
    <section className="screen-stack">
      <div className="section-header">
        <div>
          <p className="eyebrow">Preferences and connections</p>
          <h2>Settings</h2>
        </div>
      </div>

      <div className="two-column">
        <article className="panel">
          <p className="eyebrow">Overlay controls</p>
          <ul className="bullet-list">
            <li>Toggle overlay hotkey with support for remapping later.</li>
            <li>Move overlay to a second monitor when available.</li>
            <li>Keep the panel pinned, hidden, or context-aware by phase.</li>
          </ul>
        </article>

        <article className="panel">
          <p className="eyebrow">Recommended in-game settings</p>
          <ul className="bullet-list">
            <li>Enable minimap scaling that makes ward and objective awareness easier.</li>
            <li>Use quick cast once comfortable, but do not force it on day one.</li>
            <li>Keep chat load manageable so new players can focus on learning.</li>
          </ul>
        </article>
      </div>

      <article className="panel">
        <p className="eyebrow">Runtime health</p>
        <div className="info-card-grid">
          <div className="info-card">
            <h3>Overwolf</h3>
            <p>{formatStatus(runtimeStatus.overwolfAvailable)}</p>
          </div>
          <div className="info-card">
            <h3>League running</h3>
            <p>{formatStatus(runtimeStatus.leagueRunning)}</p>
          </div>
          <div className="info-card">
            <h3>LCU status</h3>
            <p>{lcuProxy.status === 'connected' ? 'connected (proxy)' : formatStatus(runtimeStatus.lcu)}</p>
          </div>
          <div className="info-card">
            <h3>Live client</h3>
            <p>{formatStatus(runtimeStatus.liveClient)}</p>
          </div>
          <div className="info-card">
            <h3>Game events</h3>
            <p>{formatStatus(runtimeStatus.gameEvents)}</p>
          </div>
          <div className="info-card">
            <h3>Lockfile path</h3>
            <p>{lcuProxy.data?.lockfilePath ?? runtimeStatus.lockfilePath ?? 'Not found yet'}</p>
          </div>
        </div>
        <div className="settings-inline-actions">
          <label className="settings-field">
            <span>League install path</span>
            <input
              className="journal-input"
              type="text"
              value={riotInstallPath}
              onChange={(event) => onUpdateRiotInstallPath(event.target.value)}
              placeholder="C:\\Riot Games\\League of Legends"
            />
          </label>
          <p className="settings-inline-copy">
            If LCU stays on searching, paste the League folder path that contains the client
            lockfile, then wait a few seconds for LaneUp to rescan.
          </p>
        </div>
      </article>

      <article className="panel">
        <p className="eyebrow">Riot proxy health</p>
        <div className="info-card-grid">
          <div className="info-card">
            <h3>Proxy status</h3>
            <p>{riotProxy.status}</p>
          </div>
          <div className="info-card">
            <h3>Key detected</h3>
            <p>{riotProxy.data ? String(riotProxy.data.hasKey) : 'Unknown'}</p>
          </div>
          <div className="info-card">
            <h3>Proxy port</h3>
            <p>{riotProxy.data ? String(riotProxy.data.port) : 'Unknown'}</p>
          </div>
        </div>
        {riotProxy.error ? (
          <p className="settings-error-note">Riot proxy issue: {riotProxy.error}</p>
        ) : null}
      </article>

      <article className="panel">
        <p className="eyebrow">Riot account link</p>
        <div className="one-column">
          <label className="settings-field">
            <span>Game name</span>
            <input
              className="journal-input"
              type="text"
              value={riotAccount.gameName}
              onChange={(event) =>
                onUpdateRiotAccount({
                  ...riotAccount,
                  gameName: event.target.value,
                })
              }
              placeholder="Your Riot game name"
            />
          </label>
          <label className="settings-field">
            <span>Tag line</span>
            <input
              className="journal-input"
              type="text"
              value={riotAccount.tagLine}
              onChange={(event) =>
                onUpdateRiotAccount({
                  ...riotAccount,
                  tagLine: event.target.value,
                })
              }
              placeholder="NA1 or your custom tag"
            />
          </label>
          <label className="settings-field">
            <span>Regional routing</span>
            <select
              className="journal-input"
              value={riotAccount.regionalRouting}
              onChange={(event) =>
                onUpdateRiotAccount({
                  ...riotAccount,
                  regionalRouting: event.target.value as RiotAccountConfig['regionalRouting'],
                })
              }
            >
              <option value="americas">Americas</option>
              <option value="europe">Europe</option>
              <option value="asia">Asia</option>
              <option value="sea">SEA</option>
            </select>
          </label>
          <div className="settings-inline-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                if (!detectedIdentity?.gameName || !detectedIdentity?.tagLine) {
                  return
                }

                onUpdateRiotAccount({
                  ...riotAccount,
                  gameName: detectedIdentity.gameName,
                  tagLine: detectedIdentity.tagLine,
                })
              }}
              disabled={!detectedIdentity?.gameName || !detectedIdentity?.tagLine}
            >
              Use current League client
            </button>
            <p className="settings-inline-copy">
              {detectedIdentity?.gameName && detectedIdentity?.tagLine
                ? `Detected from Riot Client: ${detectedIdentity.gameName}#${detectedIdentity.tagLine}`
                : detectedIdentity?.displayName
                  ? `League is open as ${detectedIdentity.displayName}, but Riot ID is not available yet.`
                  : 'Open the League client to autofill your Riot ID here.'}
            </p>
          </div>
          <div className="settings-inline-actions">
            <button
              type="button"
              className="primary-button"
              onClick={onLoadRiotHistory}
              disabled={
                riotHistoryStatus === 'searching' ||
                !riotAccount.gameName.trim() ||
                !riotAccount.tagLine.trim()
              }
            >
              {riotHistoryStatus === 'searching' ? 'Loading history...' : 'Load history'}
            </button>
            <p className="settings-inline-copy">
              This only runs when you click it, so you can confirm whether your Riot ID works
              without waiting on background retries.
            </p>
          </div>
        </div>
        <div className="info-card-grid">
          <div className="info-card">
            <h3>History status</h3>
            <p>{riotHistoryStatus}</p>
          </div>
          <div className="info-card">
            <h3>Resolved account</h3>
            <p>{resolvedAccount ?? 'Waiting for Riot ID lookup.'}</p>
          </div>
          <div className="info-card">
            <h3>Why this matters</h3>
            <p>Recent-match history now fills the post-game screen through the local Riot proxy.</p>
          </div>
        </div>
        {riotHistoryError ? (
          <p className="settings-error-note">Riot history issue: {riotHistoryError}</p>
        ) : null}
        {shouldShowLegacyLcuIdentityError ? (
          <p className="settings-error-note">League client issue: {lcuProxy.error}</p>
        ) : null}
        {riotClientAlias.error ? (
          <p className="settings-error-note">Riot Client alias issue: {riotClientAlias.error}</p>
        ) : null}
        {runtimeStatus.lastError ? (
          <p className="settings-error-note">Last provider error: {runtimeStatus.lastError}</p>
        ) : null}
      </article>
    </section>
  )
}
