"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart2, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/dashboard", label: "대시보드", icon: BarChart2 },
  { href: "/terms", label: "주식 용어", icon: BookOpen },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="flex">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-3 gap-1 text-xs font-medium transition-colors",
                active
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
