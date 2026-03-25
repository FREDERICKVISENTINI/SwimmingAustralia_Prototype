/**
 * Local mock data for the Federation Dashboard.
 * Presentation-ready, coherent structure for national oversight views.
 */

export const FEDERATION_SUMMARY_METRICS = {
  totalSwimmers: 1_579_000,
  activeClubs: 412,
  talentFlags: 23_241,
  retentionRate: 78.2,
  upcomingNationalEvents: 6,
  /** New registrations this year (YoY growth count). */
  newRegistrationsThisYear: 564_056,
} as const

export const FEDERATION_FILTER_OPTIONS = {
  ageGroup: [
    { value: 'all', label: 'All ages' },
    { value: '8-under', label: '8 & under' },
    { value: '9-10', label: '9–10' },
    { value: '11-12', label: '11–12' },
    { value: '13-14', label: '13–14' },
    { value: '15-over', label: '15+' },
  ],
  gender: [
    { value: 'all', label: 'All' },
    { value: 'M', label: 'Male' },
    { value: 'F', label: 'Female' },
  ],
  state: [
    { value: 'all', label: 'All states' },
    { value: 'NSW', label: 'NSW' },
    { value: 'VIC', label: 'VIC' },
    { value: 'QLD', label: 'QLD' },
    { value: 'WA', label: 'WA' },
    { value: 'SA', label: 'SA' },
    { value: 'TAS', label: 'TAS' },
    { value: 'ACT', label: 'ACT' },
    { value: 'NT', label: 'NT' },
  ],
  pathwayStage: [
    { value: 'all', label: 'All stages' },
    { value: 'recreation', label: 'Recreation' },
    { value: 'learn-to-swim', label: 'Learn-to-Swim' },
    { value: 'junior-squad', label: 'Junior Squad' },
    { value: 'competitive-club', label: 'Competitive Club' },
    { value: 'state-pathway', label: 'State Pathway' },
    { value: 'elite', label: 'Elite' },
  ],
  programType: [
    { value: 'all', label: 'All programs' },
    { value: 'squad', label: 'Squad' },
    { value: 'learn-to-swim', label: 'Learn-to-Swim' },
    { value: 'competition', label: 'Competition' },
    { value: 'development', label: 'Development' },
  ],
  stroke: [
    { value: 'all', label: 'All strokes' },
    { value: 'free', label: 'Freestyle' },
    { value: 'back', label: 'Backstroke' },
    { value: 'breast', label: 'Breaststroke' },
    { value: 'fly', label: 'Butterfly' },
    { value: 'im', label: 'IM' },
  ],
  distance: [
    { value: 'all', label: 'All distances' },
    { value: '50', label: '50m' },
    { value: '100', label: '100m' },
    { value: '200', label: '200m' },
    { value: '400', label: '400m+' },
  ],
  meetLevel: [
    { value: 'all', label: 'All levels' },
    { value: 'club', label: 'Club' },
    { value: 'regional', label: 'Regional' },
    { value: 'state', label: 'State' },
    { value: 'national', label: 'National' },
  ],
} as const

export type FederationFilters = {
  ageGroup: string
  gender: string
  state: string
  club: string
  pathwayStage: string
  programType: string
  stroke: string
  distance: string
  meetLevel: string
}

export const DEFAULT_FEDERATION_FILTERS: FederationFilters = {
  ageGroup: 'all',
  gender: 'all',
  state: 'all',
  club: 'all',
  pathwayStage: 'all',
  programType: 'all',
  stroke: 'all',
  distance: 'all',
  meetLevel: 'all',
}

// --- Filter-aware derived data (federation only) ---

// State multipliers: how each state filter scales the national totals
const STATE_SCALE: Record<string, number> = {
  all: 1,
  NSW: 0.335,
  VIC: 0.250,
  QLD: 0.220,
  WA: 0.085,
  SA: 0.060,
  TAS: 0.028,
  ACT: 0.015,
  NT: 0.007,
}

// Stage multipliers: which stage filter is active
const STAGE_SCALE: Record<string, number> = {
  all: 1,
  recreation: 0.18,
  'learn-to-swim': 0.38,
  'junior-squad': 0.26,
  'competitive-club': 0.12,
  'state-pathway': 0.05,
  elite: 0.01,
}

// Age group multipliers
const AGE_SCALE: Record<string, number> = {
  all: 1,
  '8-under': 0.22,
  '9-10': 0.24,
  '11-12': 0.20,
  '13-14': 0.18,
  '15-over': 0.16,
}

