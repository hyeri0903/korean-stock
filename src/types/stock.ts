export interface StockConfig {
  ticker: string
  name: string
  description: string
}

export interface StockQuote {
  ticker: string
  name: string
  price: number
  change: number
  changePercent: number
  open?: number
  high: number
  low: number
  volume: number
  marketCap?: number
  previousClose: number
  previousCloseDate: string
  history: { date: string; close: number }[]
  updatedAt: string
}

export type StockStatus = "up" | "down" | "flat"

export function getStockStatus(changePercent: number): StockStatus {
  if (changePercent > 0) return "up"
  if (changePercent < 0) return "down"
  return "flat"
}

export function formatPrice(price: number | undefined): string {
  if (!price) return "-"
  return price.toLocaleString("ko-KR") + "원"
}

export function formatChange(change: number | undefined, changePercent: number | undefined): string {
  if (change == null || changePercent == null) return "-"
  const sign = change >= 0 ? "+" : ""
  return `${sign}${change.toLocaleString("ko-KR")}원 (${sign}${changePercent.toFixed(2)}%)`
}

export function formatVolume(volume: number | undefined): string {
  if (!volume) return "-"
  if (volume >= 1_000_000) return `${(volume / 1_000_000).toFixed(1)}백만주`
  if (volume >= 1_000) return `${(volume / 1_000).toFixed(0)}천주`
  return `${volume}주`
}
