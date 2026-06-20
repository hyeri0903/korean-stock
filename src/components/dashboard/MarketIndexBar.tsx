"use client"

import { useQuery } from "@tanstack/react-query"
import type { MarketIndex } from "@/app/api/index/route"

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
      className="flex-1 flex items-center justify-between px-5 py-4 rounded-2xl min-w-0"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Left: name + status */}
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-xl shrink-0" aria-hidden>🇰🇷</span>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base">{index.name}</span>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1"
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
        </div>
      </div>

      {/* Right: change + price */}
      <div className="flex items-baseline gap-3 shrink-0">
        <span className="text-sm tabular-nums" style={{ color: changeColor }}>
          {arrow} {sign}{index.change.toFixed(2)}&nbsp;
          <span className="font-semibold">{sign}{index.changePercent.toFixed(2)}%</span>
        </span>
        <span className="text-2xl font-bold tabular-nums" style={{ letterSpacing: "-0.02em" }}>
          {index.price.toLocaleString("ko-KR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  )
}

function IndexCardSkeleton() {
  return (
    <div
      className="flex-1 flex items-center justify-between px-5 py-4 rounded-2xl"
      style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full animate-pulse" style={{ backgroundColor: "var(--border)" }} />
        <div className="h-5 w-20 rounded animate-pulse" style={{ backgroundColor: "var(--border)" }} />
      </div>
      <div className="h-8 w-32 rounded animate-pulse" style={{ backgroundColor: "var(--border)" }} />
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
      <div className="flex gap-3 mb-6">
        <IndexCardSkeleton />
        <IndexCardSkeleton />
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {data.map((idx) => (
        <IndexCard key={idx.ticker} index={idx} />
      ))}
    </div>
  )
}