// Gender multipliers
const GENDER_SCALE: Record<string, number> = {
  all: 1,
  F: 0.52,
  M: 0.48,
}

const PROGRAM_SCALE: Record<string, number> = {
  all: 1,
  squad: 0.42,
  'learn-to-swim': 0.38,
  competition: 0.28,
  development: 0.22,
}

const STROKE_DIM: Record<string, number> = {
  all: 1,
  free: 0.28,
  back: 0.22,
  breast: 0.2,
  fly: 0.14,
  im: 0.16,
}

const DISTANCE_DIM: Record<string, number> = {
  all: 1,
  '50': 0.35,
  '100': 0.32,
  '200': 0.22,
  '400': 0.11,
}

/** Maps filter value to age distribution label (must match AGE_GROUP_DISTRIBUTION labels). */
const AGE_GROUP_TO_LABEL: Record<string, string> = {
  '8-under': '8 & under',
  '9-10': '9–10',
  '11-12': '11–12',
  '13-14': '13–14',
  '15-over': '15+',
}

function getFilteredAgeDistribution(filters: FederationFilters): { label: string; pct: number }[] {
  if (filters.ageGroup === 'all') {
    return AGE_GROUP_DISTRIBUTION.map((r) => ({ label: r.label, pct: r.pct }))
  }
  const target = AGE_GROUP_TO_LABEL[filters.ageGroup]
  return AGE_GROUP_DISTRIBUTION.map((r) => ({
    label: r.label,
    pct: r.label === target ? 100 : 0,
  }))
}

function getFilteredGenderDistribution(filters: FederationFilters): { label: string; pct: number }[] {
  if (filters.gender === 'all') {
    return GENDER_DISTRIBUTION.map((r) => ({ label: r.label, pct: r.pct }))
  }
  if (filters.gender === 'F') {
    return [
      { label: 'Female', pct: 100 },
      { label: 'Male', pct: 0 },
    ]
  }
  return [
    { label: 'Female', pct: 0 },
    { label: 'Male', pct: 100 },
  ]
}

function getFilteredStageRetention(filters: FederationFilters) {
  const nudge = filters.pathwayStage === 'all' ? 0 : filters.pathwayStage === 'elite' ? 3 : 1
  return STAGE_RETENTION.map((row) => ({
    ...row,
    rate: Math.min(100, row.rate + nudge),
  }))
}

function getFilteredRankingsPreview(filters: FederationFilters) {
  const strokeWord: Record<string, string> = {
    free: 'Free',
    back: 'Back',
    breast: 'Breast',
    fly: 'Fly',
    im: 'IM',
  }
  if (filters.stroke === 'all') return [...NATIONAL_RANKINGS_PREVIEW]
  const w = strokeWord[filters.stroke]
  if (!w) return [...NATIONAL_RANKINGS_PREVIEW]
  return NATIONAL_RANKINGS_PREVIEW.filter((row) => row.event.includes(w))
}

/** Shared filter → scale mapping for federation mock metrics (used by commercial insights too). */
export function getFederationCohortScale(filters: FederationFilters): { scale: number; cohortScale: number } {
  const programScale = PROGRAM_SCALE[filters.programType] ?? 1
  const strokeScale = STROKE_DIM[filters.stroke] ?? 1
  const distanceScale = DISTANCE_DIM[filters.distance] ?? 1

  const scale =
    (STATE_SCALE[filters.state] ?? 1) *
    (STAGE_SCALE[filters.pathwayStage] ?? 1) *
    (AGE_SCALE[filters.ageGroup] ?? 1) *
    (GENDER_SCALE[filters.gender] ?? 1) *
    programScale *
    strokeScale *
    distanceScale

  const cohortScale = Math.max(0.25, Math.min(1.15, scale))
  return { scale, cohortScale }
}

