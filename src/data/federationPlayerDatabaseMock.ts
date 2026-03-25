/**
 * Demo record for federation Player database — national lookup prototype (no live API).
 */

export type MeetResultRow = {
  event: string
  bestTime: string
  seasonBest: string
  ranking: string
  trend: 'up' | 'flat' | 'down'
}

export type ProgressionStageRow = {
  stage: string
  enteredAt: string
  duration: string
  status: 'completed' | 'current'
}

export type PlayerGeography = {
  postcode: string
  locality: string
  sa4Label: string
  regionType: string
  /** Club primary catchment / training area (demo). */
  catchmentNote: string
}

/** Demo Sparta II–style physical profiling block (illustrative for executive / national views). */
export type SpartaIIMetricRow = {
  metric: string
  value: string
  /** Plain-language band for quick CEO scan */
  read: 'Above cohort' | 'On track' | 'Monitor'
}

export type SpartaIIProfile = {
  productLabel: string
  sessionDate: string
  venue: string
  compositeIndex: string
  nationalPercentile: string
  metrics: SpartaIIMetricRow[]
  /** One-line headline for boards / briefings */
  executiveHeadline: string
}

export type PlayerRecord = {
  fullName: string
  memberId: string
  age: number
  dob: string
  gender: string
  state: string
  geography: PlayerGeography
  club: string
  coach: string
  familyAccount: string
  currentStage: string
  nextStage: string
  progressionVelocity: string
  attendanceRate: number
  competitionFrequency: string
  inactivityRisk: 'Low' | 'Medium' | 'High'
  highPotential: boolean
  retentionPriority: boolean
  hpFlag: string
  percentile: string
  clubRetentionRate: string
  clubProgressionRate: string
  linkedValue: string
  meetResults: MeetResultRow[]
  progression: ProgressionStageRow[]
  spartaII: SpartaIIProfile
  coachNotes: string[]
}

export const DEMO_PLAYER_RECORD: PlayerRecord = {
  fullName: 'John Smith',
  memberId: 'SA-2026-00142',
  age: 14,
  dob: '2011-08-14',
  gender: 'Male',
  state: 'Victoria',
  geography: {
    postcode: '3124',
    locality: 'Camberwell',
    sa4Label: 'Melbourne — East',
    regionType: 'Metropolitan',
    catchmentNote: 'Inner-east metro; primary club pool within 8 km',
  },
  club: 'Melbourne Dolphins',
  coach: 'Sarah Nguyen',
  familyAccount: 'Smith Family',
  currentStage: 'State Pathway',
  nextStage: 'National Development',
  progressionVelocity: 'Top 12% of cohort',
  attendanceRate: 91,
  competitionFrequency: '2.4 meets / month',
  inactivityRisk: 'Low',
  highPotential: true,
  retentionPriority: true,
  hpFlag: 'Strong 200m progression, high aerobic upside',
  percentile: '94th percentile in age cohort',
  clubRetentionRate: '88%',
  clubProgressionRate: '31%',
  linkedValue: '$1,240 annual family-linked spend',
  meetResults: [
    {
      event: '100m Freestyle',
      bestTime: '55.82',
      seasonBest: '56.10',
      ranking: 'State #7',
      trend: 'up',
    },
    {
      event: '200m Freestyle',
      bestTime: '2:01.44',
      seasonBest: '2:02.10',
      ranking: 'State #4',
      trend: 'up',
    },
    {
      event: '400m Freestyle',
      bestTime: '4:18.30',
      seasonBest: '4:19.01',
      ranking: 'State #6',
      trend: 'flat',
    },
  ],
  progression: [
    { stage: 'Learn to Swim', enteredAt: '2017', duration: '2 yrs', status: 'completed' },
    { stage: 'Junior Squad', enteredAt: '2019', duration: '2 yrs', status: 'completed' },
    { stage: 'Club', enteredAt: '2021', duration: '2 yrs', status: 'completed' },
    { stage: 'State Pathway', enteredAt: '2023', duration: 'Current', status: 'current' },
  ],
  spartaII: {
    productLabel: 'Sparta II',
    sessionDate: '2026-02-18',
    venue: 'AIS — Canberra (national screening)',
    compositeIndex: '78 / 100',
    nationalPercentile: '82nd vs 14–15 male cohort',
    executiveHeadline:
      'Lower-limb drive and eccentric control are strong vs peers; left–right balance is a watch item — aligns with HP aerobic focus.',
    metrics: [
      { metric: 'Explosive concentric power', value: '412 N', read: 'Above cohort' },
      { metric: 'Eccentric deceleration control', value: '0.94 s', read: 'Above cohort' },
      { metric: 'Left / right asymmetry (drive)', value: '6.4%', read: 'Monitor' },
      { metric: 'Landing stability index', value: '88', read: 'On track' },
    ],
  },
  coachNotes: [
    'Excellent consistency across 200m training blocks.',
    'Responds strongly to aerobic load and race pacing work.',
    'Recommended retention focus due to national upside.',
  ],
}

/** Demo player database: the single seeded profile is loaded via the Search control (prototype). */
export const PLAYER_DATABASE_DEMO_SEARCH_NAME = 'John Smith'
