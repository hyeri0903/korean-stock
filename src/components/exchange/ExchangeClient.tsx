"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { CURRENCIES, type ExchangeRate } from "@/lib/api/exchange"
import ExchangeCard from "./ExchangeCard"

const TOTAL = CURRENCIES.length

/**
 * /api/exchange 의 NDJSON 스트림을 읽어, 한 건 도착할 때마다 onRate로 흘려보낸다.
 */
async function streamExchange(onRate: (rate: ExchangeRate) => void): Promise<void> {
  const res = await fetch("/api/exchange")
  if (!res.ok || !res.body) throw new Error("환율 데이터 로딩 실패")

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buf = ""

  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    buf += decoder.decode(value, { stream: true })

    let nl: number
    while ((nl = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, nl).trim()
      buf = buf.slice(nl + 1)
      if (line) onRate(JSON.parse(line) as ExchangeRate)
    }
  }
  const tail = buf.trim()
  if (tail) onRate(JSON.parse(tail) as ExchangeRate)
}

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl p-4 space-y-2"
      style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="h-4 w-24 rounded animate-pulse" style={{ backgroundColor: "var(--border)" }} />
      <div className="h-8 w-32 rounded animate-pulse" style={{ backgroundColor: "var(--border)" }} />
      <div className="h-3 w-20 rounded animate-pulse" style={{ backgroundColor: "var(--border)" }} />
      <div className="h-14 rounded animate-pulse mt-2" style={{ backgroundColor: "var(--border)" }} />
    </div>
  )
}

export default function ExchangeClient() {
  const queryClient = useQueryClient()

  const { data = [], isFetching } = useQuery<ExchangeRate[]>({
    queryKey: ["exchange"],
    queryFn: async () => {
      const collected: ExchangeRate[] = []
      await streamExchange((rate) => {
        collected.push(rate)
        // 도착하는 즉시 캐시에 반영 → 카드가 하나씩 점진적으로 렌더된다.
        queryClient.setQueryData<ExchangeRate[]>(["exchange"], (prev) => {
          if (!prev) return [rate]
          const idx = prev.findIndex((p) => p.ticker === rate.ticker)
          if (idx === -1) return [...prev, rate] // 첫 로딩: 도착 순서대로 추가
          const copy = prev.slice()
          copy[idx] = rate // 갱신 시: 순서 유지하며 교체
          return copy
        })
      })
      return collected
    },
    refetchInterval: 60 * 60 * 1000, // 1시간 (환율은 일 단위)
    staleTime: 60 * 60 * 1000,
  })

  // 스트리밍이 진행 중일 때만 미도착분을 스켈레톤으로 채운다.
  // (완료 후에도 안 온 통화 = 업스트림 실패분 → 스켈레톤을 남기지 않음)
  const remaining = isFetching ? Math.max(0, TOTAL - data.length) : 0

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {data.map((rate) => (
        <ExchangeCard key={rate.ticker} rate={rate} />
      ))}
      {Array.from({ length: remaining }).map((_, i) => (
        <SkeletonCard key={`skeleton-${i}`} />
      ))}
    </div>
  )
}
