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

const CURRENCIES = [
  { ticker: "KRW=X",     label: "미국",    unit: "USD",     multiplier: 1 },
  { ticker: "JPYKRW=X",  label: "일본",    unit: "JPY 100", multiplier: 100 },
  { ticker: "EURKRW=X",  label: "유럽연합", unit: "EUR",     multiplier: 1 },
  { ticker: "CNYKRW=X",  label: "중국",    unit: "CNY",     multiplier: 1 },
  { ticker: "GBPKRW=X",  label: "영국",    unit: "GBP",     multiplier: 1 },
  { ticker: "AUDKRW=X",  label: "호주",    unit: "AUD",     multiplier: 1 },
  { ticker: "CADKRW=X",  label: "캐나다",  unit: "CAD",     multiplier: 1 },
  { ticker: "NZDKRW=X",  label: "뉴질랜드", unit: "NZD",    multiplier: 1 },
  { ticker: "THBKRW=X",  label: "태국",    unit: "THB",     multiplier: 1 },
  { ticker: "VNDKRW=X",  label: "베트남",  unit: "VND 100", multiplier: 100 },
  { ticker: "HKDKRW=X",  label: "홍콩",    unit: "HKD",     multiplier: 1 },
  { ticker: "TWDKRW=X",  label: "대만",    unit: "TWD",     multiplier: 1 },
]

async function fetchRate(config: typeof CURRENCIES[0]): Promise<ExchangeRate> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${config.ticker}?interval=1d&range=2d`
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    next: { revalidate: 3600 },
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

export async function GET() {
  const results = await Promise.allSettled(CURRENCIES.map(fetchRate))
  const data = results
    .filter((r): r is PromiseFulfilledResult<ExchangeRate> => r.status === "fulfilled")
    .map((r) => r.value)
  return Response.json(data)
}
