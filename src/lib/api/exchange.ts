const YF_BASE = "https://query1.finance.yahoo.com"

export interface ExchangeRate {
  ticker: string
  label: string
  unit: string
  multiplier: number
  rate: number
  change: number
  changePercent: number
  previousRate: number
}

interface CurrencyConfig {
  ticker: string
  label: string
  unit: string
  multiplier: number
}

export const CURRENCIES: CurrencyConfig[] = [
  { ticker: "KRW=X",     label: "미국",     unit: "USD",     multiplier: 1 },
  { ticker: "JPYKRW=X",  label: "일본",     unit: "JPY 100", multiplier: 100 },
  { ticker: "EURKRW=X",  label: "유럽연합", unit: "EUR",     multiplier: 1 },
  { ticker: "CNYKRW=X",  label: "중국",     unit: "CNY",     multiplier: 1 },
  { ticker: "GBPKRW=X",  label: "영국",     unit: "GBP",     multiplier: 1 },
  { ticker: "AUDKRW=X",  label: "호주",     unit: "AUD",     multiplier: 1 },
  { ticker: "CADKRW=X",  label: "캐나다",   unit: "CAD",     multiplier: 1 },
  { ticker: "NZDKRW=X",  label: "뉴질랜드", unit: "NZD",     multiplier: 1 },
  { ticker: "THBKRW=X",  label: "태국",     unit: "THB",     multiplier: 1 },
  { ticker: "VNDKRW=X",  label: "베트남",   unit: "VND 100", multiplier: 100 },
  { ticker: "HKDKRW=X",  label: "홍콩",     unit: "HKD",     multiplier: 1 },
  { ticker: "TWDKRW=X",  label: "대만",     unit: "TWD",     multiplier: 1 },
]

async function fetchRate(config: CurrencyConfig): Promise<ExchangeRate> {
  const url = `${YF_BASE}/v8/finance/chart/${config.ticker}?interval=1d&range=2d`
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(3000),
  })
  if (!res.ok) throw new Error(`${config.ticker} fetch failed`)

  const data = await res.json()
  const meta = data.chart.result[0].meta
  const m = config.multiplier

  const rate = meta.regularMarketPrice * m
  const previousRate = (meta.chartPreviousClose ?? meta.regularMarketPrice) * m
  const change = rate - previousRate
  const changePercent = previousRate ? (change / previousRate) * 100 : 0

  return {
    ticker: config.ticker,
    label: config.label,
    unit: config.unit,
    multiplier: m,
    rate,
    change,
    changePercent,
    previousRate,
  }
}

/**
 * 환율을 동시성 제한(concurrency) 하에 호출하고, 먼저 응답이 온 것부터 즉시 yield한다.
 * 12개를 한꺼번에 호출하지 않으므로 Yahoo rate-limit을 완화하고,
 * 호출자는 도착하는 대로 화면에 반영할 수 있다.
 */
export async function* streamRates(concurrency = 4): AsyncGenerator<ExchangeRate> {
  const pending = new Map<number, Promise<{ id: number; rate: ExchangeRate | null }>>()
  let nextIndex = 0

  const launch = (id: number) => {
    const p = fetchRate(CURRENCIES[id])
      .then((rate) => ({ id, rate }))
      .catch(() => ({ id, rate: null })) // 개별 실패는 건너뛴다
    pending.set(id, p)
  }

  // 초기 워커 채우기
  while (nextIndex < CURRENCIES.length && pending.size < concurrency) {
    launch(nextIndex++)
  }

  while (pending.size > 0) {
    const { id, rate } = await Promise.race(pending.values())
    pending.delete(id)
    if (nextIndex < CURRENCIES.length) launch(nextIndex++)
    if (rate) yield rate
  }
}
