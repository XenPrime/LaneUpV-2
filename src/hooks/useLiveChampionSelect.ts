import { useEffect, useMemo, useState } from 'react'
import type { RoleId } from '../types'
import { fetchFromLcuProxy } from '../utils/riotApi'

type LcuTeam = Array<{
  summonerId: number
  summonerName: string
  assignedPosition: string | null
  championId: number
  cellId: number
  team: number
}>

interface LcuChampSelectSession {
  myTeam?: LcuTeam
  theirTeam?: LcuTeam
  localPlayerCellId?: number
  timer?: { phase?: string }
}

interface LeagueEntry {
  queueType: string
  tier: string
  rank: string
  wins: number
  losses: number
}

interface RankedResults {
  results: Record<string, LeagueEntry[]>
}

interface LiveParticipant {
  summonerId: number
  summonerName: string
  role: RoleId | null
  championId: number
  team: 'ally' | 'enemy'
  rank?: string
  winrate?: string
}

function mapRole(role: string | null): RoleId | null {
  if (!role) return null
  const lower = role.toLowerCase()
  if (lower === 'utility' || lower === 'support') return 'utility'
  if (lower === 'bottom' || lower === 'adc') return 'bottom'
  if (lower === 'middle' || lower === 'mid') return 'middle'
  if (lower === 'jungle') return 'jungle'
  if (lower === 'top') return 'top'
  return null
}

function formatRank(entries: LeagueEntry[] | undefined) {
  if (!entries || entries.length === 0) return undefined
  const solo = entries.find((e) => e.queueType === 'RANKED_SOLO_5x5') ?? entries[0]
  const total = solo.wins + solo.losses
  const wr = total > 0 ? Math.round((solo.wins / total) * 100) : null
  const rank = `${solo.tier ?? ''} ${solo.rank ?? ''}`.trim()
  return {
    rank: rank.length > 0 ? rank : undefined,
    winrate: wr !== null ? `${wr}% WR (${solo.wins}W ${solo.losses}L)` : undefined,
  }
}

const CHAMP_SELECT_PHASES = ['PLANNING', 'BAN_PICK', 'FINALIZATION', 'GAME_STARTING']

export function useLiveChampionSelect(
  pollMs = 2000,
  onChampSelectStart?: () => void,
) {
  const [participants, setParticipants] = useState<LiveParticipant[] | null>(null)
  const [phase, setPhase] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [previousPhase, setPreviousPhase] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout>

    const run = async () => {
      try {
        const session = (await fetchFromLcuProxy<LcuChampSelectSession>(
          '/lcu/champ-select/session',
        )) || {}

        const myTeam = session.myTeam ?? []
        const theirTeam = session.theirTeam ?? []
        const ids = [...myTeam, ...theirTeam]
          .map((p) => p.summonerId)
          .filter((v) => Number.isFinite(v))

        let ranks: RankedResults | null = null
        if (ids.length > 0) {
          ranks = await fetchFromLcuProxy<RankedResults>('/lcu/league/summoner', {
            ids: ids.join(','),
          })
        }

        const mapped: LiveParticipant[] = [...myTeam, ...theirTeam].map((p) => {
          const role = mapRole(p.assignedPosition)
          const team: 'ally' | 'enemy' = myTeam.includes(p) ? 'ally' : 'enemy'
          const rankInfo = ranks?.results?.[String(p.summonerId)]
          const formatted = formatRank(rankInfo)
          return {
            summonerId: p.summonerId,
            summonerName: p.summonerName,
            role,
            championId: p.championId,
            team,
            rank: formatted?.rank,
            winrate: formatted?.winrate,
          }
        })

        const newPhase = session.timer?.phase ?? ''

        if (!cancelled) {
          setParticipants(mapped)
          setPhase(newPhase)
          setError(null)

          // Detect phase transition: trigger callback if we've moved to a champ-select phase
          if (
            onChampSelectStart &&
            previousPhase !== null &&
            !CHAMP_SELECT_PHASES.includes(previousPhase) &&
            CHAMP_SELECT_PHASES.includes(newPhase)
          ) {
            onChampSelectStart()
          }

          setPreviousPhase(newPhase)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown champ select error')
          setParticipants(null)
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
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [pollMs, onChampSelectStart])

  const byTeam = useMemo(() => {
    if (!participants) return { allies: [], enemies: [] }
    return {
      allies: participants.filter((p) => p.team === 'ally'),
      enemies: participants.filter((p) => p.team === 'enemy'),
    }
  }, [participants])

  return { participants, byTeam, phase, error }
}
