import { TERMS } from "@/lib/data/terms"
import TermsClient from "@/components/terms/TermsClient"

export default function TermsPage() {
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold mb-0.5">주식 용어 사전</h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          주식 투자에 필요한 핵심 용어 {TERMS.length}개 · 클릭하면 설명이 나타납니다
        </p>
      </div>
      <TermsClient terms={TERMS} />
    </div>
  )
}
