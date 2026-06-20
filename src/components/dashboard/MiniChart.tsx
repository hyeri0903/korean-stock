"use client"

import { ResponsiveContainer, AreaChart, Area, Tooltip } from "recharts"

interface Props {
  data: { date: string; close: number }[]
  positive: boolean
}

export default function MiniChart({ data, positive }: Props) {
  if (!data || data.length === 0) return <div className="h-14" />

  const color = positive ? "#ef4444" : "#3b82f6"

  return (
    <div className="h-14 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
          <defs>
            <linearGradient id={`grad-${positive}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.2} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="close"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#grad-${positive})`}
            dot={false}
            activeDot={{ r: 3, fill: color, stroke: "var(--background)", strokeWidth: 2 }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              return (
                <div
                  className="text-xs px-2 py-1 rounded-lg shadow-lg"
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  ₩{(payload[0].value as number).toLocaleString("ko-KR")}
                </div>
              )
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
