/**
 * Local config for the Insights page.
 * Data from meets and high-performance systems; no per-swimmer comments.
 */
import type { FederationSectionId } from './federationSections'
import type {
  PathwayStageId,
  OverviewContent,
  ExpertOutputItem,
  ClubInfo,
  MeetResult,
} from '../types/insights'

/** Insight categories – types of data and intelligence available in Insights. */
export const INSIGHT_CATEGORIES = [
  {
    id: 'participation',
    title: 'Participation Analytics',
    description:
      'National swimmer numbers, demographic breakdowns, regional participation trends, and growth rates across the sport.',
  },
  {
    id: 'athlete-development',
    title: 'Athlete Development Metrics',
    description:
      'Progression rates, improvement curves, training participation patterns, and development benchmarks across age groups.',
  },
  {
    id: 'talent-signals',
    title: 'Talent Identification Signals',
    description:
      'Emerging athlete rankings, improvement velocity, technique efficiency indicators, and early high-performance potential flags.',
  },
  {
    id: 'consumer-behaviour',
    title: 'Consumer Behaviour Insights',
    description:
      'Equipment usage trends, training habits, program participation patterns, and spending behaviour of swimmers and families.',
  },
  {
    id: 'competition-event',
    title: 'Competition & Event Data',
    description:
      'Meet participation trends, event popularity, qualification rates, rankings distribution, and performance progression across competitions.',
  },
  {
    id: 'geographic',
    title: 'Geographic Sports Intelligence',
    description:
      'Participation density by region or postcode, talent concentration, facility demand, and regional club development strength.',
  },
  {
    id: 'commercial-sponsorship',
    title: 'Commercial Sponsorship Intelligence',
    description:
      'Addressable audience inventory, sponsor-ready cohorts, and revenue packaging derived from unified registrations, clubs, events, and pathway data.',
  },
  {
    id: 'high-performance',
    title: 'High-Performance Benchmark Data',
    description:
      'Stroke efficiency benchmarks, performance standards, development indicators, and comparisons with national and international elite metrics.',
  },
] as const

/** Federation section id -> insight category ids. Groups Premium data categories under each section. */
export const INSIGHT_CATEGORIES_BY_FEDERATION_SECTION: Record<string, string[]> = {
  'system-health': [],
  'player-database': ['participation', 'geographic'],
  'club-database': ['geographic', 'consumer-behaviour'],
  'performance': [
    'competition-event',
    'talent-signals',
    'high-performance',
    'athlete-development',
  ],
  'commercial': ['commercial-sponsorship', 'consumer-behaviour'],
}

export function getInsightCategoriesForFederationSection(sectionId: string): (typeof INSIGHT_CATEGORIES)[number][] {
  const ids = INSIGHT_CATEGORIES_BY_FEDERATION_SECTION[sectionId] ?? []
  return ids
    .map((id) => INSIGHT_CATEGORIES.find((c) => c.id === id))
    .filter((c): c is (typeof INSIGHT_CATEGORIES)[number] => c != null)
}

/** Examples of data & intelligence that could sit under each federation section (not linked to Insights). */
export const FEDERATION_DATA_INTELLIGENCE_RECOMMENDATIONS: Record<
  FederationSectionId,
  readonly { title: string; description: string }[]
> = {
  'system-health': [],
  'player-database': [
    {
      title: 'National swimmer lookup',
      description:
        'Search by name, member ID, or club — unified profile with pathway stage, meet history, and HP signals for federation staff.',
    },
    {
      title: 'Retention & progression context',
      description:
        'Attendance, competition frequency, cohort percentiles, and club-level retention markers to prioritise outreach.',
    },
  ],
  'club-database': [
    {
      title: 'National club registry',
      description:
        'Affiliation, governance, programs, venue, compliance, and hosting status — one record per affiliated club for federation and state staff.',
    },
    {
      title: 'Operational & commercial signals',
      description:
        'Aggregated membership, platform spend, meet hosting, and cohort benchmarks without exposing individual families.',
    },
  ],
  'performance': [
    {
      title: 'Competition & Event Data',
      description:
        'Meet participation trends, event popularity, qualification rates, rankings distribution, and performance progression across competitions.',
    },
    {
      title: 'Talent Identification Signals',
      description:
        'Emerging athlete rankings, improvement velocity, technique efficiency indicators, and early high-performance potential flags.',
    },
    {
      title: 'Athlete Development Metrics',
      description:
        'Progression rates, improvement curves, training participation patterns, and development benchmarks across age groups.',
    },
    {
      title: 'Club benchmarking & squad analytics',
      description:
        'Relative club performance, squad depth, pathway stage coverage, and retention signals aggregated at club level.',
    },
    {
      title: 'Regional club development',
      description:
        'How clubs compare within states and nationally for participation, talent pipeline, and program health.',
    },
  ],
  'commercial': [
    {
      title: 'Audience & cohort intelligence',
      description:
        'Segmented reach, sponsorable athlete pools, parent-linked households, and event-linked audiences — packaged for partnership conversations.',
    },
    {
      title: 'Revenue & partner packaging',
      description:
        'Sponsorship tiers, subscriptions, HP services, and event inventory tied to real federation data — not vanity engagement scores.',
    },
  ],
}

