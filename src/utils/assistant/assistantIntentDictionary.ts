/**
 * Concept groups (synonym clusters) and intent definitions for scoring.
 * Expand groups — not individual regex rules per query.
 */

export type ConceptGroupId =
  | 'yoy_time'
  | 'revenue'
  | 'participation'
  | 'state_geo'
  | 'state_trend'
  | 'pathway'
  | 'dropout'
  | 'retention'
  | 'age'
  | 'hp'
  | 'sparta'
  | 'sponsorship'
  | 'emerging'
  | 'junior'
  | 'commercial'
  | 'risk'
  | 'heatmap'
  | 'acceleration'
  | 'national'

/** Each group: phrases checked as substrings on the normalised query. */
export const CONCEPT_GROUPS: Record<ConceptGroupId, string[]> = {
  yoy_time: [
    'yoy',
    'time_trend',
    'year over year',
    'annual',
    'compare years',
    'compare over',
    'over the years',
    'versus last',
    'vs last',
    'prior year',
    'previous year',
  ],
  revenue: [
    'revenue',
    'money',
    'financial',
    'funding',
    'subscription',
    'subscriptions',
    'partnership',
    'partner',
    'commercial',
    'platform fee',
    'fee income',
  ],
  participation: [
    'registrations',
    'participation',
    'volume',
    'numbers',
    'active swimmers',
    'club participation',
    'member',
    'membership',
  ],
  state_geo: [
    'by state',
    'each state',
    'state by',
    'regional',
    'states are',
    'which states',
    ' nsw ',
    ' vic ',
    ' qld ',
    ' wa ',
    ' sa ',
    ' tas ',
    ' act ',
    ' nt ',
    'national',
  ],
  state_trend: [
    'state change',
    'state-by-state',
    'state by state',
    'regional trend',
    'state trend',
  ],
  pathway: ['pathway', 'progression', 'funnel', 'conversion', 'transition', 'stage'],
  dropout: ['dropout', 'lts', 'junior squad', 'pathway drop', 'losing', 'lose'],
  retention: ['retention', 'retain', 'stick', 'stay'],
  age: ['age', 'age group', 'age-group', 'cohort', 'demographic', 'boys', 'girls', 'gender', 'junior', 'senior'],
  hp: ['hp', 'high performance', 'talent', 'assessment', 'selection'],
  sparta: ['sparta', 'screening'],
  sponsorship: [
    'sponsor',
    'sponsorship',
    'sponsor_pick',
    'worthy',
    'who should',
    'who is worth',
    'good athletes',
    'rising athletes',
    'emerging athletes',
  ],
  emerging: ['emerging', 'trending', 'upward', 'improving', 'trajectory', 'momentum', 'swimming well', 'coming through'],
  junior: ['junior', '11-14', '11–14', 'young', 'minis', 'development', 'high potential', 'kids'],
  commercial: ['commercial potential', 'brand', 'visibility', 'under-recogn', 'underrecogn', 'media'],
  risk: ['risk', 'churn', 'despite', 'intervention', 'payment stress', 'attendance'],
  heatmap: ['heatmap', 'intensity', 'quarter', 'matrix', 'grid'],
  acceleration: ['acceleration', 'accelerate', 'watchlist', 'monitor', 'velocity', 'fast track'],
  national: ['national', 'country', 'australia-wide'],
}

/** Predefined assistant result ids (charts + recommendations). */
export type AssistantResultId =
  | 'registrations-yoy'
  | 'state-changes'
  | 'pathway-dropoff-state'
  | 'hp-uptake-trend'
  | 'revenue-changes'
  | 'participation-heatmap'
  | 'age-retention-yoy'
  | 'sponsorship-candidates'
  | 'trending-upward'
  | 'junior-prospects'
  | 'commercial-potential'
  | 'pathway-acceleration'
  | 'retention-risk-strong'

export type IntentDefinition = {
  resultId: AssistantResultId
  /** Lower = wins ties after score. */
  tiePriority: number
  /** Weight per concept when that concept is active (0–1 presence). */
  weights: Partial<Record<ConceptGroupId, number>>
  /** Extra points when ALL listed groups are active. */
  comboBonuses?: { groups: ConceptGroupId[]; bonus: number }[]
}

