import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(n: number | null | undefined, decimals = 0): string {
  if (n == null || !Number.isFinite(n)) return "-"
  return n.toLocaleString("ko-KR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function formatPercent(n: number | null | undefined, decimals = 2): string {
  if (n == null || !Number.isFinite(n)) return "-"
  const sign = n > 0 ? "+" : ""
  return `${sign}${n.toFixed(decimals)}%`
}
