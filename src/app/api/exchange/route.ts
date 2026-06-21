import { streamRates } from "@/lib/api/exchange"

export type { ExchangeRate } from "@/lib/api/exchange"

// 도착하는 환율을 NDJSON(한 줄당 1건)으로 스트리밍한다.
export async function GET() {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const rate of streamRates(4)) {
          controller.enqueue(encoder.encode(JSON.stringify(rate) + "\n"))
        }
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
    },
  })
}
