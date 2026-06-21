"use client"

import type { MethodResult } from "@/lib/valuation/fairPrice"
import { formatNumber, formatPercent } from "@/lib/utils"

export default function MethodCard({
  method,
  currentPrice,
}: {
  method: MethodResult
  currentPrice: number | null
}) {
  const skipped = method.price == null
  const upside =
    method.price != null && currentPrice != null && currentPrice > 0
      ? ((method.price - currentPrice) / currentPrice) * 100
      : null
  const upColor = upside == null ? "var(--muted)" : upside >= 0 ? "var(--up)" : "var(--down)"

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-1.5"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        opacity: skipped ? 0.55 : 1,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold">{method.label}</span>
        {!skipped && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "var(--border)", color: "var(--muted)" }}>
            가중치 {(method.weight * 100).toFixed(0)}%
          </span>
        )}
      </div>

      {skipped ? (
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          계산 불가 — {method.skipReason}
        </span>
      ) : (
        <>
          <span className="text-xl font-bold tabular-nums" style={{ letterSpacing: "-0.02em" }}>
            {formatNumber(method.price)}원
          </span>
          <span className="text-xs tabular-nums" style={{ color: upColor }}>
            {upside == null ? "현재가 없음" : `현재가 대비 ${formatPercent(upside)}`}
          </span>
        </>
      )}
    </div>
  )
}