export const insightsByStage: Record<PathwayStageId, OverviewContent> = {
  recreation: {
    headline: 'Recreation and fitness — no competition pressure.',
    performanceInsights: [
      { id: 'p1', label: 'Sessions this term', value: '—', detail: 'Track laps or casual sessions if you like.' },
      { id: 'p2', label: 'Focus', value: 'Fitness & fun', detail: 'Swim at your own pace, any program.' },
    ],
  },
  'learn-to-swim': {
    headline: '12 sessions this term — participation on track.',
    performanceInsights: [
      { id: 'p1', label: 'Sessions this term', value: '12', detail: 'Attendance above club average.' },
      { id: 'p2', label: 'Readiness indicator', value: 'On track', detail: 'Consistent attendance supports next-stage readiness.' },
    ],
  },
  'junior-squad': {
    headline: '50m Free PB 42.15 at Club development meet (28 Feb).',
    performanceInsights: [
      { id: 'p1', label: '50m Freestyle', value: '42.15', detail: 'PB · 28 Feb 2025' },
      { id: 'p2', label: '25m Freestyle', value: '22.80', detail: 'Junior splash · 15 Feb' },
      { id: 'p3', label: 'Trend', value: 'Improving', detail: 'First PB in 50m Free this season.' },
      { id: 'p4', label: 'Next target', value: 'Sub-42.00', detail: '50m Free · club benchmark' },
    ],
  },
  'competitive-club': {
    headline: '100m Free PB 1:04.22 at Regional qualifier.',
    performanceInsights: [
      { id: 'p1', label: '100m Freestyle (PB)', value: '1:04.22', detail: 'Regional qualifier · 8 Mar' },
      { id: 'p2', label: '50m Backstroke', value: '38.45', detail: 'Club night · 5th' },
      { id: 'p3', label: 'Season PBs', value: '2', detail: '100m Free, 50m Back' },
      { id: 'p4', label: 'Trend', value: 'Improving', detail: '100m Free down 0.88s from Feb.' },
      { id: 'p5', label: 'Next target', value: '1:03.50', detail: '100m Free · state qualifier' },
    ],
  },
  'state-pathway': {
    headline: '100m Free 1:02.88 at Pathway qualifier — state selection entered.',
    performanceInsights: [
      { id: 'p1', label: '100m Freestyle (PB)', value: '1:02.88', detail: 'Pathway qualifier · 8th' },
      { id: 'p2', label: 'State selection', value: 'Entered', detail: '10 May 2025' },
      { id: 'p3', label: 'Trend', value: 'On track', detail: 'Within 0.5s of state benchmark.' },
      { id: 'p4', label: 'Next target', value: '1:02.20', detail: '100m Free · state consideration' },
    ],
  },
  elite: {
    headline: '100m Free 1:01.45 — 3rd State open. Nationals entered.',
    performanceInsights: [
      { id: 'p1', label: '100m Freestyle (PB)', value: '1:01.45', detail: 'State open · 3rd' },
      { id: 'p2', label: 'Nationals', value: 'Entered', detail: 'Jun 2025' },
      { id: 'p3', label: 'Trend', value: 'Elite track', detail: 'Aligned with national benchmark data.' },
      { id: 'p4', label: 'Next target', value: 'Sub-1:01.00', detail: '100m Free · national consideration' },
    ],
  },
}

