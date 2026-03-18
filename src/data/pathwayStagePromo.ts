/**
 * Promo content for the stage detail panel (slide-in from right).
 * One entry per pathway stage.
 */
import type { PathwayStageId } from '../types/pathwayRecommendations'

export type StagePromoContent = {
  stageId: PathwayStageId
  title: string
  tagline: string
  description: string
  benefits: string[]
  ctaLabel: string
}

export const PATHWAY_STAGE_PROMO: Record<PathwayStageId, StagePromoContent> = {
  recreation: {
    stageId: 'recreation',
    title: 'Recreation',
    tagline: 'Swim for fitness and fun',
    description:
      'Recreation is for anyone who wants to swim without competition—lap swimming, aqua fitness, or casual time in the water. The platform helps you find pools and programs near you. When you’re ready for lessons or squad, the pathway is here.',
    benefits: [
      'Find pools and leisure centres with lap and casual swim',
      'See aqua fitness and water-based class timetables',
      'Move to Learn-to-Swim or squad when you choose',
    ],
    ctaLabel: 'Find recreation options',
  },
  'learn-to-swim': {
    stageId: 'learn-to-swim',
    title: 'Learn-to-Swim',
    tagline: 'Where the pathway begins',
    description:
      'Learn-to-Swim is the first step on the national pathway. It’s where swimmers build water confidence and foundational skills in a safe, structured environment. The platform helps you find quality programs and see when your child is ready for the next step.',
    benefits: [
      'Find swim schools and beginner programs near you',
      'Track progress and readiness for squad transition',
      'Access optional assessments and placement support',
    ],
    ctaLabel: 'Find learn-to-swim programs',
  },
  'junior-squad': {
    stageId: 'junior-squad',
    title: 'Junior Squad',
    tagline: 'From lessons to structured sport',
    description:
      'Junior Squad is where participation turns into structured swimming. Swimmers develop technique and stamina in a squad environment, with early exposure to training and low-pressure competition. The platform helps you find the right program and access development support.',
    benefits: [
      'Discover junior squad programs and trial sessions',
      'Access technique assessments and stroke clinics',
      'See upcoming junior meets and development opportunities',
    ],
    ctaLabel: 'Explore junior programs',
  },
  'competitive-club': {
    stageId: 'competitive-club',
    title: 'Competitive Club',
    tagline: 'Racing and real progression',
    description:
      'Competitive Club is where athletes commit to regular training and competition. Club nights, regional meets, and performance squads become part of the journey. The platform surfaces clubs near you, key events, and performance services to support development.',
    benefits: [
      'Connect with competitive clubs and performance squads',
      'Stay across qualifying meets and club championships',
      'Access video analysis and athlete development reports',
    ],
    ctaLabel: 'View competitive opportunities',
  },
  'state-pathway': {
    stageId: 'state-pathway',
    title: 'State Pathway',
    tagline: 'High-performance development',
    description:
      'State Pathway is for swimmers ready for state-level programs, selection events, and high-performance environments. The platform helps you navigate state squads, camps, and premium support services as you move toward national representation.',
    benefits: [
      'Access state programs, camps, and selection events',
      'Connect with high-performance hubs and coaches',
      'Use premium services: biomechanics, race analysis, tracking',
    ],
    ctaLabel: 'Explore state pathway',
  },
  elite: {
    stageId: 'elite',
    title: 'Elite',
    tagline: 'National and international pathway',
    description:
      'Elite is the top of the pathway—national programs, international competition, and high-performance support. The platform supports athletes with elite services, performance analytics, and partnership opportunities as they pursue national and international goals.',
    benefits: [
      'Connect with national programs and elite training environments',
      'Access elite performance modelling and race analytics',
      'Explore sponsorship and high-performance partnerships',
    ],
    ctaLabel: 'View elite opportunities',
  },
}

export function getStagePromo(stageId: string): StagePromoContent | null {
  return PATHWAY_STAGE_PROMO[stageId as PathwayStageId] ?? null
}