export function deriveFilteredMetrics(filters: FederationFilters) {
  const { scale, cohortScale } = getFederationCohortScale(filters)

  const base = FEDERATION_SUMMARY_METRICS.totalSwimmers
  const total = Math.round(base * scale)

  const isFiltered =
    filters.state !== 'all' ||
    filters.pathwayStage !== 'all' ||
    filters.ageGroup !== 'all' ||
    filters.gender !== 'all' ||
    filters.club !== 'all' ||
    filters.meetLevel !== 'all' ||
    filters.programType !== 'all' ||
    filters.stroke !== 'all' ||
    filters.distance !== 'all'

  // Talent: scale flagged count, filter by stroke if selected
  const allAthletes = [
    { id: '1', name: 'Emma Chen', club: 'Melbourne Vicentre', clubKey: 'melbourne-vicentre', state: 'VIC', age: 14, ageGroup: '13-14', gender: 'F', improvement: 12.4, stroke: 'Freestyle', strokeKey: 'free', flag: true },
    { id: '2', name: 'Liam O\'Brien', club: 'SOPAC', clubKey: 'sopac', state: 'NSW', age: 15, ageGroup: '15-over', gender: 'M', improvement: 11.2, stroke: 'Backstroke', strokeKey: 'back', flag: true },
    { id: '3', name: 'Zara Williams', club: 'Chandler', clubKey: 'chandler', state: 'QLD', age: 13, ageGroup: '13-14', gender: 'F', improvement: 10.8, stroke: 'Butterfly', strokeKey: 'fly', flag: true },
    { id: '4', name: 'Noah Taylor', club: 'Nunawading', clubKey: 'other', state: 'VIC', age: 14, ageGroup: '13-14', gender: 'M', improvement: 9.6, stroke: 'IM', strokeKey: 'im', flag: false },
    { id: '5', name: 'Mia Johnson', club: 'Brisbane Grammar', clubKey: 'other', state: 'QLD', age: 12, ageGroup: '11-12', gender: 'F', improvement: 9.2, stroke: 'Breaststroke', strokeKey: 'breast', flag: false },
  ]

  const filteredAthletes = allAthletes.filter((a) => {
    if (filters.state !== 'all' && a.state !== filters.state) return false
    if (filters.ageGroup !== 'all' && a.ageGroup !== filters.ageGroup) return false
    if (filters.gender !== 'all' && a.gender !== filters.gender) return false
    if (filters.club !== 'all' && a.clubKey !== filters.club) return false
    if (filters.stroke !== 'all' && a.strokeKey !== filters.stroke) return false
    return true
  })

  // Club leaderboard: filter by state/club
  const allClubs = [
    { rank: 1, name: 'Melbourne Vicentre', clubKey: 'melbourne-vicentre', state: 'VIC', retention: 89, improvement: 8.2, progression: 34 },
    { rank: 2, name: 'SOPAC', clubKey: 'sopac', state: 'NSW', retention: 86, improvement: 7.8, progression: 31 },
    { rank: 3, name: 'Chandler', clubKey: 'chandler', state: 'QLD', retention: 85, improvement: 7.5, progression: 29 },
    { rank: 4, name: 'Nunawading', clubKey: 'other', state: 'VIC', retention: 83, improvement: 7.1, progression: 27 },
    { rank: 5, name: 'Brisbane Grammar', clubKey: 'other', state: 'QLD', retention: 81, improvement: 6.9, progression: 24 },
  ]

  const filteredClubs = allClubs.filter((c) => {
    if (filters.state !== 'all' && c.state !== filters.state) return false
    if (filters.club !== 'all' && c.clubKey !== filters.club) return false
    return true
  }).map((c, i) => ({ ...c, rank: i + 1 }))

  // Regional participation: show only selected state row or all
  const allRegions = [
    { region: 'NSW', count: 520000, pct: 32.9 },
    { region: 'VIC', count: 390000, pct: 24.7 },
    { region: 'QLD', count: 330000, pct: 20.9 },
    { region: 'WA', count: 140000, pct: 8.9 },
    { region: 'SA', count: 95000, pct: 6.0 },
    { region: 'Other', count: 58500, pct: 6.6 },
  ]
  const filteredRegions = filters.state !== 'all'
    ? allRegions.filter((r) => r.region === filters.state || (filters.state === 'TAS' || filters.state === 'ACT' || filters.state === 'NT' ? r.region === 'Other' : false))
    : allRegions

  // Meet level: filter by selected meet level
  const allMeetLevels = [
    { level: 'Club', count: 72000, pct: 72 },
    { level: 'Regional', count: 18500, pct: 18 },
    { level: 'State', count: 7200, pct: 7 },
    { level: 'National', count: 3020, pct: 3 },
  ]
  const filteredMeetLevels = filters.meetLevel !== 'all'
    ? allMeetLevels.filter((m) => m.level.toLowerCase() === filters.meetLevel)
    : allMeetLevels

  const pathwayFunnel = PATHWAY_FUNNEL.map((row) => ({
    ...row,
    count: Math.max(10, Math.round(row.count * cohortScale)),
  }))

  const convNudge = filters.pathwayStage === 'elite' ? 2 : filters.pathwayStage === 'all' ? 0 : 1
  const conversionSummary = CONVERSION_SUMMARY.map((row) => ({
    ...row,
    rate: Math.min(100, row.rate + convNudge),
  }))

  const clubAvgFromTable =
    filteredClubs.length > 0
      ? {
          avgRetention: Math.round(
            filteredClubs.reduce((s, c) => s + c.retention, 0) / filteredClubs.length
          ),
          avgImprovement: Math.round(
            (filteredClubs.reduce((s, c) => s + c.improvement, 0) / filteredClubs.length) * 10
          ) / 10,
          topClubsProgression: Math.max(...filteredClubs.map((c) => c.progression)),
        }
      : null

  const eventScale = Math.max(0.4, Math.min(1, scale))
  const eventAnalytics = {
    meetsThisYear: Math.max(1, Math.round(EVENT_ANALYTICS.meetsThisYear * eventScale)),
    avgParticipationPerMeet: Math.max(80, Math.round(EVENT_ANALYTICS.avgParticipationPerMeet * eventScale)),
    qualificationRate: Math.min(95, Math.round(EVENT_ANALYTICS.qualificationRate * (0.92 + 0.08 * eventScale))),
    pbImprovementRate: Math.min(95, Math.round(EVENT_ANALYTICS.pbImprovementRate * (0.9 + 0.1 * eventScale))),
  }

  const talentLeaderboardRows = [...filteredAthletes]
    .sort((a, b) => b.improvement - a.improvement)
    .slice(0, 3)
    .map((a, i) => ({
      rank: i + 1,
      name: a.name,
      metric: `+${a.improvement}%`,
      label: 'PB improvement (90d)' as const,
    }))

  return {
    isFiltered,
    total,
    filteredAthletes,
    filteredClubs,
    filteredRegions,
    filteredMeetLevels,
    talentFlaggedCount: Math.round(FEDERATION_SUMMARY_METRICS.talentFlags * scale),
    retentionRate: Math.max(60, Math.round((78.2 + (filters.pathwayStage === 'elite' ? 5 : 0)) * 10) / 10),
    ageDistribution: getFilteredAgeDistribution(filters),
    genderDistribution: getFilteredGenderDistribution(filters),
    stageRetentionRows: getFilteredStageRetention(filters),
    pathwayFunnel,
    conversionSummary,
    clubPerformanceSummary: clubAvgFromTable ?? {
      avgRetention: CLUB_PERFORMANCE_SUMMARY.avgRetention,
      avgImprovement: CLUB_PERFORMANCE_SUMMARY.avgImprovement,
      topClubsProgression: CLUB_PERFORMANCE_SUMMARY.topClubsProgression,
    },
    eventAnalytics,
    rankingsPreview: getFilteredRankingsPreview(filters),
    talentLeaderboardRows:
      talentLeaderboardRows.length > 0
        ? talentLeaderboardRows
        : TALENT_LEADERBOARD.map((r) => ({ ...r, label: r.label as 'PB improvement (90d)' })),
  }
}

