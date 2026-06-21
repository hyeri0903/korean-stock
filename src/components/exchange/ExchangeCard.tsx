"use client"

import type { ExchangeRate } from "@/app/api/exchange/route"

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
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        {rate.label} <span className="font-semibold">{rate.unit}</span>
      </p>
      <p className="text-2xl font-bold tabular-nums leading-tight" style={{ letterSpacing: "-0.02em" }}>
        {fmt(rate.rate)}
      </p>
      <p className="text-xs font-medium tabular-nums flex items-center gap-1" style={{ color: changeColor }}>
        <span>{arrow}</span>
        <span>{fmt(Math.abs(rate.change))}</span>
        <span>{sign}{rate.changePercent.toFixed(2)}%</span>
      </p>
    </div>
  )
}
