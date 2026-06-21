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

  // 변동 계산 기준은 "오늘 시각 기준으로 장이 마지막으로 마감한 세션"이다.
  // meta.chartPreviousClose는 차트 범위(1mo) 시작 직전 종가라 전일 대비 용도로 쓸 수 없다.
  // - 장중: 마지막 캔들은 아직 마감 전 당일 봉 → 직전 캔들이 마지막 마감 세션
  // - 장 마감(주말·휴장·장 종료 후): 마지막 캔들이 곧 마지막 마감 세션
  const lastIdx = history.length - 1
  const marketOpen = isKrxOpen(new Date())
  const latestClosedIdx = marketOpen ? lastIdx - 1 : lastIdx

  const previousCloseDate = latestClosedIdx >= 0 ? history[latestClosedIdx].date : ""
  const previousClose =
    latestClosedIdx >= 1 ? history[latestClosedIdx - 1].close : 0
  const latestClose = latestClosedIdx >= 0 ? history[latestClosedIdx].close : price
  // 장중이면 실시간가, 마감 상태면 마지막 마감 종가 기준으로 변동 산출
  const reference = marketOpen ? price : latestClose
  const change = previousClose ? reference - previousClose : 0
  const changePercent = previousClose ? (change / previousClose) * 100 : 0

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

export type Exchange = "KRX" | "US"

export interface MarketIndex {
  name: string
  ticker: string
  exchange: Exchange
  price: number
  change: number
  changePercent: number
  isOpen: boolean
}

interface IndexConfig {
  yahooTicker: string
  name: string
  exchange: Exchange
}

const INDICES: IndexConfig[] = [
  { yahooTicker: "^KS11", name: "KOSPI", exchange: "KRX" },
  { yahooTicker: "^KQ11", name: "KOSDAQ", exchange: "KRX" },
  { yahooTicker: "^GSPC", name: "S&P 500", exchange: "US" },
  { yahooTicker: "^IXIC", name: "NASDAQ", exchange: "US" },
  { yahooTicker: "^DJI", name: "Dow Jones", exchange: "US" },
]

/**
 * 특정 시간대(IANA timeZone) 기준의 벽시계 정보를 반환한다.
 * Intl을 사용하므로 미국 동부의 서머타임(DST) 전환이 자동 반영된다.
 */
function zonedNow(date: Date, timeZone: string): { ymd: string; minutes: number; dow: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    hour12: false,
  }).formatToParts(date)

  const map: Record<string, string> = {}
  for (const p of parts) map[p.type] = p.value

  let hour = parseInt(map.hour, 10)
  if (hour === 24) hour = 0 // 자정이 "24"로 표기되는 환경 보정
  const minute = parseInt(map.minute, 10)
  const weekdayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  }

  return {
    ymd: `${map.year}-${map.month}-${map.day}`,
    minutes: hour * 60 + minute,
    dow: weekdayMap[map.weekday] ?? 0,
  }
}

// NYSE/Nasdaq 정규 휴장일 (전체 휴장). 매년 갱신 필요.
const US_HOLIDAYS: ReadonlySet<string> = new Set([
  "2026-01-01", // New Year's Day
  "2026-01-19", // Martin Luther King Jr. Day
  "2026-02-16", // Washington's Birthday
  "2026-04-03", // Good Friday
  "2026-05-25", // Memorial Day
  "2026-06-19", // Juneteenth
  "2026-07-03", // Independence Day (7/4 토요일 → 7/3 대체휴장)
  "2026-09-07", // Labor Day
  "2026-11-26", // Thanksgiving
  "2026-12-25", // Christmas
])

// 조기 폐장일 (13:00 ET 마감). 매년 갱신 필요.
const US_EARLY_CLOSE: ReadonlySet<string> = new Set([
  "2026-11-27", // 추수감사절 다음 날
  "2026-12-24", // 크리스마스 이브
])

function isKrxOpen(now: Date): boolean {
  const { minutes, dow } = zonedNow(now, "Asia/Seoul")
  if (dow === 0 || dow === 6) return false // 주말
  // KRX 정규장: 09:00 ~ 15:30 KST (KST는 DST 없음)
  return minutes >= 9 * 60 && minutes < 15 * 60 + 30
}

function isUsOpen(now: Date): boolean {
  const { ymd, minutes, dow } = zonedNow(now, "America/New_York")
  if (dow === 0 || dow === 6) return false // 주말
  if (US_HOLIDAYS.has(ymd)) return false // 휴장일
  // 정규장: 09:30 ~ 16:00 ET (조기 폐장일은 13:00), DST는 Intl이 자동 반영
  const open = 9 * 60 + 30
  const close = US_EARLY_CLOSE.has(ymd) ? 13 * 60 : 16 * 60
  return minutes >= open && minutes < close
}

function marketIsOpen(exchange: Exchange, now: Date): boolean {
  return exchange === "US" ? isUsOpen(now) : isKrxOpen(now)
}

async function fetchIndex(config: IndexConfig): Promise<MarketIndex> {
  const { yahooTicker, name, exchange } = config
  const url = `${YF_BASE}/v8/finance/chart/${encodeURIComponent(yahooTicker)}?interval=1d&range=1d`
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    next: { revalidate: 30 },
    signal: AbortSignal.timeout(3000),
  })
  if (!res.ok) throw new Error(`${name} fetch failed`)

  const data = await res.json()
  const meta = data.chart.result[0].meta
  const price: number = meta.regularMarketPrice
  const prev: number = meta.chartPreviousClose ?? price
  const change = prev ? price - prev : 0
  const changePercent = prev ? (change / prev) * 100 : 0

  return {
    name,
    ticker: yahooTicker,
    exchange,
    price,
    change,
    changePercent,
    isOpen: marketIsOpen(exchange, new Date()),
  }
}

export async function fetchMarketIndices(): Promise<MarketIndex[]> {
  const results = await Promise.allSettled(INDICES.map(fetchIndex))
  return results
    .filter((r): r is PromiseFulfilledResult<MarketIndex> => r.status === "fulfilled")
    .map((r) => r.value)
}
