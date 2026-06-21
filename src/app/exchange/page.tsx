import ExchangeClient from "@/components/exchange/ExchangeClient"
import FearGreedBanner from "@/components/exchange/FearGreedBanner"
import ExchangeLastUpdated from "@/components/exchange/ExchangeLastUpdated"

export default function ExchangePage() {
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold mb-0.5">환율</h1>
        <div className="flex items-center justify-between text-sm" style={{ color: "var(--muted)" }}>
          <span>KRW 기준 주요 통화 환율</span>
          <span className="flex items-center gap-1">
            <ExchangeLastUpdated /> · 출처: Yahoo Finance
          </span>
        </div>
      </div>
      <FearGreedBanner />
      <ExchangeClient />
    </div>
  )
}
