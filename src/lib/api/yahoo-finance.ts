import { StockQuote } from "@/types/stock"
import { SEMICONDUCTOR_STOCKS } from "@/lib/data/stocks"

const YF_BASE = "https://query1.finance.yahoo.com"

interface YFChartResult {
  meta: {
    regularMarketPrice: number
    chartPreviousClose?: number
    regularMarketDayHigh: number
    regularMarketDayLow: number
    regularMarketVolume: number
    marketCap?: number
  }
  timestamp: number[]
  indicators: {
    quote: Array<{
      open: (number | null)[]
      close: (number | null)[]
    }>
  }
}

export async function fetchStockQuote(ticker: string): Promise<StockQuote> {
  const config = SEMICONDUCTOR_STOCKS.find((s) => s.ticker === ticker)
  const yahooTicker = `${ticker}.KS`

  const url = `${YF_BASE}/v8/finance/chart/${yahooTicker}?interval=1d&range=1mo`
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    next: { revalidate: 30 },
  })

  if (!res.ok) {
    throw new Error(`Yahoo Finance API error: ${res.status}`)
  }

  const data = await res.json()
  const result: YFChartResult = data.chart.result[0]
  const meta = result.meta

  const price = meta.regularMarketPrice
  const previousClose = meta.chartPreviousClose ?? 0
  const change = previousClose ? price - previousClose : 0
  const changePercent = previousClose ? (change / previousClose) * 100 : 0

  const timestamps = result.timestamp ?? []
  const quote = result.indicators.quote[0]
  const closes = quote?.close ?? []
  const opens = quote?.open ?? []

  const history = timestamps
    .map((ts, i) => ({
      date: new Date(ts * 1000).toISOString().slice(0, 10),
      close: closes[i] ?? 0,
    }))
    .filter((h) => h.close > 0)

  const todayOpen = opens[opens.length - 1] ?? undefined

  // 전일 종가 날짜: 히스토리 마지막 항목 (오늘 데이터 제외)
  const previousCloseDate = history.length >= 2
    ? history[history.length - 2].date
    : history.length === 1
      ? history[0].date
      : ""

  return {
    ticker,
    name: config?.name ?? ticker,
    price,
    change,
    changePercent,
    open: todayOpen,
    high: meta.regularMarketDayHigh,
    low: meta.regularMarketDayLow,
    volume: meta.regularMarketVolume,
    marketCap: meta.marketCap,
    previousClose,
    previousCloseDate,
    history,
    updatedAt: new Date().toISOString(),
  }
}

export async function fetchAllStocks(): Promise<StockQuote[]> {
  const results = await Promise.allSettled(
    SEMICONDUCTOR_STOCKS.map((s) => fetchStockQuote(s.ticker))
  )
  return results
    .filter((r): r is PromiseFulfilledResult<StockQuote> => r.status === "fulfilled")
    .map((r) => r.value)
}