/** Meet results – data from competition/meet systems. Sorted by date desc (most recent first). */
export const meetResultsByStage: Record<PathwayStageId, MeetResult[]> = {
  recreation: [],
  'learn-to-swim': [],
  'junior-squad': [
    { id: 'm1', meetName: 'Club development meet', date: '28 Feb 2025', dateISO: '2025-02-28', event: '50m Freestyle', time: '42.15', placement: 'Heat 3', isPB: true },
    { id: 'm1b', meetName: 'Club time trial', date: '8 Feb 2025', dateISO: '2025-02-08', event: '50m Freestyle', time: '43.20', placement: '—' },
    { id: 'm2', meetName: 'Junior splash', date: '15 Feb 2025', dateISO: '2025-02-15', event: '25m Freestyle', time: '22.80', placement: '2nd' },
  ],
  'competitive-club': [
    { id: 'm1', meetName: 'Regional qualifier', date: '8 Mar 2025', dateISO: '2025-03-08', event: '100m Freestyle', time: '1:04.22', placement: '12th', isPB: true },
    { id: 'm2', meetName: 'Club night', date: '1 Mar 2025', dateISO: '2025-03-01', event: '50m Backstroke', time: '38.45', placement: '5th' },
    { id: 'm3', meetName: 'Metro meet', date: '22 Feb 2025', dateISO: '2025-02-22', event: '100m Freestyle', time: '1:05.10', placement: 'Heat 4' },
    { id: 'm4', meetName: 'Club championships', date: '10 Jan 2025', dateISO: '2025-01-10', event: '100m Freestyle', time: '1:06.00', placement: 'Heat 2' },
  ],
  'state-pathway': [
    { id: 'm1', meetName: 'State selection meet', date: '10 May 2025', dateISO: '2025-05-10', event: '100m Freestyle', time: '—', placement: 'Entered' },
    { id: 'm2', meetName: 'Pathway qualifier', date: '5 Apr 2025', dateISO: '2025-04-05', event: '100m Freestyle', time: '1:02.88', placement: '8th', isPB: true },
    { id: 'm3', meetName: 'Metro championships', date: '15 Mar 2025', dateISO: '2025-03-15', event: '100m Freestyle', time: '1:03.45', placement: '6th' },
  ],
  elite: [
    { id: 'm1', meetName: 'National championships', date: 'Jun 2025', event: '100m Freestyle', time: '—', dateISO: '2025-06-01', placement: 'Entered' },
    { id: 'm2', meetName: 'State open', date: '12 Apr 2025', dateISO: '2025-04-12', event: '100m Freestyle', time: '1:01.45', placement: '3rd', isPB: true },
    { id: 'm3', meetName: 'State championships', date: '28 Mar 2025', dateISO: '2025-03-28', event: '100m Freestyle', time: '1:02.10', placement: '4th' },
  ],
}

/** Expert outputs – data retrieved from high-performance / assessment systems. */
export const expertOutputsByStage: Record<PathwayStageId, ExpertOutputItem[]> = {
  recreation: [],
  'learn-to-swim': [],
  'junior-squad': [
    {
      id: 'eo-js-1',
      title: 'Technique assessment – Freestyle',
      summary: 'Stroke length and body position metrics. Breathing consistency score 78%.',
      date: 'Mar 2025',
      type: 'assessment',
      source: 'Pathway assessment system',
    },
  ],
  'competitive-club': [
    {
      id: 'eo-cc-1',
      title: 'Technique assessment summary',
      summary: 'Freestyle and backstroke efficiency indices. Turn and start metrics recorded.',
      date: 'Mar 2025',
      type: 'assessment',
      source: 'High-performance assessment',
    },
    {
      id: 'eo-cc-2',
      title: 'Video analysis – 50m Free',
      summary: 'Underwater phase and breakout timing data. Export ID: VA-2847.',
      date: 'Feb 2025',
      type: 'technique',
      source: 'Video analysis system',
    },
  ],
  'state-pathway': [
    {
      id: 'eo-sp-1',
      title: 'Biomechanics report',
      summary: 'Limb coordination and force application data. State benchmark comparison included.',
      date: 'Mar 2025',
      type: 'biomechanics',
      source: 'High-performance biomechanics',
    },
    {
      id: 'eo-sp-2',
      title: 'Race analysis – 100m Free',
      summary: 'Split and stroke rate data. Pacing strategy output.',
      date: 'Mar 2025',
      type: 'race-analysis',
      source: 'Race analysis system',
    },
  ],
  elite: [
    {
      id: 'eo-el-1',
      title: 'Elite performance modelling',
      summary: 'Race strategy and load modelling output. National benchmark alignment.',
      date: 'Mar 2025',
      type: 'race-analysis',
      source: 'Elite performance system',
    },
    {
      id: 'eo-el-2',
      title: 'Biomechanics review',
      summary: 'Full biomechanical dataset. International comparison metrics.',
      date: 'Feb 2025',
      type: 'biomechanics',
      source: 'High-performance biomechanics',
    },
  ],
}

/** Demo SPARTA II screening windows — production would pull from state HP calendars. */
export type SpartaTestingSlot = {
  id: string
  window: string
  location: string
  placesRemaining: number
}

export const SPARTA_TESTING_SLOTS_DEMO: SpartaTestingSlot[] = [
  { id: 'sp-1', window: '18–20 Apr 2025', location: 'National training centre (demo venue)', placesRemaining: 14 },
  { id: 'sp-2', window: '2–4 May 2025', location: 'Sydney Olympic Park — regional hub', placesRemaining: 22 },
  { id: 'sp-3', window: '16–18 May 2025', location: 'Brisbane — state screening block', placesRemaining: 9 },
]

