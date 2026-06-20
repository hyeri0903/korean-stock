"use client"

import dynamic from "next/dynamic"
import { StockQuote, getStockStatus, formatVolume } from "@/types/stock"
import { SEMICONDUCTOR_STOCKS } from "@/lib/data/stocks"

const MiniChart = dynamic(() => import("./MiniChart"), { ssr: false })

// "2026-06-19" → "6/19"
function formatDateLabel(dateStr: string): string {
  if (!dateStr) return ""
  const [, m, d] = dateStr.split("-")
  return `${parseInt(m)}/${parseInt(d)}`
}

const STOCK_COLORS: Record<string, string> = {
  "005930": "#1428A0",
  "000660": "#EA0029",
  "042700": "#0066CC",
}

function StockAvatar({ ticker, name }: { ticker: string; name: string }) {
  const bg = STOCK_COLORS[ticker] ?? "#2563eb"
  const abbr = name.slice(0, 2)
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
      style={{ backgroundColor: bg }}
    >
      {abbr}
    </div>
  )
}

function formatMarketCap(n: number | undefined): string {
  if (!n) return "-"
  const jo = Math.floor(n / 1_000_000_000_000)
  const rest = Math.floor((n % 1_000_000_000_000) / 100_000_000)
  if (jo > 0 && rest > 0) return `${jo.toLocaleString("ko-KR")}조 ${rest.toLocaleString("ko-KR")}억 원`
  if (jo > 0) return `${jo.toLocaleString("ko-KR")}조 원`
  return `${rest.toLocaleString("ko-KR")}억 원`
}

export default function StockCard({ quote }: { quote: StockQuote }) {
  const status = getStockStatus(quote.changePercent)
  const config = SEMICONDUCTOR_STOCKS.find((s) => s.ticker === quote.ticker)

  const upColor = "var(--up)"
  const downColor = "var(--down)"
  const changeColor =
    status === "up" ? upColor : status === "down" ? downColor : "var(--flat)"

  const sign = (quote.change ?? 0) >= 0 ? "+" : ""
  const arrow = status === "up" ? "▲" : status === "down" ? "▼" : "─"

  return (
    <article
      className="rounded-2xl p-5 transition-all duration-200 cursor-default group"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = "var(--primary)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "var(--border)")
      }
    >
      {/* Top row */}
      <div className="flex items-center gap-3 mb-3">
        <StockAvatar ticker={quote.ticker} name={quote.name} />
        <div>
          <h3 className="font-bold text-base leading-tight">{quote.name}</h3>
          <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "var(--muted)" }}>
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "var(--muted)" }}
            />
            지연 시세
          </p>
        </div>
      </div>

      {/* Price */}
      <div className="mb-1">
        <p
          className="text-2xl font-bold tabular-nums leading-tight"
          style={{ letterSpacing: "-0.02em" }}
        >
          ₩{(quote.price ?? 0).toLocaleString("ko-KR")}
          <span className="text-base font-normal ml-1" style={{ color: "var(--muted)" }}>
            원
          </span>
        </p>
      </div>

      {/* Change — "M/D 종가 대비 ▲ 1,234원 | +3.14%" */}
      <p
        className="text-sm font-semibold tabular-nums mb-3 flex items-center gap-1.5 flex-wrap"
        style={{ color: changeColor }}
      >
        {quote.previousCloseDate && (
          <span className="font-normal text-xs" style={{ color: "var(--muted)" }}>
            {formatDateLabel(quote.previousCloseDate)} 종가 대비
          </span>
        )}
        {arrow} {sign}{(quote.change ?? 0).toLocaleString("ko-KR")}원
        <span style={{ color: "var(--muted)" }}>|</span>
        {sign}{(quote.changePercent ?? 0).toFixed(2)}%
      </p>

      {/* Mini chart */}
      <div className="mb-3">
        <MiniChart data={quote.history} positive={status !== "down"} />
      </div>

      {/* Stats */}
      <div
        className="space-y-1.5 text-xs pt-3"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="flex justify-between">
          <span style={{ color: "var(--muted)" }}>시가총액</span>
          <span className="font-medium tabular-nums">
            {formatMarketCap(quote.marketCap)}
          </span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: "var(--muted)" }}>52주 최저·최고</span>
          <span className="font-medium tabular-nums">
            ₩{(quote.low ?? 0).toLocaleString("ko-KR")} ~ ₩{(quote.high ?? 0).toLocaleString("ko-KR")}
          </span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: "var(--muted)" }}>거래량</span>
          <span className="font-medium tabular-nums">{formatVolume(quote.volume)}</span>
        </div>
      </div>

      {config && (
        <p className="mt-2 text-xs truncate" style={{ color: "var(--muted)" }}>
          {config.description}
        </p>
      )}
    </article>
  )
}
