import { type NextRequest } from "next/server"
import { fetchAllStocks, fetchStockQuote } from "@/lib/api/yahoo-finance"

export async function GET(request: NextRequest) {
  const ticker = request.nextUrl.searchParams.get("ticker")

  try {
    if (ticker) {
      const quote = await fetchStockQuote(ticker)
      return Response.json(quote)
    }
    const quotes = await fetchAllStocks()
    return Response.json(quotes)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return Response.json({ error: message }, { status: 500 })
  }
}
