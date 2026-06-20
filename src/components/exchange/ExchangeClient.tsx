"use client"

import { useQuery } from "@tanstack/react-query"
import type { ExchangeRate } from "@/app/api/exchange/route"
import ExchangeCard from "./ExchangeCard"

async function fetchExchange(): Promise<ExchangeRate[]> {
  const res = await fetch("/api/exchange")
  if (!res.ok) throw new Error("환율 데이터 로딩 실패")
  return res.json()
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

export default function ExchangeClient({ initial }: { initial: ExchangeRate[] }) {
  const { data } = useQuery({
    queryKey: ["exchange"],
    queryFn: fetchExchange,
    initialData: initial,
    refetchInterval: 60 * 60 * 1000, // 1시간 (환율은 일 단위)
    staleTime: 60 * 60 * 1000,
  })

  return (
    <div>
      {/* Grid */}
      {!data?.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {data.map((rate) => (
            <ExchangeCard key={rate.ticker} rate={rate} />
          ))}
        </div>
      )}
    </div>
  )
}
