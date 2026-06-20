import { Term } from "@/types/term"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  기초:    { bg: "#dcfce7", text: "#166534" },
  가치평가: { bg: "#f3e8ff", text: "#6b21a8" },
  재무:    { bg: "#dbeafe", text: "#1e40af" },
  배당:    { bg: "#ffedd5", text: "#9a3412" },
  차트:    { bg: "#fce7f3", text: "#9d174d" },
}

interface Props {
  term: Term
  onClick: (term: Term) => void
}

export default function TermCard({ term, onClick }: Props) {
  const colors = CATEGORY_COLORS[term.category] ?? { bg: "#f1f5f9", text: "#475569" }

  return (
    <button
      onClick={() => onClick(term)}
      className="w-full text-left rounded-xl p-4 transition-all duration-150 group cursor-pointer"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = "var(--primary)"
        el.style.transform = "translateY(-1px)"
        el.style.boxShadow = "0 4px 12px rgba(37,99,235,0.1)"
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = "var(--border)"
        el.style.transform = "translateY(0)"
        el.style.boxShadow = "none"
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-base font-bold">{term.name}</span>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ backgroundColor: colors.bg, color: colors.text }}
            >
              {term.category}
            </span>
          </div>
          <p className="text-xs mb-1.5" style={{ color: "var(--muted)" }}>
            {term.fullName}
          </p>
          <p className="text-sm leading-relaxed line-clamp-2" style={{ color: "var(--muted)" }}>
            {term.summary}
          </p>
        </div>
        <ChevronRight
          className="w-4 h-4 shrink-0 mt-1 transition-colors"
          style={{ color: "var(--muted)" }}
        />
      </div>
    </button>
  )
}
