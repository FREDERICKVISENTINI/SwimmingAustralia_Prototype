/**
 * Types for swimmer progression timeline and milestone badges.
 * Used on profile and dashboard to show progress over time.
 */

export type ProgressionEventType =
  | 'joined'
  | 'stage'
  | 'first-race'
  | 'pb'
  | 'assessment'
  | 'club-event'

export type ProgressionEvent = {
  date: string // YYYY-MM-DD
  label: string
  type: ProgressionEventType
  /** Optional stage id when type is 'stage'. */
  stageId?: string
}

export type MilestoneBadge = {
  id: string
  label: string
  description?: string
  /** When earned (YYYY-MM-DD); optional for display-only badges. */
  earnedAt?: string
}
