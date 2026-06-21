"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const TABS = [
  { href: "/dashboard", label: "대시보드" },
  { href: "/terms", label: "주식 용어" },
  { href: "/exchange", label: "환율" },
  { href: "/valuation", label: "예상 적정가" },
]

export default function TabNav() {
  const pathname = usePathname()

  return (
    <nav
      className="sticky top-14 z-40 border-b transition-colors duration-200"
      style={{
        backgroundColor: "var(--background)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex gap-0">
          {TABS.map((tab) => {
            const active = pathname.startsWith(tab.href)
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "relative px-5 py-3.5 text-sm font-medium transition-colors duration-150 cursor-pointer select-none",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                )}
                style={{
                  color: active ? "var(--primary)" : "var(--muted)",
                }}
              >
                {tab.label}
                {active && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
                    style={{ backgroundColor: "var(--primary)" }}
                  />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
