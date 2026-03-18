/**
 * Calendar event types for the Swimming Australia prototype.
 * Local state only; no backend.
 */

export type CalendarEventType =
  | 'training'
  | 'competition'
  | 'assessment'
  | 'camp-program'
  | 'club-event'

export type CalendarEventStatus = 'registered' | 'upcoming' | 'completed'

export type CalendarEvent = {
  id: string
  title: string
  swimmerId: string | null
  swimmerName: string | null
  type: CalendarEventType
  date: string // YYYY-MM-DD
  startTime: string
  endTime: string
  location: string
  status: CalendarEventStatus
  notes?: string
}

export type CalendarViewMode = 'month' | 'week' | 'agenda'

export type CalendarActivityFilter =
  | 'all'
  | 'training'
  | 'competition'
  | 'assessment'
  | 'camp-program'
  | 'club-event'
