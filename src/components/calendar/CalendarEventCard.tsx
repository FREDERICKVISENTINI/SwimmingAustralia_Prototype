import type { CalendarEvent } from '../../types/calendar'
import { EventTypeBadge } from './EventTypeBadge'

type Props = { event: CalendarEvent }

export function CalendarEventCard({ event }: Props) {
  const statusLabel =
    event.status === 'completed'
      ? 'Completed'
      : event.status === 'registered'
        ? 'Registered'
        : 'Upcoming'

  return (
    <article className="rounded-[var(--radius-card)] border border-border bg-card p-4 text-left shadow-[var(--shadow-card)] transition-colors hover:border-accent/30">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-display font-semibold text-text-primary">{event.title}</h3>
          {event.swimmerName && (
            <p className="mt-0.5 text-sm text-text-muted">{event.swimmerName}</p>
          )}
        </div>
        <EventTypeBadge type={event.type} />
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-secondary">
        <span>
          {event.date} · {event.startTime}–{event.endTime}
        </span>
        <span>{event.location}</span>
      </div>
      {event.notes && (
        <p className="mt-2 text-sm text-text-muted">{event.notes}</p>
      )}
      <div className="mt-2">
        <span
          className={`text-xs font-medium ${
            event.status === 'completed'
              ? 'text-success'
              : event.status === 'registered'
                ? 'text-accent'
                : 'text-text-muted'
          }`}
        >
          {statusLabel}
        </span>
      </div>
    </article>
  )
}
