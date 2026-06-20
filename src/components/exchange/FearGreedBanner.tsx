import { ExternalLink } from "lucide-react"

export default function FearGreedBanner() {
  return (
    <a
      href="https://edition.cnn.com/markets/fear-and-greed"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between px-5 py-4 rounded-2xl mb-6 transition-all duration-150 group"
      style={{
        background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e3a5f 100%)",
        border: "1px solid #4338ca55",
      }}
    >
      <div className="flex items-center gap-4">
        {/* Gauge icon */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: "#ffffff15" }}
        >
          <span className="text-2xl">😨</span>
        </div>
        <div>
          <p className="text-white font-bold text-base leading-tight">
            CNN Fear &amp; Greed Index
          </p>
          <p className="text-sm mt-0.5" style={{ color: "#a5b4fc" }}>
            시장 심리 지표 — 공포(0) ↔ 탐욕(100)
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5" style={{ color: "#a5b4fc" }}>
        <span className="text-sm hidden sm:inline group-hover:underline">
          바로가기
        </span>
        <ExternalLink className="w-4 h-4" />
      </div>
    </a>
  )
}
