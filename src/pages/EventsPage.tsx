import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { PageSection } from '../components/layout/PageSection'
import { EventCard } from '../components/events/EventCard'
import { ROUTES } from '../routes'
import type { EventType } from '../types/club'

const TYPE_LABELS: Record<EventType | 'all', string> = {
  all: 'All events',
  'training-session': 'Training',
  meet: 'Meet',
  clinic: 'Clinic',
  'testing-day': 'Testing Day',
}

export function EventsPage() {
  const { accountType, clubEvents, eventRegistrations, swimmers } = useApp()
  const isCoach = accountType === 'club'
  const isParent = accountType === 'parent'

  const [typeFilter, setTypeFilter] = useState<EventType | 'all'>('all')

  // Parent: only published events; Coach: all events
  const visibleEvents = useMemo(() => {
    let list = isCoach ? clubEvents : clubEvents.filter((e) => e.status === 'published')
    if (typeFilter !== 'all') list = list.filter((e) => e.eventType === typeFilter)
    return list.slice().sort((a, b) => a.date.localeCompare(b.date))
  }, [clubEvents, isCoach, typeFilter])

  const swimmerIds = useMemo(
    () => (isParent ? swimmers.map((s) => s.id) : []),
    [isParent, swimmers]
  )

  return (
    <PageSection
      title="Events"
      subtitle={
        isCoach
          ? 'Manage sessions, meets, clinics, and testing days for your club.'
          : 'Browse and register for upcoming events.'
      }
      headerAction={
        isCoach ? (
          <Link
            to={ROUTES.app.eventCreate}
            className="flex items-center gap-1.5 rounded-[var(--radius-button)] bg-accent px-4 py-2 text-sm font-semibold text-bg transition hover:bg-accent-bright"
          >
            <Plus className="h-4 w-4" /> Create event
          </Link>
        ) : null
      }
    >
      {/* Type filter tabs */}
      <div className="border-b border-border bg-bg-elevated/50" role="tablist">
        <div className="flex gap-0 overflow-x-auto">
          {(Object.keys(TYPE_LABELS) as (EventType | 'all')[]).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={typeFilter === key}
              onClick={() => setTypeFilter(key)}
              className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                typeFilter === key
                  ? 'border-accent text-accent'
                  : 'border-transparent text-text-muted hover:border-border hover:text-text-secondary'
              }`}
            >
              {TYPE_LABELS[key]}
            </button>
          ))}
        </div>
      </div>

      {visibleEvents.length === 0 ? (
        <div className="rounded-[var(--radius-card)] border border-border/60 bg-card px-6 py-12 text-center">
          <p className="text-text-muted text-sm">
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
    </PageSection>
  )
}