// Participation & Growth
export const PARTICIPATION_METRICS = {
  totalRegistered: FEDERATION_SUMMARY_METRICS.totalSwimmers,
  learnToSwim: Math.round(FEDERATION_SUMMARY_METRICS.totalSwimmers * 0.38),
  clubMembership: Math.round(FEDERATION_SUMMARY_METRICS.totalSwimmers * 0.62),
  retentionRate: 78.2,
  yoyGrowth: 4.2,
} as const

export const AGE_GROUP_DISTRIBUTION = [
  { label: '8 & under', pct: 22 },
  { label: '9–10', pct: 24 },
  { label: '11–12', pct: 20 },
  { label: '13–14', pct: 18 },
  { label: '15+', pct: 16 },
] as const

export const GENDER_DISTRIBUTION = [
  { label: 'Female', pct: 52 },
  { label: 'Male', pct: 48 },
] as const

export const REGIONAL_PARTICIPATION = [
  { region: 'NSW', count: 28400, pct: 33.5 },
  { region: 'VIC', count: 21200, pct: 25.0 },
  { region: 'QLD', count: 18600, pct: 22.0 },
  { region: 'WA', count: 7200, pct: 8.5 },
  { region: 'SA', count: 5100, pct: 6.0 },
  { region: 'Other', count: 4220, pct: 5.0 },
] as const

