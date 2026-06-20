"use client"

import { useTheme } from "next-themes"
import { Sun, Moon, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

function MarketStatus() {
  const [time, setTime] = useState("")

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      )
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  // KRX hours: 09:00~15:30 KST (UTC+9)
  const isOpen = () => {
    const now = new Date()
    const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
    const h = kst.getUTCHours()
    const m = kst.getUTCMinutes()
    const total = h * 60 + m
    const day = kst.getUTCDay()
    return day >= 1 && day <= 5 && total >= 540 && total < 930
  }

  const open = isOpen()

  return (
    <div className="hidden sm:flex items-center gap-2 text-xs">
      <span
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
        style={{
          borderColor: open ? "#22c55e33" : "#64748b33",
          backgroundColor: open ? "#22c55e11" : "transparent",
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: open ? "#22c55e" : "#94a3b8" }}
        />
        <span style={{ color: open ? "#22c55e" : "var(--muted)" }}>
          {open ? "장중" : "장마감"}
        </span>
      </span>
      <span style={{ color: "var(--muted)" }}>{time}</span>
    </div>
  )
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-16 h-8" />

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="다크모드 전환"
      className="relative flex items-center w-16 h-8 rounded-full p-0.5 transition-colors duration-300 cursor-pointer"
      style={{
        backgroundColor: isDark ? "#1e3a5f" : "#e2e8f0",
        border: "1px solid var(--border)",
      }}
    >
      <span
        className="absolute flex items-center justify-center w-7 h-7 rounded-full shadow-sm transition-transform duration-300"
        style={{
          transform: isDark ? "translateX(32px)" : "translateX(0)",
          backgroundColor: isDark ? "#2563eb" : "#ffffff",
        }}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-white" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-500" />
        )}
      </span>
      <Sun
        className="w-3.5 h-3.5 ml-1"
        style={{ color: isDark ? "#4b5563" : "#f59e0b", opacity: isDark ? 0.4 : 1 }}
      />
      <Moon
        className="w-3.5 h-3.5 ml-auto mr-1"
        style={{ color: isDark ? "#93c5fd" : "#9ca3af", opacity: isDark ? 1 : 0.4 }}
      />
    </button>
  )
}

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 w-full backdrop-blur-md border-b transition-colors duration-200"
      style={{
        backgroundColor: "color-mix(in srgb, var(--background) 85%, transparent)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Left — market status */}
        <MarketStatus />

        {/* Center — brand */}
        <div className="flex-1 flex flex-col items-center sm:flex-none sm:absolute sm:left-1/2 sm:-translate-x-1/2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" style={{ color: "var(--primary)" }} />
            <span className="text-lg font-bold tracking-tight">KOREA INVESTING</span>
          </div>
          <p className="hidden sm:block text-xs" style={{ color: "var(--muted)" }}>
            국내 반도체 주식 &amp; 용어 학습
          </p>
        </div>

        {/* Right — theme toggle */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
