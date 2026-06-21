"use client"

export interface FieldConfig {
  key: string
  label: string
  unit: string
  group: string
  hint?: string
}

export const FIELDS: FieldConfig[] = [
  { key: "eps", label: "EPS", unit: "원", group: "수익성·가치", hint: "주당순이익" },
  { key: "per", label: "PER", unit: "배", group: "수익성·가치", hint: "주가수익비율" },
  { key: "pbr", label: "PBR", unit: "배", group: "수익성·가치", hint: "주가순자산비율" },
  { key: "roe", label: "ROE", unit: "%", group: "수익성·가치", hint: "자기자본이익률" },
  { key: "revenue", label: "매출", unit: "억원", group: "규모·현금", hint: "연 매출액" },
  { key: "freeCashFlow", label: "FCF", unit: "억원", group: "규모·현금", hint: "잉여현금흐름" },
  { key: "sharesOutstanding", label: "발행주식수", unit: "주", group: "규모·현금" },
  { key: "debtRatio", label: "부채비율", unit: "%", group: "건전성·성장", hint: "Yahoo D/E 기준" },
  { key: "operatingMargin", label: "영업이익률", unit: "%", group: "건전성·성장" },
  { key: "revenueGrowth", label: "매출 성장률", unit: "%", group: "건전성·성장" },
]

const GROUPS = ["수익성·가치", "규모·현금", "건전성·성장"]

function NumberField({
  field,
  value,
  onChange,
}: {
  field: FieldConfig
  value: string
  onChange: (v: string) => void
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs flex items-center gap-1" style={{ color: "var(--muted)" }}>
        {field.label}
        <span style={{ opacity: 0.6 }}>({field.unit})</span>
        {field.hint && <span className="hidden sm:inline" style={{ opacity: 0.5 }}>· {field.hint}</span>}
      </span>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="-"
        className="w-full px-3 py-2 rounded-xl text-sm tabular-nums transition-all outline-none"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          color: "var(--foreground)",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
      />
    </label>
  )
}

export default function ValuationForm({
  values,
  onChange,
}: {
  values: Record<string, string>
  onChange: (key: string, value: string) => void
}) {
  return (
    <div className="flex flex-col gap-5">
      {GROUPS.map((group) => (
        <div key={group}>
          <h3 className="text-sm font-bold mb-2">{group}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {FIELDS.filter((f) => f.group === group).map((f) => (
              <NumberField
                key={f.key}
                field={f}
                value={values[f.key] ?? ""}
                onChange={(v) => onChange(f.key, v)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