export const INTENT_DEFINITIONS: IntentDefinition[] = [
  {
    resultId: 'revenue-changes',
    tiePriority: 2,
    weights: {
      revenue: 14,
      yoy_time: 10,
      participation: 2,
    },
    comboBonuses: [
      { groups: ['revenue', 'yoy_time'], bonus: 18 },
      { groups: ['revenue', 'state_geo'], bonus: 6 },
    ],
  },
  {
    resultId: 'registrations-yoy',
    tiePriority: 1,
    weights: {
      participation: 12,
      yoy_time: 14,
      national: 3,
    },
    comboBonuses: [{ groups: ['participation', 'yoy_time'], bonus: 20 }],
  },
  {
    resultId: 'state-changes',
    tiePriority: 6,
    weights: {
      state_trend: 16,
      state_geo: 10,
      participation: 8,
      yoy_time: 6,
    },
    comboBonuses: [
      { groups: ['state_geo', 'participation'], bonus: 12 },
      { groups: ['state_geo', 'participation', 'yoy_time'], bonus: 28 },
    ],
  },
  {
    resultId: 'participation-heatmap',
    tiePriority: 8,
    weights: {
      heatmap: 18,
      state_geo: 10,
      participation: 8,
    },
    comboBonuses: [{ groups: ['heatmap', 'state_geo'], bonus: 14 }],
  },
  {
    resultId: 'pathway-dropoff-state',
    tiePriority: 3,
    weights: {
      pathway: 10,
      dropout: 14,
      state_geo: 12,
    },
    comboBonuses: [
      { groups: ['pathway', 'dropout', 'state_geo'], bonus: 22 },
      { groups: ['dropout', 'state_geo'], bonus: 16 },
    ],
  },
  {
    resultId: 'age-retention-yoy',
    tiePriority: 6,
    weights: {
      retention: 14,
      age: 14,
      yoy_time: 10,
    },
    comboBonuses: [{ groups: ['retention', 'age'], bonus: 18 }],
  },
  {
    resultId: 'hp-uptake-trend',
    tiePriority: 7,
    weights: {
      hp: 12,
      sparta: 14,
      yoy_time: 10,
    },
    comboBonuses: [
      { groups: ['hp', 'yoy_time'], bonus: 16 },
      { groups: ['sparta', 'yoy_time'], bonus: 18 },
    ],
  },
  {
    resultId: 'sponsorship-candidates',
    tiePriority: 10,
    weights: {
      sponsorship: 18,
      commercial: 8,
      emerging: 6,
    },
    comboBonuses: [{ groups: ['sponsorship', 'emerging'], bonus: 10 }],
  },
  {
    resultId: 'trending-upward',
    tiePriority: 11,
    weights: {
      emerging: 16,
      hp: 6,
      participation: 4,
    },
    comboBonuses: [{ groups: ['emerging', 'hp'], bonus: 12 }],
  },
  {
    resultId: 'junior-prospects',
    tiePriority: 12,
    weights: {
      junior: 16,
      hp: 10,
      pathway: 6,
    },
    comboBonuses: [{ groups: ['junior', 'hp'], bonus: 14 }],
  },
  {
    resultId: 'commercial-potential',
    tiePriority: 13,
    weights: {
      commercial: 16,
      sponsorship: 8,
      emerging: 6,
    },
    comboBonuses: [{ groups: ['commercial', 'emerging'], bonus: 10 }],
  },
  {
    resultId: 'pathway-acceleration',
    tiePriority: 14,
    weights: {
      acceleration: 16,
      pathway: 12,
      hp: 6,
    },
    comboBonuses: [{ groups: ['acceleration', 'pathway'], bonus: 16 }],
  },
  {
    resultId: 'retention-risk-strong',
    tiePriority: 9,
    weights: {
      risk: 16,
      retention: 10,
      emerging: 4,
    },
    comboBonuses: [{ groups: ['risk', 'retention'], bonus: 14 }],
  },
]

/** Human-readable labels for demo “matched to …” line. */
export const RESULT_INTENT_LABELS: Record<AssistantResultId, string> = {
  'registrations-yoy': 'National registration trend analysis',
  'state-changes': 'State participation comparison',
  'pathway-dropoff-state': 'Pathway retention by state',
  'hp-uptake-trend': 'HP & screening uptake trend',
  'revenue-changes': 'Revenue trend analysis',
  'participation-heatmap': 'Participation intensity (state × period)',
  'age-retention-yoy': 'Age-group retention analysis',
  'sponsorship-candidates': 'Sponsorship shortlist screening',
  'trending-upward': 'Emerging performance trajectory',
  'junior-prospects': 'Junior development prospects',
  'commercial-potential': 'Commercial partnership potential',
  'pathway-acceleration': 'Pathway acceleration watchlist',
  'retention-risk-strong': 'Retention risk vs performance',
}
