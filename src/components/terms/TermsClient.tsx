"use client"

import { useState, useMemo } from "react"
import { Term, TERM_CATEGORIES, TermCategory } from "@/types/term"
import { getTermBySlug } from "@/lib/data/terms"
import TermCard from "./TermCard"
import TermModal from "./TermModal"
import { Search, X } from "lucide-react"

const CATEGORY_COLORS: Record<string, { active: string; bg: string }> = {
  전체:    { active: "#2563eb", bg: "#dbeafe" },
  기초:    { active: "#16a34a", bg: "#dcfce7" },
  가치평가: { active: "#9333ea", bg: "#f3e8ff" },
  재무:    { active: "#2563eb", bg: "#dbeafe" },
  배당:    { active: "#ea580c", bg: "#ffedd5" },
  차트:    { active: "#db2777", bg: "#fce7f3" },
}

export default function TermsClient({ terms }: { terms: Term[] }) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<TermCategory | "전체">("전체")
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null)

  const filtered = useMemo(() => {
    return terms.filter((t) => {
      const matchCat = category === "전체" || t.category === category
      const q = search.trim().toLowerCase()
      const matchSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.fullName.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q)
      return matchCat && matchSearch
    })
  }, [terms, search, category])

  const relatedTerms = useMemo(() => {
    if (!selectedTerm) return []
    return selectedTerm.related
      .map((s) => getTermBySlug(s))
      .filter((t): t is Term => Boolean(t))
  }, [selectedTerm])

  return (
    <>
      {/* 검색 */}
      <div className="relative mb-4">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: "var(--muted)" }}
        />
        <input
          type="text"
          placeholder="용어 검색 (예: PER, 배당, 이동평균)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-3 rounded-xl text-sm transition-all outline-none"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
          }}
          onFocus={(e) =>
            ((e.currentTarget as HTMLElement).style.borderColor = "var(--primary)")
          }
          onBlur={(e) =>
            ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")
          }
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer"
            style={{ color: "var(--muted)" }}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 카테고리 필터 */}
      <div className="flex gap-2 flex-wrap mb-6">
        {(["전체", ...TERM_CATEGORIES] as const).map((cat) => {
          const active = category === cat
          const c = CATEGORY_COLORS[cat]
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-150 cursor-pointer"
              style={{
                backgroundColor: active ? c.bg : "var(--surface)",
                color: active ? c.active : "var(--muted)",
                border: `1px solid ${active ? c.active + "55" : "var(--border)"}`,
                fontWeight: active ? 600 : 400,
              }}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* 결과 */}
      {filtered.length === 0 ? (
        <div className="text-center py-20" style={{ color: "var(--muted)" }}>
          <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">검색 결과가 없습니다</p>
        </div>
      ) : (
        <>
          <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
            {filtered.length}개의 용어
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((term) => (
              <TermCard key={term.slug} term={term} onClick={setSelectedTerm} />
            ))}
          </div>
        </>
      )}

      {/* 모달 */}
      <TermModal
        term={selectedTerm}
        onClose={() => setSelectedTerm(null)}
        relatedTerms={relatedTerms}
        onRelatedClick={setSelectedTerm}
      />
    </>
  )
}
