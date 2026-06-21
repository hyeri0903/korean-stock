import Link from "next/link"

const LEGAL_LINKS = [
  { href: "/legal/privacy", label: "개인정보 처리방침" },
  { href: "/legal/disclaimer", label: "면책조항" },
  { href: "/legal/terms", label: "이용약관" },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="mt-auto border-t transition-colors duration-200"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
    >
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
        {/* 면책 요약 */}
        <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
          본 서비스는 투자 학습·참고용 정보를 제공하며, 투자 자문이나 매매 권유가
          아닙니다. 시세는 지연될 수 있고 정확성을 보장하지 않으며, 투자 판단과 그
          결과에 대한 책임은 이용자 본인에게 있습니다.
        </p>

        {/* 링크 */}
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-medium transition-colors duration-150 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
              style={{ color: "var(--muted)" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* 저작권 · 출처 */}
        <div
          className="flex flex-col gap-1 pt-2 text-[11px]"
          style={{ color: "var(--muted)" }}
        >
          <span>© {year} 주식공부. All rights reserved.</span>
          <span>시세 데이터 제공: Yahoo Finance (지연 시세)</span>
        </div>
      </div>
    </footer>
  )
}
