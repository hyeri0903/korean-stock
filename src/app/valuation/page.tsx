import ValuationClient from "@/components/valuation/ValuationClient"

export default function ValuationPage() {
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold mb-0.5">예상 주식 적정가</h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          재무 지표로 계산하는 교육용 적정가 — 투자 권유가 아닙니다
        </p>
      </div>
      <ValuationClient />
    </div>
  )
}
