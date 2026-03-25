/** How a future dataset could be ingested — shown as badges per opportunity. */
export type FutureCaptureChannel = 'partnership' | 'api' | 'facility_integration'

export type FutureDataOpportunity = {
  id: string
  /** Display title */
  name: string
  /** One line — why this gap matters */
  whyItMatters: string
  /** Which capture modes apply */
  channels: FutureCaptureChannel[]
  /** Show “Partnership required” tag */
  partnershipRequired?: boolean
}

export const FUTURE_DATA_OPPORTUNITIES: FutureDataOpportunity[] = [
  {
    id: 'lts-private',
    name: 'Learn-to-swim enrolments (private operators)',
    whyItMatters: 'Completes the early funnel so pathways from first water to club are visible federation-wide.',
    channels: ['partnership', 'api'],
    partnershipRequired: true,
  },
  {
    id: 'school-programs',
    name: 'School swimming program participation',
    whyItMatters: 'Surfaces school-age reach and transitions into club or squad programs.',
    channels: ['partnership', 'facility_integration'],
    partnershipRequired: true,
  },
  {
    id: 'rec-lap-tap',
    name: 'Recreational lap swimmers (facility tap-on data)',
    whyItMatters: 'Adds informal participation volume and repeat-visit behaviour outside structured programs.',
    channels: ['facility_integration', 'api'],
  },
  {
    id: 'wearables',
    name: 'Wearables (Garmin, Apple Watch)',
    whyItMatters: 'Enriches load, recovery, and session context alongside pool and competition data.',
    channels: ['api', 'partnership'],
    partnershipRequired: true,
  },
]
