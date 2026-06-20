import { fetchAllStocks } from "@/lib/api/yahoo-finance"
import { StockQuote } from "@/types/stock"
import DashboardClient from "@/components/dashboard/DashboardClient"
import MarketIndexBar from "@/components/dashboard/MarketIndexBar"
import type { MarketIndex } from "@/app/api/index/route"

export const revalidate = 30

async function fetchIndices(): Promise<MarketIndex[]> {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"
    const res = await fetch(`${base}/api/index`, { next: { revalidate: 30 } })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function DashboardPage() {
  const [initialStocks, initialIndices] = await Promise.allSettled([
    fetchAllStocks(),
    fetchIndices(),
  ])

  const stocks: StockQuote[] =
    initialStocks.status === "fulfilled" ? initialStocks.value : []
  const indices: MarketIndex[] =
    initialIndices.status === "fulfilled" ? initialIndices.value : []

  return (
    <div>
      <MarketIndexBar initial={indices} />
      <DashboardClient initial={stocks} />
    </div>
  )
}
