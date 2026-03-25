/**
 * Commercial & sponsorship intelligence mock — federation-grade audience inventory,
 * sponsor targeting segments, and revenue packaging (prototype).
 */
import { getFederationCohortScale, FEDERATION_SUMMARY_METRICS } from './federationDashboardData'
import type { FederationFilters } from './federationDashboardData'

export type CommercialAudienceKpi = {
  id: string
  label: string
  sublabel: string
  value: string
  footnote?: string
  accent?: 'default' | 'premium'
}

export type SponsorableCohort = {
  id: string
  title: string
  /** Primary segmentation axes for sponsors */
  axes: string
  size: number
  sponsorFit: string
  valueNote: string
  /** Optional note near the size figure (e.g. overlap, already completed). */
  sizeCallout?: string
}

export type RevenueOpportunity = {
  id: string
  name: string
  audience: string
  revenueType: 'Sponsorship' | 'Subscription' | 'Services' | 'Events' | 'Data & analytics'
  tier?: string
  explanation: string
}

/** National baselines — scaled by filter cohort in deriveCommercialInsights. */
const BASE_KPIS = {
  reachableParticipants: 4_200_000,
  sponsorableCohort: 186_400,
  juniorDevelopmentAudience: 328_000,
  parentHouseholds: 892_000,
  eventLinkedAudience: 264_000,
  highEngagementClubMembers: 412_000,
} as const

const COHORTS_BASE: (Omit<SponsorableCohort, 'size'> & { sizeBase: number })[] = [
  {
    id: 'j9-12',
    title: 'Junior competition swimmers (9–12)',
    axes: 'Age · pathway: junior → competitive · state: all',
    sponsorFit: 'Nutrition, junior apparel, family brands, learn-to-swim adjacency',
    valueNote: 'High parent involvement; school-age; repeatable meet touchpoints.',
    sizeBase: 184_200,
  },
  {
    id: 'sp13-16',
    title: 'State pathway athletes (13–16)',
    axes: 'Pathway stage · competition tier: state+',
    sponsorFit: 'Performance nutrition, recovery, tech, state-level partners',
    valueNote: 'Campaign-ready: clear progression story and selection pressure.',
    sizeBase: 221_000,
  },
  {
    id: 'lts-parents',
    title: 'Learn-to-swim → parent households',
    axes: 'Program: LTS · linked payer accounts',
    sponsorFit: 'Family safety, swim schools, local retail, insurance',
    valueNote: 'Largest addressable household layer; acquisition funnel for the sport.',
    sizeBase: 412_000,
  },
  {
    id: 'freq-families',
    title: 'High-frequency club families',
    axes: 'Sessions / week · multi-child accounts',
    sponsorFit: 'Equipment, travel, club loyalty, recurring consumables',
    valueNote: 'Depth of engagement — not vanity reach; repeat exposure per season.',
    sizeBase: 96_800,
  },
  {
    id: 'national-event',
    title: 'National event–attending audience',
    axes: 'Meet level: national · qualification',
    sponsorFit: 'National brands, broadcast adjacency, elite performance partners',
    valueNote: 'Concentrated attention window; partner assets align with peak visibility.',
    sizeBase: 318_000,
  },
  {
    id: 'regional-growth',
    title: 'Regional growth markets (index)',
    axes: 'YoY participation · club density delta',
    sponsorFit: 'State partners, facility, grassroots programmes',
    valueNote: 'Where to deploy state-level partner packages vs national campaigns.',
    sizeBase: 124_000,
  },
  {
    id: 'comp-female',
    title: 'Competitive pathway — female cohort (14+)',
    axes: 'Gender · pathway: competitive+',
    sponsorFit: 'Apparel, wellbeing, performance brands with female athlete focus',
    valueNote: 'Segmentation only possible with unified gender + pathway + club data.',
    sizeBase: 88_600,
  },
  {
    id: 'hp-transition',
    title: 'HP assessment & screening (recreational + competitive)',
    axes: 'All pathways · recreational through competitive · club & LTS',
    sponsorFit: 'Health, screening, wellness, performance testing partners',
    valueNote:
      'Open to the full swimming population — from learn-to-swim and recreational swimmers to competitive club and squad; screening and partner moments are not limited to elite HP selection.',
    sizeBase: 1_345_543,
    sizeCallout:
      'Total addressable reach — many may have already completed screening or assessment in-period; partner and services planning should allow for refresh cycles and net-new gaps, not treat every row as first-time.',
  },
]

