/**
 * Types for the Insights module.
 * Content is driven by data from meets and high-performance systems, not per-swimmer comments.
 */

export type InsightsTabId =
  | 'overview'
  | 'results'
  | 'subscription'
  | 'expert-outputs'
  | 'your-club'
  | 'upload-results'
  | 'pro-plan-prototype'

export type PathwayStageId =
  | 'recreation'
  | 'learn-to-swim'
  | 'junior-squad'
  | 'competitive-club'
  | 'state-pathway'
  | 'elite'

/** Performance insight – one metric or highlight. */
export type PerformanceInsight = {
  id: string
  label: string
  value: string
  detail?: string
}

/** Overview: performance-focused insights derived from meet and assessment data. */
export type OverviewContent = {
  /** Headline performance highlight (e.g. recent PB, key metric). */
  headline: string
  /** Structured performance insights (times, trend, targets). */
  performanceInsights: PerformanceInsight[]
}

/** Meet result – data from competition systems. */
export type MeetResult = {
  id: string
  meetName: string
  /** Display date (e.g. "28 Feb 2025"). */
  date: string
  /** ISO date for sorting (e.g. "2025-02-28"). */
  dateISO: string
  event: string
  time: string
  placement?: string
  isPB?: boolean
}

/** Expert output – data retrieved from high-performance systems (assessments, race analysis). */
export type ExpertOutputItem = {
  id: string
  title: string
  summary: string
  date: string
  type: 'assessment' | 'technique' | 'biomechanics' | 'race-analysis'
  /** Source system (e.g. high-performance, assessment provider). */
  source: string
}

export type ClubInfo = {
  name: string
  summary: string
  role: string
  upcomingEvents: { id: string; title: string; date: string }[]
  opportunities: string[]
  message: string
} | null
