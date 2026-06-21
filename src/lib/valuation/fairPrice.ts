// 적정 주가 계산 (교육용). 순수 함수 — 부수효과 없음.
// 가격 단위: 원, 매출/FCF: 억원, 발행주식수: 주.

export const ASSUMPTIONS = {
  requiredReturn: 0.09, // r: 요구수익률 9%
  terminalGrowth: 0.025, // 터미널 성장률 2.5%
  dcfYears: 5,
  growthCap: 0.2, // 성장 가정 상한 20%
  targetPER: { min: 5, max: 30 },
  justifiedPBR: { min: 0.3, max: 10 },
}

export interface ValuationInput {
  revenue: number | null // 매출 (억원)
  eps: number | null // 원/주
  freeCashFlow: number | null // 억원
  roe: number | null // %
  per: number | null // 배
  pbr: number | null // 배
  debtRatio: number | null // %
  operatingMargin: number | null // %
  revenueGrowth: number | null // %
  sharesOutstanding: number | null // 주
  currentPrice: number | null // 원
}

export type MethodKey = "per" | "pbr" | "graham" | "dcf"

export interface MethodResult {
  key: MethodKey
  label: string
  price: number | null
  weight: number // 재정규화된 가중치 (0~1)
  skipReason?: string
}

export type Verdict = "undervalued" | "fair" | "overvalued" | "unknown"

export interface ValuationResult {
  methods: MethodResult[]
  blended: number | null // 품질 보정 전 가중 평균
  qualityMultiplier: number
  fairPrice: number | null // 최종 적정가
  upsidePercent: number | null
  verdict: Verdict
  bvps: number | null
}

const BASE_WEIGHTS: Record<MethodKey, number> = {
  per: 0.3,
  pbr: 0.25,
  dcf: 0.3,
  graham: 0.15,
}

const LABELS: Record<MethodKey, string> = {
  per: "PER 방식",
  pbr: "PBR 방식",
  graham: "그레이엄",
  dcf: "DCF",
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v))
}

/** 부채비율·영업이익률 → 품질 배수 (0.85 ~ 1.10) */
function qualityMultiplier(debtRatio: number | null, operatingMargin: number | null): number {
  // 부채비율 낮을수록 좋음
  const debtScore =
    debtRatio == null
      ? 0.95
      : debtRatio <= 50
        ? 1.0
        : debtRatio <= 100
          ? 1.0 - ((debtRatio - 50) / 50) * 0.05
          : debtRatio <= 200
            ? 0.95 - ((debtRatio - 100) / 100) * 0.1
            : debtRatio <= 300
              ? 0.85 - ((debtRatio - 200) / 100) * 0.1
              : 0.75
  // 영업이익률 높을수록 좋음
  const marginScore =
    operatingMargin == null
      ? 0.95
      : operatingMargin >= 20
        ? 1.0
        : operatingMargin >= 10
          ? 0.95 + ((operatingMargin - 10) / 10) * 0.05
          : operatingMargin >= 0
            ? 0.85 + (operatingMargin / 10) * 0.1
            : 0.8
  return clamp(0.5 * debtScore + 0.5 * marginScore, 0.85, 1.1)
}

export function calculateFairPrice(input: ValuationInput): ValuationResult {
  const { eps, roe, revenueGrowth, freeCashFlow, sharesOutstanding, currentPrice } = input
  const r = ASSUMPTIONS.requiredReturn

  // 파생값
  const bvps = eps != null && roe != null && roe > 0 ? eps / (roe / 100) : null
  const g = clamp((revenueGrowth ?? 0) / 100, 0, ASSUMPTIONS.growthCap)

  const methods: MethodResult[] = []

  // 1) PER 방식 (PEG=1 기준 목표 PER)
  if (eps != null && eps > 0) {
    const targetPER = clamp(revenueGrowth ?? 0, ASSUMPTIONS.targetPER.min, ASSUMPTIONS.targetPER.max)
    methods.push({ key: "per", label: LABELS.per, price: eps * targetPER, weight: 0 })
  } else {
    methods.push({ key: "per", label: LABELS.per, price: null, weight: 0, skipReason: "EPS가 0 이하" })
  }

  // 2) PBR 방식 (ROE 기반 정당화 PBR)
  if (bvps != null && roe != null && roe > 0 && r > g) {
    const justified = clamp((roe / 100 - g) / (r - g), ASSUMPTIONS.justifiedPBR.min, ASSUMPTIONS.justifiedPBR.max)
    methods.push({ key: "pbr", label: LABELS.pbr, price: bvps * justified, weight: 0 })
  } else {
    methods.push({ key: "pbr", label: LABELS.pbr, price: null, weight: 0, skipReason: "ROE 0 이하 또는 BVPS 계산 불가" })
  }

  // 3) 그레이엄 수
  if (eps != null && eps > 0 && bvps != null && bvps > 0) {
    methods.push({ key: "graham", label: LABELS.graham, price: Math.sqrt(22.5 * eps * bvps), weight: 0 })
  } else {
    methods.push({ key: "graham", label: LABELS.graham, price: null, weight: 0, skipReason: "EPS·BVPS 필요" })
  }

  // 4) DCF (2단계, FCF 기준)
  if (freeCashFlow != null && freeCashFlow > 0 && sharesOutstanding && sharesOutstanding > 0) {
    const fcfPerShare = (freeCashFlow * 1e8) / sharesOutstanding
    const gt = ASSUMPTIONS.terminalGrowth
    let pv = 0
    let last = fcfPerShare
    for (let t = 1; t <= ASSUMPTIONS.dcfYears; t++) {
      last = last * (1 + g)
      pv += last / Math.pow(1 + r, t)
    }
    const terminal = (last * (1 + gt)) / (r - gt)
    pv += terminal / Math.pow(1 + r, ASSUMPTIONS.dcfYears)
    methods.push({ key: "dcf", label: LABELS.dcf, price: pv, weight: 0 })
  } else {
    methods.push({ key: "dcf", label: LABELS.dcf, price: null, weight: 0, skipReason: "FCF·발행주식수 필요" })
  }

  // 가중치 재정규화 (유효한 방법만)
  const valid = methods.filter((m) => m.price != null && m.price > 0)
  const totalWeight = valid.reduce((s, m) => s + BASE_WEIGHTS[m.key], 0)
  let blended: number | null = null
  if (valid.length > 0 && totalWeight > 0) {
    blended = 0
    for (const m of valid) {
      m.weight = BASE_WEIGHTS[m.key] / totalWeight
      blended += m.weight * (m.price as number)
    }
  }

  const qm = qualityMultiplier(input.debtRatio, input.operatingMargin)
  const fairPrice = blended != null ? blended * qm : null

  const upsidePercent =
    fairPrice != null && currentPrice != null && currentPrice > 0
      ? ((fairPrice - currentPrice) / currentPrice) * 100
      : null

  let verdict: Verdict = "unknown"
  if (upsidePercent != null) {
    verdict = upsidePercent > 15 ? "undervalued" : upsidePercent < -15 ? "overvalued" : "fair"
  }

  return { methods, blended, qualityMultiplier: qm, fairPrice, upsidePercent, verdict, bvps }
}
