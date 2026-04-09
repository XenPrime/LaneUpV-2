import { useEffect, useState } from 'react'
import type { RiotAccountConfig, RiotRecentMatch } from '../types'
import { fetchFromRiotProxy } from '../utils/riotApi'

interface RiotAccountLookupResponse {
  puuid: string
  gameName: string
  tagLine: string
}

type RiotMatchIdsResponse = string[]

interface RiotMatchDetailResponse {
  metadata: {
    matchId: string
    participants: string[]
  }
  info: {
    gameCreation: number
    gameDuration: number
    queueId: number
    participants: Array<{
      puuid: string
      championName: string
      win: boolean
      kills: number
      deaths: number
      assists: number
      teamPosition?: string
      individualPosition?: string
    }>
  }
}

interface RiotMatchHistoryState {
  status: 'idle' | 'searching' | 'connected' | 'error'
  matches: RiotRecentMatch[]
  resolvedAccount: string | null
  error: string | null
}

function formatDuration(seconds: number) {
  const safeSeconds = Math.max(0, Math.round(seconds))
  const minutes = Math.floor(safeSeconds / 60)
  const remainder = safeSeconds % 60
  return `${minutes}:${String(remainder).padStart(2, '0')}`
}

function formatStartedAt(timestamp: number) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(timestamp))
}

function formatRoleLabel(position?: string) {
  switch (position?.toUpperCase()) {
    case 'TOP':
      return 'Top'
    case 'JUNGLE':
      return 'Jungle'
    case 'MIDDLE':
    case 'MID':
      return 'Mid'
    case 'BOTTOM':
    case 'BOT':
      return 'Bot'
    case 'UTILITY':
    case 'SUPPORT':
      return 'Support'
    default:
      return 'Flex'
  }
}

function formatQueueLabel(queueId: number) {
  switch (queueId) {
    case 400:
      return 'Normal Draft'
    case 420:
      return 'Ranked Solo/Duo'
    case 430:
      return 'Normal Blind'
    case 440:
      return 'Ranked Flex'
    case 450:
      return 'ARAM'
    case 490:
      return 'Normal Quickplay'
    case 700:
      return 'Clash'
    default:
      return `Queue ${queueId}`
  }
}

function mapMatchDetailToRecentMatch(
  detail: RiotMatchDetailResponse,
  puuid: string,
): RiotRecentMatch | null {
  const participant = detail.info.participants.find((player) => player.puuid === puuid)

  if (!participant) {
    return null
  }

  return {
    matchId: detail.metadata.matchId,
    champion: participant.championName,
    queueLabel: formatQueueLabel(detail.info.queueId),
    result: participant.win ? 'Victory' : 'Defeat',
    kills: participant.kills,
    deaths: participant.deaths,
    assists: participant.assists,
    roleLabel: formatRoleLabel(participant.teamPosition || participant.individualPosition),
    startedAt: formatStartedAt(detail.info.gameCreation),
    durationLabel: formatDuration(detail.info.gameDuration),
  }
}

export function useRiotMatchHistory(
  account: RiotAccountConfig,
  loadRequestCount: number,
) {
  const [state, setState] = useState<RiotMatchHistoryState>({
    status: 'idle',
    matches: [],
    resolvedAccount: null,
    error: null,
  })

  useEffect(() => {
    let isCancelled = false

    const loadMatchHistory = async () => {
      if (loadRequestCount === 0) {
        return
      }

      if (!account.gameName.trim() || !account.tagLine.trim()) {
        setState({
          status: 'error',
          matches: [],
          resolvedAccount: null,
          error: 'Enter both a Riot game name and tag line before loading history.',
        })
        return
      }

      setState((currentState) => ({
        ...currentState,
        status: 'searching',
        error: null,
      }))

      try {
        const resolvedAccount = await fetchFromRiotProxy<RiotAccountLookupResponse>({
          host: `${account.regionalRouting}.api.riotgames.com`,
          path: `/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(account.gameName.trim())}/${encodeURIComponent(account.tagLine.trim())}`,
        })

        const matchIds = await fetchFromRiotProxy<RiotMatchIdsResponse>({
          host: `${account.regionalRouting}.api.riotgames.com`,
          path: `/lol/match/v5/matches/by-puuid/${encodeURIComponent(resolvedAccount.puuid)}/ids`,
          params: {
            start: 0,
            count: 3,
          },
        })

        const matchDetails = await Promise.all(
          matchIds.map((matchId) =>
            fetchFromRiotProxy<RiotMatchDetailResponse>({
              host: `${account.regionalRouting}.api.riotgames.com`,
              path: `/lol/match/v5/matches/${encodeURIComponent(matchId)}`,
            }),
          ),
        )

        if (isCancelled) {
          return
        }

        const matches = matchDetails
          .map((detail) => mapMatchDetailToRecentMatch(detail, resolvedAccount.puuid))
          .filter((match): match is RiotRecentMatch => match !== null)

        setState({
          status: 'connected',
          matches,
          resolvedAccount: `${resolvedAccount.gameName}#${resolvedAccount.tagLine}`,
          error: null,
        })
      } catch (error) {
        if (isCancelled) {
          return
        }

        setState({
          status: 'error',
          matches: [],
          resolvedAccount: null,
          error:
            error instanceof Error
              ? error.message
              : 'Unable to load Riot match history through the local proxy.',
        })
      }
    }

    void loadMatchHistory()

    return () => {
      isCancelled = true
    }
  }, [account.gameName, account.tagLine, account.regionalRouting, loadRequestCount])

  return state
}
