/**
 * Types for stage-based pathway recommendations.
 * Used for Programs Near You, Upcoming Opportunities, Services, Next Step.
 */

export type PathwayStageId =
  | 'recreation'
  | 'learn-to-swim'
  | 'junior-squad'
  | 'competitive-club'
  | 'state-pathway'
  | 'elite'

export type NearbyProgram = {
  id: string
  title: string
  description: string
  location: string
  category: string
  ctaLabel: string
  /** Places filled vs capacity — same semantics as club events (for SpotsRemaining UI). */
  registered: number
  capacity: number
  /** Lead coach or contact role — mirrors event cards’ coach line. */
  coachName?: string
  /** When the next intake or session runs — mirrors date/time cues on event cards. */
  nextSessionSummary?: string
}

export type UpcomingOpportunity = {
  id: string
  title: string
  description: string
  date: string
  location: string
  category: string
  ctaLabel: string
}

export type ServiceTier = 'entry' | 'development' | 'performance' | 'premium' | 'elite'

export type RecommendedService = {
  id: string
  title: string
  description: string
  serviceType: string
  tier: ServiceTier
  ctaLabel: string
}

export type NextStepInfo = {
  stageId: PathwayStageId
  stageLabel: string
  description: string
  ctaLabel: string
}

export type PathwayStageContent = {
  stageId: PathwayStageId
  programsNearYou: NearbyProgram[]
  upcomingOpportunities: UpcomingOpportunity[]
  recommendedServices: RecommendedService[]
  nextStep: NextStepInfo
  /** Elite only: sponsorship/partnerships */
  sponsorshipSection?: {
    title: string
    items: { id: string; title: string; description: string; ctaLabel: string }[]
  }
}