export const STAGE_RETENTION = [
  { from: 'Learn-to-Swim', to: 'Junior Squad', rate: 68 },
  { from: 'Junior Squad', to: 'Competitive Club', rate: 72 },
  { from: 'Competitive Club', to: 'State Pathway', rate: 24 },
  { from: 'State Pathway', to: 'Elite', rate: 18 },
] as const

// Talent Identification
export const EMERGING_ATHLETES = [
  { id: '1', name: 'Emma Chen', club: 'Melbourne Vicentre', age: 14, improvement: 12.4, stroke: 'Freestyle', flag: true },
  { id: '2', name: 'Liam O\'Brien', club: 'SOPAC', age: 15, improvement: 11.2, stroke: 'Backstroke', flag: true },
  { id: '3', name: 'Zara Williams', club: 'Chandler', age: 13, improvement: 10.8, stroke: 'Butterfly', flag: true },
  { id: '4', name: 'Noah Taylor', club: 'Nunawading', age: 14, improvement: 9.6, stroke: 'IM', flag: false },
  { id: '5', name: 'Mia Johnson', club: 'Brisbane Grammar', age: 12, improvement: 9.2, stroke: 'Breaststroke', flag: false },
] as const

export const TALENT_LEADERBOARD = [
  { rank: 1, name: 'Emma Chen', metric: '+12.4%', label: 'PB improvement (90d)' },
  { rank: 2, name: 'Liam O\'Brien', metric: '+11.2%', label: 'PB improvement (90d)' },
  { rank: 3, name: 'Zara Williams', metric: '+10.8%', label: 'PB improvement (90d)' },
] as const

export const TALENT_SUMMARY = {
  flaggedCount: 1247,
  vsNationalAvg: 2.3,
  topStrokes: ['Freestyle', 'Backstroke', 'Butterfly'] as const,
} as const

// Performance Pipeline
export const PATHWAY_FUNNEL = [
  { stage: 'Learn-to-Swim', count: 32100, pct: 100 },
  { stage: 'Junior Squad', count: 21800, pct: 68 },
  { stage: 'Competitive Club', count: 15700, pct: 72 },
  { stage: 'State Pathway', count: 3760, pct: 24 },
  { stage: 'Elite', count: 680, pct: 18 },
] as const

export const CONVERSION_SUMMARY = [
  { label: 'LTS → Junior Squad', rate: 68, trend: 'up' as const },
  { label: 'Junior → Club', rate: 72, trend: 'stable' as const },
  { label: 'Club → State', rate: 24, trend: 'up' as const },
  { label: 'State → Elite', rate: 18, trend: 'stable' as const },
] as const

// Club Performance
export const CLUB_LEADERBOARD = [
  { rank: 1, name: 'Melbourne Vicentre', retention: 89, improvement: 8.2, progression: 34 },
  { rank: 2, name: 'SOPAC', retention: 86, improvement: 7.8, progression: 31 },
  { rank: 3, name: 'Chandler', retention: 85, improvement: 7.5, progression: 29 },
  { rank: 4, name: 'Nunawading', retention: 83, improvement: 7.1, progression: 27 },
  { rank: 5, name: 'Brisbane Grammar', retention: 81, improvement: 6.9, progression: 24 },
] as const

export const CLUB_PERFORMANCE_SUMMARY = {
  avgRetention: 76,
  avgImprovement: 5.4,
  topClubsProgression: 31,
} as const

// National Event Analytics
export const EVENT_ANALYTICS = {
  meetsThisYear: 184,
  avgParticipationPerMeet: 420,
  qualificationRate: 62,
  pbImprovementRate: 34,
} as const

export const MEET_LEVEL_PARTICIPATION = [
  { level: 'Club', count: 72000, pct: 72 },
  { level: 'Regional', count: 18500, pct: 18 },
  { level: 'State', count: 7200, pct: 7 },
  { level: 'National', count: 3020, pct: 3 },
] as const

export const NATIONAL_RANKINGS_PREVIEW = [
  { rank: 1, name: 'Emma Chen', event: '100 Free', time: '55.42', club: 'Melbourne Vicentre' },
  { rank: 2, name: 'Liam O\'Brien', event: '100 Back', time: '56.18', club: 'SOPAC' },
  { rank: 3, name: 'Zara Williams', event: '100 Fly', time: '59.21', club: 'Chandler' },
] as const

