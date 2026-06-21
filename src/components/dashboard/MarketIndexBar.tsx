"use client"

import { useQuery } from "@tanstack/react-query"
import type { MarketIndex } from "@/lib/api/yahoo-finance"

async function fetchIndices(): Promise<MarketIndex[]> {
  const res = await fetch("/api/index")
  if (!res.ok) throw new Error("지수 데이터 로딩 실패")
  return res.json()
}

function IndexCard({ index }: { index: MarketIndex }) {
  const up = index.change >= 0
  const sign = up ? "+" : ""
  const changeColor = up ? "var(--up)" : "var(--down)"
  const arrow = index.change === 0 ? "" : up ? "▲" : "▼"

  return (
    <div
      className="flex flex-col gap-2 px-4 py-3.5 rounded-2xl min-w-0"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Top: name + status */}
      <div className="flex items-center justify-between gap-2 min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-base shrink-0" aria-hidden>{index.exchange === "US" ? "🇺🇸" : "🇰🇷"}</span>
          <span className="font-bold text-sm truncate">{index.name}</span>
        </div>
        <span
          className="text-[10px] px-1.5 py-0.5 rounded-full font-medium flex items-center gap-1 shrink-0"
          style={{
            backgroundColor: index.isOpen ? "#22c55e18" : "var(--border)",
            color: index.isOpen ? "#22c55e" : "var(--muted)",
            border: `1px solid ${index.isOpen ? "#22c55e33" : "transparent"}`,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: index.isOpen ? "#22c55e" : "var(--muted)" }}
          />
          {index.isOpen ? "장중" : "마감"}
        </span>
      </div>

      {/* Bottom: price + change */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-xl font-bold tabular-nums truncate" style={{ letterSpacing: "-0.02em" }}>
          {index.price.toLocaleString("ko-KR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span className="text-xs tabular-nums truncate" style={{ color: changeColor }}>
          {arrow} {sign}{index.change.toFixed(2)}{" "}
          <span className="font-semibold">{sign}{index.changePercent.toFixed(2)}%</span>
        </span>
      </div>
    </div>
  )
}

function IndexCardSkeleton() {
  return (
    <div
      className="flex flex-col gap-2 px-4 py-3.5 rounded-2xl"
      style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center justify-between">
        <div className="h-4 w-16 rounded animate-pulse" style={{ backgroundColor: "var(--border)" }} />
        <div className="h-4 w-10 rounded-full animate-pulse" style={{ backgroundColor: "var(--border)" }} />
      </div>
      <div className="h-6 w-24 rounded animate-pulse" style={{ backgroundColor: "var(--border)" }} />
      <div className="h-3 w-20 rounded animate-pulse" style={{ backgroundColor: "var(--border)" }} />
    </div>
  )
}

export default function MarketIndexBar({ initial }: { initial: MarketIndex[] }) {
  const { data } = useQuery({
    queryKey: ["market-index"],
    queryFn: fetchIndices,
    initialData: initial,
    refetchInterval: 30_000,
  })

  if (!data?.length) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <IndexCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {data.map((idx) => (
        <IndexCard key={idx.ticker} index={idx} />
      ))}
    </div>
  )
}