const OPPORTUNITIES_BASE: RevenueOpportunity[] = [
  {
    id: 'junior-pathway-pack',
    name: 'Junior pathway sponsor package',
    audience: 'Junior squad + linked parent households',
    revenueType: 'Sponsorship',
    tier: 'National',
    explanation: 'Family-brand activation at scale: meet naming, digital cohorts, club co-brand kits.',
  },
  {
    id: 'state-perf-partner',
    name: 'State performance partner package',
    audience: 'State pathway & competitive clubs (by state filter)',
    revenueType: 'Sponsorship',
    tier: 'State',
    explanation: 'Geo-targeted rights: state championships, talent ID touchpoints, coach network.',
  },
  {
    id: 'hp-assessment',
    name: 'HP assessment & screening revenue',
    audience: 'Competitive + progressing athletes (screening-eligible)',
    revenueType: 'Services',
    tier: 'Per athlete / block',
    explanation: 'Direct monetisation: SPARTA-style screening blocks + follow-up insight products.',
  },
  {
    id: 'club-intel-sub',
    name: 'Club intelligence subscription',
    audience: 'Club admins & head coaches',
    revenueType: 'Subscription',
    tier: 'ARR (club)',
    explanation: 'Recurring software revenue: benchmarking, squad analytics, federation reporting exports.',
  },
  {
    id: 'event-partner-inv',
    name: 'National event partner inventory',
    audience: 'Event-attending + broadcast-adjacent cohorts',
    revenueType: 'Events',
    tier: 'Tier 1–3',
    explanation: 'Packaged inventory: on-deck, digital, qualification series — tied to real entry data.',
  },
  {
    id: 'fed-analytics-sub',
    name: 'Federation analytics subscription',
    audience: 'Internal commercial + partner success teams',
    revenueType: 'Data & analytics',
    tier: 'Enterprise',
    explanation: 'Ongoing access to packaged segments, refresh cadence, and campaign performance reporting.',
  },
  {
    id: 'parent-premium',
    name: 'Parent reporting & premium insights',
    audience: 'Payer-linked accounts (junior-heavy)',
    revenueType: 'Subscription',
    tier: 'B2C add-on',
    explanation: 'Pathway readiness, comparative benchmarks — revenue from value-add reporting.',
  },
  {
    id: 'data-campaign',
    name: 'Data-backed campaign briefs',
    audience: 'Any packaged segment above',
    revenueType: 'Data & analytics',
    tier: 'Project',
    explanation: 'Sponsor-ready audience definitions + reach estimates from unified registration & event data.',
  },
]

function fmtCount(n: number): string {
  return n.toLocaleString()
}

export function deriveCommercialInsights(filters: FederationFilters) {
  const { cohortScale } = getFederationCohortScale(filters)
  const scale = (n: number) => Math.max(Math.round(n * cohortScale), Math.round(n * 0.12))

  const totalNational = FEDERATION_SUMMARY_METRICS.totalSwimmers
  const filteredTotalHint = scale(totalNational)

  const kpis: CommercialAudienceKpi[] = [
    {
      id: 'reach',
      label: 'Reachable participants',
      sublabel: 'Unified registrations & active programme graph',
      value: fmtCount(scale(BASE_KPIS.reachableParticipants)),
      footnote: 'Addressable for digital & partner comms (not raw logins).',
      accent: 'premium',
    },
    {
      id: 'sponsorable',
      label: 'Sponsorable athlete cohort',
      sublabel: 'Competitive+ with meet exposure in last 12 months',
      value: fmtCount(scale(BASE_KPIS.sponsorableCohort)),
      footnote: 'Partner-ready: performance + visibility signals.',
      accent: 'premium',
    },
    {
      id: 'junior-dev',
      label: 'Junior development audience',
      sublabel: 'Junior squad + transition from LTS',
      value: fmtCount(scale(BASE_KPIS.juniorDevelopmentAudience)),
    },
    {
      id: 'parents',
      label: 'Parent-connected households',
      sublabel: 'Payer-linked accounts (junior-heavy)',
      value: fmtCount(scale(BASE_KPIS.parentHouseholds)),
      footnote: 'Influence & purchase decisions — B2C + family brand fit.',
    },
    {
      id: 'events',
      label: 'Event-linked audience',
      sublabel: 'State+ meet entries (rolling year)',
      value: fmtCount(scale(BASE_KPIS.eventLinkedAudience)),
    },
    {
      id: 'clubs',
      label: 'High-engagement club base',
      sublabel: 'Members at clubs in top engagement quartile',
      value: fmtCount(scale(BASE_KPIS.highEngagementClubMembers)),
      footnote: 'Depth over reach — repeat sessions & season loyalty.',
    },
  ]

  const cohorts: SponsorableCohort[] = COHORTS_BASE.map(({ sizeBase, ...rest }) => ({
    ...rest,
    size: scale(sizeBase),
  }))

  const opportunities = OPPORTUNITIES_BASE.map((o) => ({ ...o }))

  const isFiltered =
    filters.state !== 'all' ||
    filters.pathwayStage !== 'all' ||
    filters.ageGroup !== 'all' ||
    filters.meetLevel !== 'all'

  return {
    kpis,
    cohorts,
    opportunities,
    filteredTotalHint,
    cohortScale,
    isFiltered,
    intro:
      'Unified federation data links registrations, clubs, events, and pathway stage — so commercial teams see audiences as packaged inventory, not generic “users”.',
  }
}
