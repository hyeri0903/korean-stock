import { fetchAllStocks, fetchMarketIndices } from "@/lib/api/yahoo-finance"
import type { MarketIndex } from "@/lib/api/yahoo-finance"
import { StockQuote } from "@/types/stock"
import DashboardClient from "@/components/dashboard/DashboardClient"
import MarketIndexBar from "@/components/dashboard/MarketIndexBar"

export const revalidate = 30

export default async function DashboardPage() {
  const [initialStocks, initialIndices] = await Promise.allSettled([
    fetchAllStocks(),
    fetchMarketIndices(),
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
