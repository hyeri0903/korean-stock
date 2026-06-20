export type TermCategory = "기초" | "가치평가" | "재무" | "배당" | "차트"

export interface Term {
  slug: string
  name: string
  fullName: string
  category: TermCategory
  summary: string
  description: string
  example: string
  formula?: string
  formulaExplain?: string
  related: string[]
  tip?: string
}

export const TERM_CATEGORIES: TermCategory[] = [
  "기초",
  "가치평가",
  "재무",
  "배당",
  "차트",
]
