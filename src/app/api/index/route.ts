import { fetchMarketIndices } from "@/lib/api/yahoo-finance"

export type { MarketIndex } from "@/lib/api/yahoo-finance"

export async function GET() {
  try {
    const indices = await fetchMarketIndices()
    return Response.json(indices)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return Response.json({ error: message }, { status: 500 })
  }
}
