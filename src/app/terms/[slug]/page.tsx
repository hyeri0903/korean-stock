import { notFound } from "next/navigation"
import Link from "next/link"
import { TERMS, getTermBySlug } from "@/lib/data/terms"
import { ArrowLeft, Lightbulb, Calculator, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

const CATEGORY_COLORS: Record<string, string> = {
  기초: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  가치평가: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  재무: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  배당: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  차트: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
}

export async function generateStaticParams() {
  return TERMS.map((t) => ({ slug: t.slug }))
}

export default async function TermDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const term = getTermBySlug(slug)
  if (!term) notFound()

  const relatedTerms = term.related
    .map((s) => getTermBySlug(s))
    .filter(Boolean)

  return (
    <div className="max-w-2xl">
      <Link
        href="/terms"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        용어 목록으로
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-3 flex-wrap mb-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{term.name}</h1>
          <span
            className={cn(
              "text-sm px-3 py-0.5 rounded-full font-medium",
              CATEGORY_COLORS[term.category]
            )}
          >
            {term.category}
          </span>
        </div>
        <p className="text-gray-400 text-sm mb-3">{term.fullName}</p>
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
          {term.summary}
        </p>
      </div>

      <div className="space-y-4">
        {/* 설명 */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center gap-2 mb-3 text-blue-600 dark:text-blue-400">
            <BookOpen className="w-4 h-4" />
            <span className="font-semibold text-sm">개념 설명</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
            {term.description}
          </p>
        </div>

        {/* 계산식 */}
        {term.formula && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 p-5">
            <div className="flex items-center gap-2 mb-3 text-blue-700 dark:text-blue-400">
              <Calculator className="w-4 h-4" />
              <span className="font-semibold text-sm">계산 공식</span>
            </div>
            <code className="block text-blue-800 dark:text-blue-300 font-mono text-sm font-medium mb-2">
              {term.formula}
            </code>
            {term.formulaExplain && (
              <p className="text-blue-600 dark:text-blue-400 text-xs leading-relaxed">
                예시: {term.formulaExplain}
              </p>
            )}
          </div>
        )}

        {/* 실생활 예시 */}
        <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-800 p-5">
          <div className="flex items-center gap-2 mb-3 text-amber-700 dark:text-amber-400">
            <span className="text-base">💡</span>
            <span className="font-semibold text-sm">이렇게 생각하세요</span>
          </div>
          <p className="text-amber-800 dark:text-amber-300 text-sm leading-relaxed">
            {term.example}
          </p>
        </div>

        {/* 꿀팁 */}
        {term.tip && (
          <div className="bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-800 p-4">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
              <p className="text-green-800 dark:text-green-300 text-sm leading-relaxed">
                {term.tip}
              </p>
            </div>
          </div>
        )}

        {/* 관련 용어 */}
        {relatedTerms.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
              함께 알아두면 좋은 용어
            </h2>
            <div className="flex flex-wrap gap-2">
              {relatedTerms.map((related) => (
                related && (
                  <Link
                    key={related.slug}
                    href={`/terms/${related.slug}`}
                    className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full text-sm hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {related.name}
                  </Link>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
