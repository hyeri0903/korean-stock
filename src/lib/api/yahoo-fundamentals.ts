// Yahoo Finance quoteSummary 기반 재무 지표 조회.
// chart 엔드포인트와 달리 crumb+cookie 인증이 필요하므로 자격증명을 캐시한다.

const UA = "Mozilla/5.0"
const CRUMB_TTL = 1000 * 60 * 30 // 30분

export interface StockFundamentals {
  ticker: string
  revenue: number | null          // 매출 (억원)
  eps: number | null              // EPS (원/주)
  freeCashFlow: number | null     // FCF (억원)
  roe: number | null              // ROE (%)
  per: number | null              // PER (배)
  pbr: number | null              // PBR (배)
  debtRatio: number | null        // 부채비율 (Yahoo D/E, %)
  operatingMargin: number | null  // 영업이익률 (%)
  revenueGrowth: number | null    // 매출 성장률 (%)
  sharesOutstanding: number | null // 발행주식수 (주)
  currentPrice: number | null     // 현재가 (원)
  source: string
  asOf: string
}

let cachedCreds: { cookie: string; crumb: string; ts: number } | null = null

async function getCredentials(force = false): Promise<{ cookie: string; crumb: string }> {
  if (!force && cachedCreds && Date.now() - cachedCreds.ts < CRUMB_TTL) {
    return cachedCreds
  }

  // 1) 쿠키 획득 (fc.yahoo.com 이 유효한 A1/A3 쿠키를 내려준다)
  const cookieRes = await fetch("https://fc.yahoo.com/", {
    headers: { "User-Agent": UA },
    signal: AbortSignal.timeout(5000),
  })
  const setCookies =
    typeof cookieRes.headers.getSetCookie === "function"
      ? cookieRes.headers.getSetCookie()
      : [cookieRes.headers.get("set-cookie") ?? ""]
  const cookie = setCookies
    .map((c) => c.split(";")[0].trim())
    .filter(Boolean)
    .join("; ")

  // 2) crumb 획득
  const crumbRes = await fetch("https://query1.finance.yahoo.com/v1/test/getcrumb", {
    headers: { "User-Agent": UA, cookie },
    signal: AbortSignal.timeout(5000),
  })
  const crumb = (await crumbRes.text()).trim()
  if (!crumb || crumb.startsWith("{")) throw new Error("Yahoo crumb 획득 실패")

  cachedCreds = { cookie, crumb, ts: Date.now() }
  return cachedCreds
}

interface RawField {
  raw?: number
}
type Module = Record<string, RawField | number | undefined>

async function requestSummary(
  ticker: string,
  creds: { cookie: string; crumb: string }
): Promise<{ status: number; result: Record<string, Module> | null }> {
  const yt = `${ticker}.KS`
  const modules = "financialData,defaultKeyStatistics,summaryDetail,price"
  const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${yt}?modules=${modules}&crumb=${encodeURIComponent(creds.crumb)}`
  const res = await fetch(url, {
    headers: { "User-Agent": UA, cookie: creds.cookie },
    signal: AbortSignal.timeout(6000),
  })
  const json = await res.json().catch(() => null)
  return { status: res.status, result: json?.quoteSummary?.result?.[0] ?? null }
}

export async function fetchFundamentals(ticker: string): Promise<StockFundamentals> {
  let creds = await getCredentials()
  let { status, result } = await requestSummary(ticker, creds)

  // crumb/cookie 만료 시 1회 갱신 재시도
  if (status === 401) {
    creds = await getCredentials(true)
    ;({ status, result } = await requestSummary(ticker, creds))
  }
  if (status !== 200 || !result) throw new Error(`펀더멘털 조회 실패 (${ticker})`)

  return mapResult(ticker, result)
}

function num(mod: Module | undefined, key: string): number | null {
  const v = mod?.[key]
  if (v == null) return null
  if (typeof v === "number") return Number.isFinite(v) ? v : null
  return typeof v.raw === "number" && Number.isFinite(v.raw) ? v.raw : null
}

function mapResult(ticker: string, r: Record<string, Module>): StockFundamentals {
  const fin = r.financialData
  const stat = r.defaultKeyStatistics
  const detail = r.summaryDetail
  const price = r.price

  const currentPrice = num(price, "regularMarketPrice") ?? num(fin, "currentPrice")
  const shares = num(stat, "sharesOutstanding")
  const netIncome = num(stat, "netIncomeToCommon")
  const roeFrac = num(fin, "returnOnEquity")

  // EPS / PER / PBR 은 KR 종목에서 종종 null → 다른 필드로 도출
  let eps = num(stat, "trailingEps")
  if (eps == null && netIncome != null && shares) eps = netIncome / shares

  let per = num(detail, "trailingPE")
  if (per == null && eps && currentPrice) per = currentPrice / eps

  let pbr = num(stat, "priceToBook")
  if (pbr == null && roeFrac && netIncome != null && shares && currentPrice) {
    const equity = netIncome / roeFrac
    const bvps = equity / shares
    if (bvps > 0) pbr = currentPrice / bvps
  }

  const revenue = num(fin, "totalRevenue")
  const fcf = num(fin, "freeCashflow")
  const opMargin = num(fin, "operatingMargins")
  const revGrowth = num(fin, "revenueGrowth")

  return {
    ticker,
    revenue: revenue != null ? revenue / 1e8 : null, // 억원
    eps,
    freeCashFlow: fcf != null ? fcf / 1e8 : null, // 억원
    roe: roeFrac != null ? roeFrac * 100 : null,
    per,
    pbr,
    debtRatio: num(fin, "debtToEquity"),
    operatingMargin: opMargin != null ? opMargin * 100 : null,
    revenueGrowth: revGrowth != null ? revGrowth * 100 : null,
    sharesOutstanding: shares,
    currentPrice,
    source: "Yahoo Finance",
    asOf: new Date().toISOString(),
  }
}
