"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"

export default function ExchangeLastUpdated() {
  const queryClient = useQueryClient()
  const [time, setTime] = useState<string>("")

  useEffect(() => {
    const update = () => {
      const state = queryClient.getQueryState(["exchange"])
      if (state?.dataUpdatedAt) {
        setTime(new Date(state.dataUpdatedAt).toLocaleTimeString("ko-KR"))
      }
    }
    update()
    // query 갱신될 때마다 반영
    const unsub = queryClient.getQueryCache().subscribe(update)
    return () => unsub()
  }, [queryClient])

  if (!time) return null

  return (
    <span className="text-xs" style={{ color: "var(--muted)" }}>
      마지막 업데이트 {time}
    </span>
  )
}
