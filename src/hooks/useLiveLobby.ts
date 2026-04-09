import { useEffect, useState } from 'react'
import type { LobbyPreferences, RoleId } from '../types'
import { fetchFromLcuProxy } from '../utils/riotApi'

interface LobbyMemberPositionPref {
  firstPreference: string | null
  secondPreference: string | null
}

interface LobbyMember {
  summonerId: number
  summonerName: string
  positionPreferences?: LobbyMemberPositionPref
  isLocalPlayer?: boolean
}

interface LobbyResponse {
  state?: string
  queueId?: number
  members?: LobbyMember[]
}

function mapRole(pref: string | null): RoleId | null {
  if (!pref) return null
  const p = pref.toLowerCase()
  if (p === 'top') return 'top'
  if (p === 'jungle') return 'jungle'
  if (p === 'middle' || p === 'mid') return 'middle'
  if (p === 'bottom' || p === 'adc') return 'bottom'
  if (p === 'utility' || p === 'support') return 'utility'
  return null
}

export function useLiveLobby(pollMs = 4000) {
  const [intent, setIntent] = useState<LobbyPreferences | null>(null)
  const [status, setStatus] = useState<'idle' | 'inLobby' | 'error'>('idle')
  const [queueId, setQueueId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout>

    const run = async () => {
      try {
        const lobby = await fetchFromLcuProxy<LobbyResponse>('/lcu/lobby')
        const me = lobby.members?.find((m) => m.isLocalPlayer) ?? lobby.members?.[0]
        const first = mapRole(me?.positionPreferences?.firstPreference) ?? undefined
        const second = mapRole(me?.positionPreferences?.secondPreference) ?? undefined

        if (!cancelled) {
          if (first && second) {
            setIntent({ firstPositionPreference: first, secondPositionPreference: second })
            setStatus('inLobby')
          } else {
            setIntent(null)
            setStatus('idle')
          }
          setQueueId(lobby.queueId ?? null)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setStatus('error')
          setError(err instanceof Error ? err.message : 'Lobby lookup failed')
          setIntent(null)
        }
      } finally {
        if (!cancelled) {
          timer = setTimeout(run, pollMs)
        }
      }
    }

    run()

    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [pollMs])

  return { intent, status, queueId, error }
}