export function spartaAvailabilityForStage(stageId: PathwayStageId): {
  showBookingTable: boolean
  slots: SpartaTestingSlot[]
  note: string
} {
  if (stageId === 'recreation' || stageId === 'learn-to-swim') {
    return {
      showBookingTable: false,
      slots: [],
      note: 'SPARTA II screening is aimed at junior squad and competitive pathway swimmers. When your athlete reaches that stage, upcoming test windows will appear here alongside expert outputs.',
    }
  }
  return {
    showBookingTable: true,
    slots: SPARTA_TESTING_SLOTS_DEMO,
    note: 'Book via your state pathway portal when open. Figures are illustrative — confirm dates with your club or state body.',
  }
}

export const clubInfoByStage: Record<PathwayStageId, ClubInfo> = {
  recreation: {
    name: 'Local pool or leisure centre',
    summary: 'Lap swimming, aqua fitness, and casual sessions. No competition focus.',
    role: 'Recreation – fitness and fun',
    upcomingEvents: [
      { id: 'e1', title: 'Lane availability', date: 'Ongoing' },
      { id: 'e2', title: 'Aqua fitness timetable', date: 'Weekly' },
    ],
    opportunities: ['Lap swimming', 'Aqua classes', 'Casual swim'],
    message:
      'Swim for fitness and enjoyment. Move to Learn-to-Swim or squad when you’re ready.',
  },
  'learn-to-swim': {
    name: 'Aqua Kids Swim School',
    summary: 'Learn-to-swim and water confidence programs for all ages.',
    role: 'Swim school – beginner and water confidence',
    upcomingEvents: [
      { id: 'e1', title: 'Term 2 enrolments open', date: 'Apr 2025' },
      { id: 'e2', title: 'Parent information session', date: '15 Apr 2025' },
    ],
    opportunities: ['Beginner classes', 'Parent & child sessions', 'Progress assessments'],
    message:
      'Your club is the primary environment supporting progression at this stage.',
  },
  'junior-squad': {
    name: 'City Dolphins Junior Squad',
    summary: 'Development squad with a focus on technique and early competition.',
    role: 'Junior development squad',
    upcomingEvents: [
      { id: 'e1', title: 'Junior development meet', date: '5 Apr 2025' },
      { id: 'e2', title: 'Stroke clinic', date: '29 Mar 2025' },
    ],
    opportunities: ['Squad trials', 'Junior meets', 'Technique clinics'],
    message:
      'Your club is the primary environment supporting progression at this stage.',
  },
  'competitive-club': {
    name: 'City Swimming Club',
    summary: 'Full competitive program with club nights and regional representation.',
    role: 'Competitive club – performance squad',
    upcomingEvents: [
      { id: 'e1', title: 'Club championships', date: '26 Apr 2025' },
      { id: 'e2', title: 'Club night', date: '14 Mar 2025' },
    ],
    opportunities: ['Performance squad', 'Regional meets', 'Video analysis support'],
    message:
      'Your club is the primary environment supporting progression at this stage.',
  },
  'state-pathway': {
    name: 'State Development Program',
    summary: 'State-run development squad with access to state coaches and camps.',
    role: 'State pathway – high-performance hub',
    upcomingEvents: [
      { id: 'e1', title: 'State selection event', date: '10 May 2025' },
      { id: 'e2', title: 'State development camp', date: '24–27 May 2025' },
    ],
    opportunities: ['State camps', 'Selection events', 'Performance tracking'],
    message:
      'Your club is the primary environment supporting progression at this stage.',
  },
  elite: {
    name: 'National Performance Centre',
    summary: 'National squad environment with full support and competition calendar.',
    role: 'Elite – national program',
    upcomingEvents: [
      { id: 'e1', title: 'National championships', date: 'Jun 2025' },
      { id: 'e2', title: 'National camp', date: 'Sep 2025' },
    ],
    opportunities: ['Elite training', 'International competition', 'Partnership programs'],
    message:
      'Your club is the primary environment supporting progression at this stage.',
  },
}

export function resolveStageId(stageId: string | undefined | null): PathwayStageId {
  if (!stageId) return 'learn-to-swim'
  const valid: PathwayStageId[] = [
    'recreation',
    'learn-to-swim',
    'junior-squad',
    'competitive-club',
    'state-pathway',
    'elite',
  ]
  return valid.includes(stageId as PathwayStageId) ? (stageId as PathwayStageId) : 'learn-to-swim'
}
