import { fetchFundamentals } from "@/lib/api/yahoo-fundamentals"

export type { StockFundamentals } from "@/lib/api/yahoo-fundamentals"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params
  try {
    const data = await fetchFundamentals(ticker)
    return Response.json(data, {
      headers: { "Cache-Control": "public, max-age=300" },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return Response.json({ error: message }, { status: 502 })
  }
}
