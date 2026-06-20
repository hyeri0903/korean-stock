import { type NextRequest } from "next/server"

export interface MarketIndex {
  name: string
  ticker: string
  price: number
  change: number
  changePercent: number
  isOpen: boolean
  region: "KR" | "US"
}

function isKRXOpen(): boolean {
  const kst = new Date(Date.now() + 9 * 60 * 60 * 1000)
  const total = kst.getUTCHours() * 60 + kst.getUTCMinutes()
  const day = kst.getUTCDay()
  return day >= 1 && day <= 5 && total >= 540 && total < 930
}

function isNYSEOpen(): boolean {
  // NYSE: 09:30~16:00 ET (UTC-4 summer / UTC-5 winter)
  const now = new Date()
  const et = new Date(now.getTime() - 4 * 60 * 60 * 1000) // EDT 기준
  const total = et.getUTCHours() * 60 + et.getUTCMinutes()
  const day = et.getUTCDay()
  return day >= 1 && day <= 5 && total >= 570 && total < 960
}

async function fetchIndex(
  yahooTicker: string,
  name: string,
  region: "KR" | "US"
): Promise<MarketIndex> {
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
  const isOpen = region === "KR" ? isKRXOpen() : isNYSEOpen()

  return { name, ticker: yahooTicker, price, change, changePercent, isOpen, region }
}

export async function GET(_req: NextRequest) {
  try {
    const [kospi, kosdaq, sp500, nasdaq, dow] = await Promise.all([
      fetchIndex("^KS11", "KOSPI",  "KR"),
      fetchIndex("^KQ11", "KOSDAQ", "KR"),
      fetchIndex("^GSPC", "S&P 500",  "US"),
      fetchIndex("^IXIC", "NASDAQ",   "US"),
      fetchIndex("^DJI",  "DOW",      "US"),
    ])
    return Response.json([kospi, kosdaq, sp500, nasdaq, dow])
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return Response.json({ error: message }, { status: 500 })
  }
}
