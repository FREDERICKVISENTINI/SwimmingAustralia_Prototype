import type { CalendarEvent } from '../../types/calendar'
import { CalendarEventCard } from './CalendarEventCard'

type Props = { events: CalendarEvent[] }

function groupByDate(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const map = new Map<string, CalendarEvent[]>()
  events.forEach((ev) => {
    const list = map.get(ev.date) ?? []
    list.push(ev)
    map.set(ev.date, list)
  })
  map.forEach((list) =>
    list.sort(
      (a, b) =>
        a.startTime.localeCompare(b.startTime) ||
        (a.title.localeCompare(b.title) ? 1 : 0)
    )
  )
  return map
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  const today = new Date()
  const isToday =
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }
  return isToday ? `Today, ${d.toLocaleDateString('en-AU', options)}` : d.toLocaleDateString('en-AU', options)
}

export function AgendaList({ events }: Props) {
  const byDate = groupByDate(events)
  const sortedDates = Array.from(byDate.keys()).sort()

  if (sortedDates.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      {sortedDates.map((date) => (
        <section key={date}>
          <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
            {formatDateLabel(date)}
          </h3>
          <ul className="space-y-3">
            {(byDate.get(date) ?? []).map((event) => (
              <li key={event.id}>
                <CalendarEventCard event={event} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
