import type { ExchangeRate } from "@/app/api/exchange/route"
import ExchangeClient from "@/components/exchange/ExchangeClient"
import FearGreedBanner from "@/components/exchange/FearGreedBanner"
import ExchangeLastUpdated from "@/components/exchange/ExchangeLastUpdated"

export const revalidate = 3600

async function fetchInitial(): Promise<ExchangeRate[]> {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"
    const res = await fetch(`${base}/api/exchange`, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function ExchangePage() {
  const initial = await fetchInitial()

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
      <ExchangeClient initial={initial} />
    </div>
  )
}
