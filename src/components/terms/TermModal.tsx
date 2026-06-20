"use client"

import { useEffect } from "react"
import { Term } from "@/types/term"
import { X, Calculator, BookOpen, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  기초:    { bg: "#dcfce7", text: "#166534" },
  가치평가: { bg: "#f3e8ff", text: "#6b21a8" },
  재무:    { bg: "#dbeafe", text: "#1e40af" },
  배당:    { bg: "#ffedd5", text: "#9a3412" },
  차트:    { bg: "#fce7f3", text: "#9d174d" },
}

const DARK_CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  기초:    { bg: "#14532d44", text: "#4ade80" },
  가치평가: { bg: "#581c8744", text: "#c084fc" },
  재무:    { bg: "#1e3a5f44", text: "#60a5fa" },
  배당:    { bg: "#7c2d1244", text: "#fb923c" },
  차트:    { bg: "#831843", text: "#f9a8d4" },
}

interface Props {
  term: Term | null
  onClose: () => void
  relatedTerms: Term[]
  onRelatedClick: (term: Term) => void
}

export default function TermModal({ term, onClose, relatedTerms, onRelatedClick }: Props) {
  useEffect(() => {
    if (!term) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKey)
      document.body.style.overflow = ""
    }
  }, [term, onClose])

  if (!term) return null

  const colors = CATEGORY_COLORS[term.category] ?? { bg: "#f1f5f9", text: "#475569" }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${term.name} 용어 설명`}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="pointer-events-auto w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          style={{
            backgroundColor: "var(--background)",
            border: "1px solid var(--border)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="sticky top-0 flex items-start justify-between gap-3 p-5 pb-4"
            style={{
              backgroundColor: "var(--background)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-bold">{term.name}</h2>
                <span
                  className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                  style={{ backgroundColor: colors.bg, color: colors.text }}
                >
                  {term.category}
                </span>
              </div>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                {term.fullName}
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="닫기"
              className="rounded-full p-1.5 transition-colors cursor-pointer"
              style={{ color: "var(--muted)" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--surface-hover)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
              }
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4">
            {/* Summary */}
            <p className="text-base font-medium leading-relaxed">{term.summary}</p>

            {/* Description */}
            <section
              className="rounded-xl p-4"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div
                className="flex items-center gap-2 mb-2 text-sm font-semibold"
                style={{ color: "var(--primary)" }}
              >
                <BookOpen className="w-4 h-4" />
                개념 설명
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                {term.description}
              </p>
            </section>

            {/* Formula */}
            {term.formula && (
              <section
                className="rounded-xl p-4"
                style={{ backgroundColor: "#1e3a5f22", border: "1px solid #2563eb33" }}
              >
                <div
                  className="flex items-center gap-2 mb-2 text-sm font-semibold"
                  style={{ color: "#3b82f6" }}
                >
                  <Calculator className="w-4 h-4" />
                  계산 공식
                </div>
                <code
                  className="block text-sm font-mono font-semibold mb-1"
                  style={{ color: "#2563eb" }}
                >
                  {term.formula}
                </code>
                {term.formulaExplain && (
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    예시: {term.formulaExplain}
                  </p>
                )}
              </section>
            )}

            {/* Example */}
            <section
              className="rounded-xl p-4"
              style={{ backgroundColor: "#fef9c322", border: "1px solid #fde04733" }}
            >
              <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-amber-600 dark:text-amber-400">
                <span>💡</span>
                이렇게 생각하세요
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                {term.example}
              </p>
            </section>

            {/* Tip */}
            {term.tip && (
              <section
                className="rounded-xl p-4"
                style={{ backgroundColor: "#dcfce722", border: "1px solid #22c55e33" }}
              >
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <p className="text-sm leading-relaxed text-green-700 dark:text-green-400">
                    {term.tip}
                  </p>
                </div>
              </section>
            )}

            {/* Related terms */}
            {relatedTerms.length > 0 && (
              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: "var(--muted)" }}>
                  함께 알아두면 좋은 용어
                </p>
                <div className="flex flex-wrap gap-2">
                  {relatedTerms.map((related) => (
                    <button
                      key={related.slug}
                      onClick={() => onRelatedClick(related)}
                      className="px-3 py-1.5 rounded-full text-sm transition-colors cursor-pointer"
                      style={{
                        backgroundColor: "var(--surface)",
                        border: "1px solid var(--border)",
                        color: "var(--foreground)",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement
                        el.style.borderColor = "var(--primary)"
                        el.style.color = "var(--primary)"
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement
                        el.style.borderColor = "var(--border)"
                        el.style.color = "var(--foreground)"
                      }}
                    >
                      {related.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
