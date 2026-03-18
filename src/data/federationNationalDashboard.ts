/**
 * Aggregated national mock data — no individual PII. Federation dashboard home only.
 */

export const NATIONAL_PARTICIPATION_BY_STATE = [
  { state: 'NSW', swimmers: 520_000, sharePct: 32.9 },
  { state: 'VIC', swimmers: 390_000, sharePct: 24.7 },
  { state: 'QLD', swimmers: 330_000, sharePct: 20.9 },
  { state: 'WA', swimmers: 140_000, sharePct: 8.9 },
  { state: 'SA', swimmers: 95_000, sharePct: 6.0 },
  { state: 'TAS', swimmers: 42_000, sharePct: 2.7 },
  { state: 'ACT', swimmers: 32_000, sharePct: 2.0 },
  { state: 'NT', swimmers: 26_000, sharePct: 1.6 },
] as const

export const NATIONAL_SWIMMER_TOTAL = NATIONAL_PARTICIPATION_BY_STATE.reduce((s, r) => s + r.swimmers, 0)

/** Normalized 0–1 for map fill intensity (vs max state). */
export function swimmerDensity01(swimmers: number): number {
  const max = Math.max(...NATIONAL_PARTICIPATION_BY_STATE.map((r) => r.swimmers))
  return max ? swimmers / max : 0
}

export const HP_TALENT_SIGNALS_NATIONAL = {
  totalSignals: 34_331,
  clubsContributing: 298,
  byType: [
    { label: 'National benchmark exceed', count: 9_543, accent: 'blue' as const },
    { label: 'Rapid improvement (90d)', count: 8_163, accent: 'teal' as const },
    { label: 'Coach HP observation', count: 7_474, accent: 'gold' as const },
    { label: 'Meet percentile spike', count: 9_151, accent: 'green' as const },
  ],
  topStates: ['VIC', 'NSW', 'QLD'] as const,
} as const

export const DROPOUT_RISK_AGGREGATE = {
  swimmersFlaggedNational: 58_225,
  clubsWithFlags: 156,
  byState: [
    { state: 'QLD', flagged: 8_989, clubs: 42 },
    { state: 'NSW', flagged: 13_391, clubs: 48 },
    { state: 'VIC', flagged: 11_022, clubs: 39 },
    { state: 'WA', flagged: 5_558, clubs: 18 },
    { state: 'SA', flagged: 7_684, clubs: 22 },
    { state: 'TAS', flagged: 2_909, clubs: 12 },
    { state: 'ACT', flagged: 1_660, clubs: 8 },
    { state: 'NT', flagged: 7_012, clubs: 15 },
  ],
} as const

export const CLUB_COMPLIANCE_NATIONAL = {
  wwccCurrentPct: 94.2,
  accreditationCurrentPct: 88.7,
  renewalsDue30Days: 876,
  clubsAuditedYTD: 2_311,
  atRiskClubs: 335,
} as const

export const PLATFORM_REVENUE_NATIONAL = {
  selfFundTargetAnnual: 18_000_000,
  ytdTotal: 12_400_000,
  fiscalYearLabel: 'FY25 YTD',
  streams: [
    { id: 'subs', label: 'Member & parent subscriptions', ytd: 4_200_000 },
    { id: 'club', label: 'Club & state platform fees', ytd: 3_800_000 },
    { id: 'premium', label: 'Premium data & analytics', ytd: 2_100_000 },
    { id: 'events', label: 'Events & competition services', ytd: 1_600_000 },
    { id: 'hp', label: 'HP tools licensing', ytd: 700_000 },
  ],
} as const
