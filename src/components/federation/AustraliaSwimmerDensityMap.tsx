import { NATIONAL_PARTICIPATION_BY_STATE, swimmerDensity01 } from '../../data/federationNationalDashboard'

/** Light theme: low density → pale blue-grey, high → accent teal. */
function fillForSwimmers(swimmers: number): string {
  const t = swimmerDensity01(swimmers)
  const r1 = 0xe8,
    g1 = 0xee,
    b1 = 0xf4
  const r2 = 0,
    g2 = 0x99,
    b2 = 0xcc
  const r = Math.round(r1 + (r2 - r1) * t)
  const g = Math.round(g1 + (g2 - g1) * t)
  const b = Math.round(b1 + (b2 - b1) * t)
  return `rgb(${r} ${g} ${b})`
}

const REGIONS: { state: string; d: string; labelX: number; labelY: number }[] = [
  { state: 'WA', d: 'M 8 32 L 42 28 L 46 108 L 12 118 Z', labelX: 26, labelY: 68 },
  { state: 'NT', d: 'M 88 12 L 132 10 L 130 38 L 90 42 Z', labelX: 110, labelY: 28 },
  { state: 'QLD', d: 'M 134 22 L 188 28 L 192 95 L 138 92 Z', labelX: 162, labelY: 58 },
  { state: 'SA', d: 'M 88 44 L 128 48 L 124 102 L 86 98 Z', labelX: 106, labelY: 74 },
  { state: 'NSW', d: 'M 140 94 L 186 98 L 184 124 L 142 120 Z', labelX: 162, labelY: 108 },
  { state: 'ACT', d: 'M 168 118 L 174 118 L 174 124 L 168 124 Z', labelX: 171, labelY: 128 },
  { state: 'VIC', d: 'M 138 122 L 172 128 L 168 148 L 136 142 Z', labelX: 154, labelY: 136 },
  { state: 'TAS', d: 'M 154 152 L 168 150 L 170 168 L 156 172 Z', labelX: 162, labelY: 162 },
]

export function AustraliaSwimmerDensityMap() {
  const byState = Object.fromEntries(
    NATIONAL_PARTICIPATION_BY_STATE.map((r) => [r.state, r.swimmers])
  ) as Record<string, number>

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-text-muted">
        Swimmer density by state (aggregated registrations)
      </p>
      <div className="flex flex-wrap items-start gap-6">
        <svg
          viewBox="0 0 200 185"
          className="w-full max-w-[280px] shrink-0 rounded-lg border border-border bg-card shadow-[var(--shadow-card)]"
          aria-label="Simplified Australia map, swimmer density by state"
        >
          {REGIONS.map(({ state, d, labelX, labelY }) => {
            const n = byState[state] ?? 0
            return (
              <g key={state}>
                <path d={d} fill={fillForSwimmers(n)} stroke="#d0dbe8" strokeWidth="0.75" />
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  className="fill-text-primary text-[7px] font-semibold"
                  style={{ fontSize: state === 'ACT' ? '5px' : '8px' }}
                >
                  {state}
                </text>
              </g>
            )
          })}
        </svg>
        <div className="min-w-0 flex-1 space-y-1.5 text-sm text-text-muted">
          <div className="flex items-center gap-2">
            <span className="h-2 w-8 rounded bg-[#e8eef4]" />
            <span>Lower density</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-8 rounded bg-accent" />
            <span>Higher density</span>
          </div>
          <p className="pt-2 text-xs leading-relaxed text-text-muted">
            State-level totals only — no individual PII or addresses.
          </p>
        </div>
      </div>
    </div>
  )
}
