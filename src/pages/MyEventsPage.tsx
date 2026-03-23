import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { PageSection } from '../components/layout/PageSection'
import { EventTypeBadge } from '../components/events/EventTypeBadge'
import { EventStatusBadge } from '../components/events/EventStatusBadge'
import { ROUTES } from '../routes'

function fmt(date: string) {
  return new Date(date + 'T12:00:00').toLocaleDateString('en-AU', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  })
}
function fmtTime(t: string) {
  const [h, m] = t.split(':').map(Number)
  const period = h >= 12 ? 'pm' : 'am'
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${period}`
}

export function MyEventsPage() {
  const { swimmers, clubEvents, eventRegistrations } = useApp()

  const swimmerIds = useMemo(() => swimmers.map((s) => s.id), [swimmers])

  const myRegistrations = useMemo(
    () => eventRegistrations.filter((r) => swimmerIds.includes(r.swimmerId)),
    [eventRegistrations, swimmerIds]
  )

  const registeredEvents = useMemo(() => {
    const eventIds = new Set(myRegistrations.map((r) => r.eventId))
    return clubEvents
      .filter((e) => eventIds.has(e.id))
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [clubEvents, myRegistrations])

  // Group registrations per event by swimmer
  const regsByEvent = useMemo(() => {
    const map: Record<string, string[]> = {}
    myRegistrations.forEach((r) => {
      map[r.eventId] = [...(map[r.eventId] ?? []), r.swimmerName]
    })
    return map
  }, [myRegistrations])

  return (
    <PageSection
      title="My events"
      subtitle="Events your swimmers are registered for."
    >
      {registeredEvents.length === 0 ? (
        <div className="rounded-[var(--radius-card)] border border-border/60 bg-card px-6 py-12 text-center">
          <p className="text-sm text-text-muted">No registered events yet.</p>
          <Link
            to={ROUTES.app.events}
            className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
          >
            Browse upcoming events →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {registeredEvents.map((evt) => {
            const whoRegistered = regsByEvent[evt.id] ?? []
            return (
              <Link
                key={evt.id}
                to={ROUTES.app.eventDetail(evt.id)}
                className="group flex flex-col gap-3 rounded-[var(--radius-card)] border border-border/80 bg-card p-5 shadow-[var(--shadow-card)] transition-all hover:border-accent/30 hover:shadow-[var(--shadow-card-hover)] sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <EventTypeBadge type={evt.eventType} />
                    <EventStatusBadge status={evt.status} />
                  </div>
                  <h3 className="font-display text-base font-semibold text-text-primary group-hover:text-accent transition-colors">
                    {evt.title}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-secondary">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-text-muted" />{fmt(evt.date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-text-muted" />{fmtTime(evt.startTime)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-text-muted" />{evt.location}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-text-muted">Registered</p>
                  {whoRegistered.map((name) => (
                    <p key={name} className="mt-0.5 text-sm font-medium text-text-primary">{name}</p>
                  ))}
                </div>
              </Link>
            )
          })}
        </div>
      )}

      <div className="mt-6">
        <Link to={ROUTES.app.events} className="text-sm font-medium text-accent hover:underline">
          Browse all events →
        </Link>
      </div>
    </PageSection>
  )
}
