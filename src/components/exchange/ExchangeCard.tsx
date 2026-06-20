"use client"

import dynamic from "next/dynamic"
import type { ExchangeRate } from "@/app/api/exchange/route"

const MiniChart = dynamic(() => import("@/components/dashboard/MiniChart"), { ssr: false })

export default function ExchangeCard({ rate }: { rate: ExchangeRate }) {
  const up = rate.change >= 0
  const sign = up ? "+" : ""
  const arrow = rate.change === 0 ? "─" : up ? "▲" : "▼"
  const changeColor = up ? "var(--up)" : "var(--down)"

  const fmt = (n: number) =>
    n.toLocaleString("ko-KR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-2 transition-all duration-150"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
    >
      {/* Label */}
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        {rate.label} <span className="font-semibold">{rate.unit}</span>
      </p>

      {/* Rate */}
      <p className="text-2xl font-bold tabular-nums leading-tight" style={{ letterSpacing: "-0.02em" }}>
        {fmt(rate.rate)}
      </p>

      {/* Change */}
      <p className="text-xs font-medium tabular-nums flex items-center gap-1" style={{ color: changeColor }}>
        <span>{arrow}</span>
        <span>{fmt(Math.abs(rate.change))}</span>
        <span>{sign}{rate.changePercent.toFixed(2)}%</span>
      </p>

      {/* Mini chart */}
      <div className="mt-1">
        <MiniChart data={rate.history} positive={up} />
      </div>
    </div>
  )
}
