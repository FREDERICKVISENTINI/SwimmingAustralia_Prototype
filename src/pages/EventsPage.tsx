import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { EventCard } from '../components/events/EventCard'
import { ROUTES } from '../routes'

/** Events grid for use inside Calendar (Events sub-view). */
export function EventsListPanel() {
  const { accountType, clubEvents, eventRegistrations, swimmers } = useApp()
  const isCoach = accountType === 'club'
  const isParent = accountType === 'parent'

  const visibleEvents = useMemo(() => {
    const list = isCoach ? clubEvents : clubEvents.filter((e) => e.status === 'published')
    return list.slice().sort((a, b) => a.date.localeCompare(b.date))
  }, [clubEvents, isCoach])

  const swimmerIds = useMemo(
    () => (isParent ? swimmers.map((s) => s.id) : []),
    [isParent, swimmers]
  )

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <p className="max-w-xl text-sm text-text-secondary">
          {isCoach
            ? 'Manage sessions, meets, clinics, and testing days for your club.'
            : 'Browse and register for upcoming events.'}
        </p>
        {isCoach ? (
          <Link
            to={ROUTES.app.eventCreate}
            className="flex shrink-0 items-center gap-1.5 rounded-[var(--radius-button)] bg-accent px-4 py-2 text-sm font-semibold text-bg transition hover:bg-accent-bright"
          >
            <Plus className="h-4 w-4" /> Create event
          </Link>
        ) : null}
      </div>

      {visibleEvents.length === 0 ? (
        <div className="mt-6 rounded-[var(--radius-card)] border border-border/60 bg-card px-6 py-12 text-center">
          <p className="text-sm text-text-muted">
            {isCoach ? 'No events yet. Create your first event to get started.' : 'No upcoming events at this time.'}
          </p>
          {isCoach && (
            <Link
              to={ROUTES.app.eventCreate}
              className="mt-4 inline-flex items-center gap-1.5 rounded-[var(--radius-button)] bg-accent px-4 py-2 text-sm font-semibold text-bg hover:bg-accent-bright"
            >
              <Plus className="h-4 w-4" /> Create event
            </Link>
          )}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleEvents.map((evt) => (
            <EventCard
              key={evt.id}
              event={evt}
              registrations={eventRegistrations}
              registeredSwimmerIds={swimmerIds}
              showStatus={isCoach}
            />
          ))}
        </div>
      )}
    </>
  )
}
