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

  const fmtPrice = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div
      className="flex-1 flex items-center justify-between px-4 py-3.5 rounded-2xl min-w-0"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="text-lg shrink-0">{index.region === "KR" ? "🇰🇷" : "🇺🇸"}</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-bold text-sm">{index.name}</span>
          <span
            className="text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1"
            style={{
              backgroundColor: index.isOpen ? "#22c55e18" : "var(--border)",
              color: index.isOpen ? "#22c55e" : "var(--muted)",
            }}
          >
            <span
              className="w-1 h-1 rounded-full"
              style={{ backgroundColor: index.isOpen ? "#22c55e" : "var(--muted)" }}
            />
            {index.isOpen ? "장중" : "마감"}
          </span>
        </div>
      </div>

      <div className="flex items-baseline gap-2 shrink-0">
        <span className="text-xs tabular-nums" style={{ color: changeColor }}>
          {arrow} {sign}{index.changePercent.toFixed(2)}%
        </span>
        <span className="text-lg font-bold tabular-nums" style={{ letterSpacing: "-0.02em" }}>
          {fmtPrice(index.price)}
        </span>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div
      className="flex-1 flex items-center justify-between px-4 py-3.5 rounded-2xl"
      style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-full animate-pulse" style={{ backgroundColor: "var(--border)" }} />
        <div className="h-4 w-16 rounded animate-pulse" style={{ backgroundColor: "var(--border)" }} />
      </div>
      <div className="h-6 w-24 rounded animate-pulse" style={{ backgroundColor: "var(--border)" }} />
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

  const kr = data?.filter((d) => d.region === "KR") ?? []
  const us = data?.filter((d) => d.region === "US") ?? []

  return (
    <div className="space-y-3 mb-6">
      {/* 국내 지수 — 1행 2열 */}
      <div className="flex flex-col sm:flex-row gap-3">
        {kr.length
          ? kr.map((idx) => <IndexCard key={idx.ticker} index={idx} />)
          : [1, 2].map((i) => <SkeletonCard key={i} />)}
      </div>

      {/* 미국 지수 — 1행 3열 */}
      <div className="flex flex-col sm:flex-row gap-3">
        {us.length
          ? us.map((idx) => <IndexCard key={idx.ticker} index={idx} />)
          : [1, 2, 3].map((i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  )
}
