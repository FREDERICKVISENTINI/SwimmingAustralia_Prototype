import { useMemo } from 'react'
import type { CalendarEvent, CalendarEventType } from '../../types/calendar'
import { EventTypeBadge } from './EventTypeBadge'

type Props = {
  /** Month to display (any day in month). */
  focusDate: Date
  /** Events used for dots and for upcoming list (pass a trimmed list for club view). */
  events: CalendarEvent[]
}

/** Mini grid dots: only training (blue) and competition / club-event (red). No grey “other” dots. */
function getDotColorClass(type: CalendarEventType): string | null {
  if (type === 'training') return 'bg-[#35C7F3]'
  if (type === 'competition' || type === 'club-event') return 'bg-[#E8534C]'
  return null
}

/** Left border / accent for upcoming card by type. */
function getCardBorderClass(type: CalendarEventType): string {
  if (type === 'training') return 'border-l-4 border-l-[#35C7F3]'
  if (type === 'competition' || type === 'club-event') return 'border-l-4 border-l-[#E8534C]'
  return 'border-l-4 border-l-[#8FB2C9]'
}

function getMonthStart(d: Date): Date {
  const date = new Date(d.getFullYear(), d.getMonth(), 1)
  date.setHours(0, 0, 0, 0)
  return date
}

function getMonthEnd(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0)
}

function addDays(d: Date, n: number): Date {
  const out = new Date(d)
  out.setDate(out.getDate() + n)
  return out
}

function toYMD(d: Date): string {
  return d.toISOString().slice(0, 10)
}

/** Monday (local) of the week containing dateStr — used to cap training dots. */
function weekKeyMonday(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  const dow = d.getDay()
  const mondayOffset = dow === 0 ? -6 : 1 - dow
  const mon = new Date(d)
  mon.setDate(d.getDate() + mondayOffset)
  return mon.toISOString().slice(0, 10)
}

/**
 * Fewer training dots on the mini grid: at most one training marker per week (first training day in that week).
 * Non-training events (meets, assessments, etc.) are unchanged.
 */
function reduceTrainingDotsForMonth(events: CalendarEvent[]): CalendarEvent[] {
  const nonTraining = events.filter((e) => e.type !== 'training')
  const training = events.filter((e) => e.type === 'training')
  const byWeek = new Map<string, CalendarEvent>()
  for (const e of training.sort((a, b) => a.date.localeCompare(b.date))) {
    const wk = weekKeyMonday(e.date)
    if (!byWeek.has(wk)) byWeek.set(wk, e)
  }
  return [...nonTraining, ...byWeek.values()]
}

/** Per date, pick one event type for the dot (prefer training then competition then other). */
function getDotTypeForDate(events: CalendarEvent[], dateStr: string): CalendarEventType | null {
  const onDay = events.filter((e) => e.date === dateStr)
  if (onDay.length === 0) return null
  const order: CalendarEventType[] = ['training', 'competition', 'club-event', 'assessment', 'camp-program']
  for (const t of order) {
    if (onDay.some((e) => e.type === t)) return t
  }
  return onDay[0].type
}

export function MiniCalendarWithUpcoming({ focusDate, events }: Props) {
  const eventsForDots = useMemo(() => reduceTrainingDotsForMonth(events), [events])

  const monthStart = getMonthStart(focusDate)
  const monthEnd = getMonthEnd(focusDate)
  const startPad = monthStart.getDay()
  const daysInMonth = monthEnd.getDate()

  const days: (number | null)[] = []
  for (let i = 0; i < startPad; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(d)

  const upcoming = [...events]
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)
    )
    .slice(0, 3)

  const monthLabel = monthStart.toLocaleDateString('en-AU', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-stretch">
      {/* Calendar — rectangular (wider, fixed-height grid) */}
      <div
        className="w-full shrink-0 rounded-[var(--radius-card)] border border-[#e2e8f0] bg-white p-3 shadow-[var(--shadow-card)] sm:max-w-[280px]"
        style={{ color: '#0f172a' }}
      >
        <div className="text-center font-display text-sm font-semibold text-slate-700">
          {monthLabel}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-px text-center" style={{ gridAutoRows: 'minmax(28px, 28px)' }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
            <div key={d} className="flex items-center justify-center text-[10px] font-medium text-slate-500">
              {d}
            </div>
          ))}
          {days.map((d, i) => {
            if (d === null) {
              return <div key={`pad-${i}`} className="min-h-[28px]" />
            }
            const cellDate = addDays(monthStart, d - 1)
            const dateStr = toYMD(cellDate)
            const isThursday = cellDate.getDay() === 4
            const dotType = getDotTypeForDate(eventsForDots, dateStr)
            /** Red for meets/club events; otherwise blue on every Thursday (prototype squad night); else event-based blue. */
            let dotClass: string | null = null
            if (dotType && (dotType === 'competition' || dotType === 'club-event')) {
              dotClass = getDotColorClass(dotType)
            } else if (isThursday) {
              dotClass = 'bg-[#35C7F3]'
            } else {
              dotClass = dotType ? getDotColorClass(dotType) : null
            }
            return (
              <div
                key={d}
                className="flex min-h-[28px] flex-col items-center justify-center rounded text-xs text-slate-700"
              >
                <span>{d}</span>
                {dotClass && (
                  <span
                    className={`mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`}
                    aria-hidden
                  />
                )}
              </div>
            )
          })}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#35C7F3]" /> Training</span>
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#E8534C]" /> Event</span>
        </div>
      </div>

      {/* Upcoming: 3 events, color-coded left border */}
      <div className="min-w-0 flex-1 rounded-[var(--radius-card)] border border-border bg-card p-4 shadow-[var(--shadow-card)]">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Upcoming</h3>
        <ul className="space-y-2">
          {upcoming.length === 0 ? (
            <li className="text-sm text-text-muted">No events this month.</li>
          ) : (
            upcoming.map((ev) => (
              <li
                key={ev.id}
                className={`rounded-lg border border-border/60 bg-bg-elevated/80 py-2.5 pl-3 pr-3 ${getCardBorderClass(ev.type)}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h4 className="font-display text-sm font-semibold text-text-primary">
                    {ev.title}
                  </h4>
                  <EventTypeBadge type={ev.type} />
                </div>
                {ev.swimmerName && (
                  <p className="mt-0.5 text-xs text-text-muted">{ev.swimmerName}</p>
                )}
                <p className="mt-0.5 text-xs text-text-secondary">
                  {ev.date} · {ev.startTime}–{ev.endTime} {ev.location && ` · ${ev.location}`}
                </p>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}
