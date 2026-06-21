"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { SEMICONDUCTOR_STOCKS } from "@/lib/data/stocks"
import { calculateFairPrice, ASSUMPTIONS, type ValuationInput, type Verdict } from "@/lib/valuation/fairPrice"
import type { StockFundamentals } from "@/lib/api/yahoo-fundamentals"
import { formatNumber, formatPercent } from "@/lib/utils"
import ValuationForm, { FIELDS } from "./ValuationForm"
import MethodCard from "./MethodCard"

type Status = "idle" | "loading" | "success" | "error"

const VERDICT: Record<Verdict, { label: string; color: string }> = {
  undervalued: { label: "저평가", color: "var(--up)" },
  fair: { label: "적정", color: "var(--muted)" },
  overvalued: { label: "고평가", color: "var(--down)" },
  unknown: { label: "현재가 입력 필요", color: "var(--muted)" },
}

function parseNum(s: string | undefined): number | null {
  if (!s) return null
  const n = Number(s.replace(/,/g, "").trim())
  return Number.isFinite(n) ? n : null
}

function toStr(n: number | null | undefined, decimals = 2): string {
  if (n == null || !Number.isFinite(n)) return ""
  return Number(n.toFixed(decimals)).toString()
}

const FIELD_DECIMALS: Record<string, number> = {
  eps: 0, per: 2, pbr: 2, roe: 2, revenue: 0, freeCashFlow: 0,
  sharesOutstanding: 0, debtRatio: 2, operatingMargin: 2, revenueGrowth: 2,
}

export default function ValuationClient() {
  const [ticker, setTicker] = useState(SEMICONDUCTOR_STOCKS[0]?.ticker ?? "manual")
  const [values, setValues] = useState<Record<string, string>>({})
  const [currentPrice, setCurrentPrice] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [meta, setMeta] = useState<{ source: string; asOf: string } | null>(null)
  const [error, setError] = useState("")

  const handleChange = useCallback((key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }, [])

  useEffect(() => {
    if (ticker === "manual") {
      setStatus("idle")
      return
    }
    let cancelled = false
    setStatus("loading")
    setError("")
    fetch(`/api/fundamentals/${ticker}`)
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error ?? "조회 실패")
        return res.json() as Promise<StockFundamentals>
      })
      .then((f) => {
        if (cancelled) return
        setValues({
          eps: toStr(f.eps, 0),
          per: toStr(f.per),
          pbr: toStr(f.pbr),
          roe: toStr(f.roe),
          revenue: toStr(f.revenue, 0),
          freeCashFlow: toStr(f.freeCashFlow, 0),
          sharesOutstanding: toStr(f.sharesOutstanding, 0),
          debtRatio: toStr(f.debtRatio),
          operatingMargin: toStr(f.operatingMargin),
          revenueGrowth: toStr(f.revenueGrowth),
        })
        setCurrentPrice(toStr(f.currentPrice, 0))
        setMeta({ source: f.source, asOf: f.asOf })
        setStatus("success")
      })
      .catch((e) => {
        if (cancelled) return
        setError(e instanceof Error ? e.message : "조회 실패")
        setStatus("error")
      })
    return () => {
      cancelled = true
    }
  }, [ticker])

  const input: ValuationInput = useMemo(
    () => ({
      revenue: parseNum(values.revenue),
      eps: parseNum(values.eps),
      freeCashFlow: parseNum(values.freeCashFlow),
      roe: parseNum(values.roe),
      per: parseNum(values.per),
      pbr: parseNum(values.pbr),
      debtRatio: parseNum(values.debtRatio),
      operatingMargin: parseNum(values.operatingMargin),
      revenueGrowth: parseNum(values.revenueGrowth),
      sharesOutstanding: parseNum(values.sharesOutstanding),
      currentPrice: parseNum(currentPrice),
    }),
    [values, currentPrice]
  )

  const result = useMemo(() => calculateFairPrice(input), [input])
  const verdict = VERDICT[result.verdict]
  const upColor =
    result.upsidePercent == null ? "var(--muted)" : result.upsidePercent >= 0 ? "var(--up)" : "var(--down)"

  return (
    <div className="flex flex-col gap-6">
      {/* 종목 선택 + 현재가 */}
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs" style={{ color: "var(--muted)" }}>종목</span>
          <select
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm outline-none cursor-pointer"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }}
          >
            {SEMICONDUCTOR_STOCKS.map((s) => (
              <option key={s.ticker} value={s.ticker}>{s.name} ({s.ticker})</option>
            ))}
            <option value="manual">직접 입력</option>
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs" style={{ color: "var(--muted)" }}>현재가 (원)</span>
          <input
            type="text"
            inputMode="decimal"
            value={currentPrice}
            onChange={(e) => setCurrentPrice(e.target.value)}
            placeholder="-"
            className="px-3 py-2 rounded-xl text-sm tabular-nums outline-none"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          />
        </label>

        <div className="text-xs pb-2" style={{ color: "var(--muted)" }}>
          {status === "loading" && "재무 데이터 불러오는 중…"}
          {status === "success" && meta && `${meta.source} · ${new Date(meta.asOf).toLocaleString("ko-KR")} 자동 조회 (수정 가능)`}
          {status === "error" && (
            <span style={{ color: "var(--down)" }}>자동 조회 실패: {error} — 직접 입력하세요</span>
          )}
          {ticker === "manual" && "모든 값을 직접 입력하세요"}
        </div>
      </div>

      {/* 입력 폼 */}
      <ValuationForm values={values} onChange={handleChange} />

      {/* 종합 적정가 */}
      <div
        className="rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="flex flex-col gap-1">
          <span className="text-sm" style={{ color: "var(--muted)" }}>종합 적정가</span>
          <span className="text-3xl font-bold tabular-nums" style={{ letterSpacing: "-0.02em" }}>
            {result.fairPrice != null ? `${formatNumber(result.fairPrice)}원` : "계산 불가"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {result.upsidePercent != null && (
            <span className="text-lg font-semibold tabular-nums" style={{ color: upColor }}>
              {formatPercent(result.upsidePercent)}
            </span>
          )}
          <span
            className="text-sm font-bold px-3 py-1.5 rounded-full"
            style={{ backgroundColor: "var(--border)", color: verdict.color }}
          >
            {verdict.label}
          </span>
        </div>
      </div>

      {/* 방법별 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {result.methods.map((m) => (
          <MethodCard key={m.key} method={m} currentPrice={input.currentPrice} />
        ))}
      </div>

      {/* 품질 보정 + 가정 */}
      <div className="rounded-2xl p-4 text-xs flex flex-col gap-1" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)" }}>
        <span>품질 보정 배수: <b style={{ color: "var(--foreground)" }}>×{result.qualityMultiplier.toFixed(3)}</b> (부채비율·영업이익률 기반)</span>
        {result.bvps != null && <span>추정 BVPS(주당순자산): {formatNumber(result.bvps)}원 (EPS ÷ ROE)</span>}
        <span>가정: 요구수익률 {(ASSUMPTIONS.requiredReturn * 100).toFixed(0)}%, 터미널 성장률 {(ASSUMPTIONS.terminalGrowth * 100).toFixed(1)}%, DCF {ASSUMPTIONS.dcfYears}년. 목표 PER은 성장률(PEG=1), 목표 PBR은 ROE로 도출.</span>
        <span style={{ opacity: 0.8 }}>※ 교육용 추정치이며 투자 권유가 아닙니다. 부채비율은 Yahoo D/E 기준이라 한국식 부채비율과 다를 수 있습니다.</span>
      </div>
    </div>
  )
}
