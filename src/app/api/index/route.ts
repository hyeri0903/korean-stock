import { type NextRequest } from "next/server"

export interface MarketIndex {
  name: string
  ticker: string
  price: number
  change: number
  changePercent: number
  isOpen: boolean
}

async function fetchIndex(yahooTicker: string, name: string): Promise<MarketIndex> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooTicker)}?interval=1d&range=1d`
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    next: { revalidate: 30 },
  })
  if (!res.ok) throw new Error(`${name} fetch failed`)

  const data = await res.json()
  const meta = data.chart.result[0].meta
  const price: number = meta.regularMarketPrice
  const prev: number = meta.chartPreviousClose ?? price
  const change = prev ? price - prev : 0
  const changePercent = prev ? (change / prev) * 100 : 0

  // KRX: 09:00~15:30 KST
  const now = new Date()
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  const h = kst.getUTCHours()
  const m = kst.getUTCMinutes()
  const total = h * 60 + m
  const day = kst.getUTCDay()
  const isOpen = day >= 1 && day <= 5 && total >= 540 && total < 930

  return { name, ticker: yahooTicker, price, change, changePercent, isOpen }
}

export async function GET(_req: NextRequest) {
  try {
    const [kospi, kosdaq] = await Promise.all([
      fetchIndex("^KS11", "KOSPI"),
      fetchIndex("^KQ11", "KOSDAQ"),
    ])
    return Response.json([kospi, kosdaq])
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return Response.json({ error: message }, { status: 500 })
  }
}
