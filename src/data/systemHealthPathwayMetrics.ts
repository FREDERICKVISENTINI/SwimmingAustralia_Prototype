/**
 * Demo national pathway metrics for System Health (Swimming Australia pre-read alignment).
 * Production would derive from stage transitions, longitudinal records, and meet/HP signals.
 */

/** L2S scaled to national participation; Squad & Club follow prior L2S→stage ratios; State & Elite held as pipeline slice. */
const _BASE_L2S = 182_400
const _SCALE = 4_576_599 / _BASE_L2S

export const PATHWAY_FUNNEL_STAGES = [
  { id: 'l2s', label: 'L2S', count: 4_576_599 },
  { id: 'squad', label: 'Squad', count: Math.round(41_200 * _SCALE) },
  { id: 'club', label: 'Club', count: Math.round(28_650 * _SCALE) },
  { id: 'state', label: 'State', count: 8_020 },
  { id: 'elite', label: 'Elite', count: 2_140 },
] as const

export function pathwayFunnelConversions() {
  const rows: { from: string; to: string; countFrom: number; countTo: number; conversionPct: number }[] = []
  for (let i = 0; i < PATHWAY_FUNNEL_STAGES.length - 1; i++) {
    const a = PATHWAY_FUNNEL_STAGES[i]
    const b = PATHWAY_FUNNEL_STAGES[i + 1]
    const conversionPct = Math.round((b.count / a.count) * 1000) / 10
    rows.push({
      from: a.label,
      to: b.label,
      countFrom: a.count,
      countTo: b.count,
      conversionPct,
    })
  }
  const largestDrop = rows.reduce((worst, row) =>
    row.conversionPct < worst.conversionPct ? row : worst
  )
  return { rows, largestDrop }
}

export const RETENTION_OVERALL_PCT = 77.2

export const RETENTION_BY_AGE = [
  { band: '5–7', pct: 81.4, risk: 'low' as const },
  { band: '8–12', pct: 66.8, risk: 'high' as const },
  { band: '13–15', pct: 78.1, risk: 'moderate' as const },
  { band: '16+', pct: 74.5, risk: 'moderate' as const },
]

export const PROGRESSION_WINDOW = '12 months (rolling)'

export const PROGRESSION_BENCHMARK = {
  expectedPct: 38.0,
  actualPct: 33.6,
  note: 'Actual progression slightly below cohort benchmark — worth investigating club→state transitions.',
}

export type HighValueSwimmer = {
  id: string
  name: string
  age: number
  club: string
  state: string
  signal: string
  priority: number
}

export const HIGH_VALUE_SWIMMERS: HighValueSwimmer[] = [
  { id: '1', name: 'M. Chen', age: 14, club: 'Sydney Olympic', state: 'NSW', signal: 'HP watch-list + national age Q', priority: 1 },
  { id: '2', name: 'J. Okonkwo', age: 16, club: 'Melbourne Vic Centre', state: 'VIC', signal: 'Multi-event PB cluster (50/100 FR)', priority: 2 },
  { id: '3', name: 'S. Patel', age: 13, club: 'Brisbane Grammar Swim', state: 'QLD', signal: 'State medal + progression velocity', priority: 3 },
  { id: '4', name: 'E. Fraser', age: 17, club: 'West Coast', state: 'WA', signal: 'Open national cut (secondary stroke)', priority: 4 },
  { id: '5', name: 'T. Nguyen', age: 15, club: 'Norwood', state: 'SA', signal: 'HP talent signal + retention flag', priority: 5 },
]

export const PIPELINE_DEPTH = {
  lateStageLabels: ['State', 'Elite'],
  stateCount: 8_020,
  eliteCount: 2_140,
  combined: 10_160,
  yoyChangePct: 4.1,
}

const PATHWAY_POP_SUM = PATHWAY_FUNNEL_STAGES.reduce((acc, s) => acc + s.count, 0)

export const PARTICIPATION_VOLUME = {
  totalActive: PATHWAY_POP_SUM,
  byStage: PATHWAY_FUNNEL_STAGES.map((s) => ({
    label: s.label,
    count: s.count,
    pct: Math.round((s.count / PATHWAY_POP_SUM) * 1000) / 10,
  })),
}
