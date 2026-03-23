import { Link } from 'react-router-dom'
import { Calendar, Clock, MapPin, Users } from 'lucide-react'
import type { ClubEvent, EventRegistration } from '../../types/club'
import { EventTypeBadge } from './EventTypeBadge'
import { EventStatusBadge } from './EventStatusBadge'
import { SpotsRemaining } from './SpotsRemaining'
import { ROUTES } from '../../routes'

type Props = {
  event: ClubEvent
  registrations: EventRegistration[]
  /** If set, renders a "Registered" tag for this swimmer */
  registeredSwimmerIds?: string[]
  showStatus?: boolean
}

function fmt(date: string) {
  return new Date(date + 'T12:00:00').toLocaleDateString('en-AU', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  })
}

function fmtTime(t: string) {
  const [h, m] = t.split(':').map(Number)
  const period = h >= 12 ? 'pm' : 'am'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

export function EventCard({ event, registrations, registeredSwimmerIds = [], showStatus = false }: Props) {
  const registered = registrations.filter((r) => r.eventId === event.id).length
  const isRegistered = registeredSwimmerIds.length > 0 &&
    registrations.some((r) => r.eventId === event.id && registeredSwimmerIds.includes(r.swimmerId))

  return (
    <Link
      to={ROUTES.app.eventDetail(event.id)}
      className="group block rounded-[var(--radius-card)] border border-border/80 bg-card p-5 shadow-[var(--shadow-card)] transition-all hover:border-accent/30 hover:shadow-[var(--shadow-card-hover)]"
    >
      {/* Header row */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <EventTypeBadge type={event.eventType} />
          {showStatus && <EventStatusBadge status={event.status} />}
          {isRegistered && (
            <span className="inline-flex rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-semibold text-accent">
              Registered
            </span>
          )}
        </div>
        {event.squadName && (
          <span className="text-xs text-text-muted">{event.squadName}</span>
        )}
      </div>

      {/* Title */}
      <h3 className="mt-2.5 font-display text-base font-semibold text-text-primary group-hover:text-accent transition-colors">
        {event.title}
      </h3>

      {/* Meta */}
      <div className="mt-3 space-y-1.5 text-sm text-text-secondary">
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 shrink-0 text-text-muted" />
          {fmt(event.date)}
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 shrink-0 text-text-muted" />
          {fmtTime(event.startTime)} – {fmtTime(event.endTime)}
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-text-muted" />
          {event.location}
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-3.5 w-3.5 shrink-0 text-text-muted" />
          <span>{event.coachName}</span>
        </div>
      </div>

      {/* Spots */}
      <div className="mt-4">
        <SpotsRemaining registered={registered} capacity={event.capacity} />
      </div>
    </Link>
  )
}
