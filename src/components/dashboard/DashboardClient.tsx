"use client"

import { useQuery } from "@tanstack/react-query"
import { StockQuote } from "@/types/stock"
import StockCard from "./StockCard"
import { RefreshCw, AlertCircle } from "lucide-react"

async function fetchStocks(): Promise<StockQuote[]> {
  const res = await fetch("/api/stocks")
  if (!res.ok) throw new Error("주가 데이터를 불러오지 못했습니다")
  return res.json()
}

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl p-5 space-y-3"
      style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full animate-pulse" style={{ backgroundColor: "var(--border)" }} />
        <div className="space-y-1.5 flex-1">
          <div className="h-4 rounded animate-pulse w-24" style={{ backgroundColor: "var(--border)" }} />
          <div className="h-3 rounded animate-pulse w-16" style={{ backgroundColor: "var(--border)" }} />
        </div>
      </div>
      <div className="h-7 rounded animate-pulse w-3/4" style={{ backgroundColor: "var(--border)" }} />
      <div className="h-4 rounded animate-pulse w-1/2" style={{ backgroundColor: "var(--border)" }} />
      <div className="h-12 rounded animate-pulse" style={{ backgroundColor: "var(--border)" }} />
      <div className="space-y-2 pt-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between">
            <div className="h-3 rounded animate-pulse w-16" style={{ backgroundColor: "var(--border)" }} />
            <div className="h-3 rounded animate-pulse w-28" style={{ backgroundColor: "var(--border)" }} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DashboardClient({ initial }: { initial: StockQuote[] }) {
  const { data, isLoading, error, dataUpdatedAt, isFetching } = useQuery({
    queryKey: ["stocks"],
    queryFn: fetchStocks,
    initialData: initial,
    refetchInterval: 30_000,
  })

  const updatedTime = new Date(dataUpdatedAt).toLocaleTimeString("ko-KR")

  return (
    <div>
      {/* Status bar */}
      <div
        className="flex items-center justify-between mb-5 py-2.5 px-4 rounded-xl text-sm"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2" style={{ color: "var(--muted)" }}>
          <RefreshCw
            className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
            style={{ color: "var(--primary)" }}
          />
          <span className="text-xs">30초마다 자동 갱신</span>
          <span className="hidden sm:inline text-xs">
            · 마지막 업데이트 {updatedTime}
          </span>
        </div>
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          Yahoo Finance 지연 시세
        </span>
      </div>

      {/* Error */}
      {error && (
        <div
          className="mb-4 p-3.5 rounded-xl flex items-center gap-2 text-sm"
          style={{ backgroundColor: "#fee2e211", border: "1px solid #ef444433", color: "#ef4444" }}
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 자동 재시도합니다.
        </div>
      )}

      {/* Cards */}
      {isLoading && !data?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.map((quote) => (
            <StockCard key={quote.ticker} quote={quote} />
          ))}
        </div>
      )}
    </div>
  )
}
