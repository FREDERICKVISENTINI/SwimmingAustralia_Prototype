import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Users, CreditCard, User, Map, CalendarDays } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { PageSection } from '../components/layout/PageSection'
import { Card } from '../components/ui/Card'
import { EventCard } from '../components/events/EventCard'
import { ROUTES } from '../routes'
import { PATHWAY_STAGES } from '../theme/tokens'

export function Dashboard() {
  const { accountType, swimmers, swimmerProfile, clubEvents, eventRegistrations } = useApp()
  const isMember = accountType === 'parent'
  const familyCount = swimmers.length

  const currentStageLabel = swimmerProfile
    ? PATHWAY_STAGES.find((s) => s.id === swimmerProfile.pathwayStageId)?.label ?? swimmerProfile.pathwayStageId
    : null

  const swimmerIds = useMemo(() => swimmers.map((s) => s.id), [swimmers])

  const upcomingPublished = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    return clubEvents
      .filter((e) => e.status === 'published' && e.date >= today)
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 3)
  }, [clubEvents])

  return (
    <PageSection
      title="Swimming Australia"
      subtitle="Connect participation to performance through a visible national pathway."
    >
      {isMember && (
        <>
          {/* Top quick-link cards */}
          <div className="max-w-xl">
            <Link
              to={ROUTES.app.profile}
              className="block rounded-[var(--radius-card)] border border-border/80 bg-card p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)] hover:border-accent/30"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-accent/15 p-2.5">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold text-text-primary">Your family</h2>
                  <p className="text-sm text-text-secondary">
                    {familyCount === 0
                      ? 'Add swimmers to manage profiles and pathway.'
                      : familyCount === 1
                        ? '1 swimmer on your account.'
                        : `${familyCount} swimmers on your account.`}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm font-medium text-accent">Manage family →</p>
            </Link>
          </div>

          {/* Quick links row */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="p-5">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
                Current stage
              </h3>
              {swimmerProfile ? (
                <>
                  <p className="mt-2 font-medium text-text-primary">{currentStageLabel ?? '—'}</p>
                  <p className="mt-0.5 text-sm text-text-muted">{swimmerProfile.firstName}'s pathway stage</p>
                  <Link to={ROUTES.app.pathway} className="mt-3 inline-block text-sm font-medium text-accent hover:underline">
                    View pathway →
                  </Link>
                </>
              ) : (
                <p className="mt-2 text-sm text-text-muted">Add a swimmer to see their stage.</p>
              )}
            </Card>

            <Card className="p-5">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
                Quick links
              </h3>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link to={ROUTES.app.events} className="flex items-center gap-2 text-sm font-medium text-accent hover:underline">
                    <CalendarDays className="h-4 w-4" /> Browse events
                  </Link>
                </li>
                <li>
                  <Link to={ROUTES.app.profile} className="flex items-center gap-2 text-sm font-medium text-accent hover:underline">
                    <User className="h-4 w-4" /> Profile
                  </Link>
                </li>
                <li>
                  <Link to={ROUTES.app.pathway} className="flex items-center gap-2 text-sm font-medium text-accent hover:underline">
                    <Map className="h-4 w-4" /> Pathway
                  </Link>
                </li>
                <li>
                  <Link to={ROUTES.app.payments} className="flex items-center gap-2 text-sm font-medium text-accent hover:underline">
                    <CreditCard className="h-4 w-4" /> Payments
                  </Link>
                </li>
              </ul>
            </Card>

            <Card className="p-5">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
                Registrations
              </h3>
              {(() => {
                const myRegs = eventRegistrations.filter((r) => swimmerIds.includes(r.swimmerId))
                const count = new Set(myRegs.map((r) => r.eventId)).size
                return count > 0 ? (
                  <>
                    <p className="mt-2 font-display text-2xl font-semibold text-text-primary">{count}</p>
                    <p className="mt-0.5 text-sm text-text-secondary">upcoming event{count !== 1 ? 's' : ''} registered</p>
                    <Link to={ROUTES.app.events} className="mt-3 inline-block text-sm font-medium text-accent hover:underline">
                      View events →
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="mt-2 text-sm text-text-muted">No registered events yet.</p>
                    <Link to={ROUTES.app.events} className="mt-3 inline-block text-sm font-medium text-accent hover:underline">
                      Browse events →
                    </Link>
                  </>
                )
              })()}
            </Card>
          </div>

          {/* Upcoming events preview */}
          {upcomingPublished.length > 0 && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-text-primary">Upcoming events</h2>
                <Link to={ROUTES.app.events} className="text-sm font-medium text-accent hover:underline">
                  See all →
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingPublished.map((evt) => (
                  <EventCard
                    key={evt.id}
                    event={evt}
                    registrations={eventRegistrations}
                    registeredSwimmerIds={swimmerIds}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {!isMember && (
        <Card>
          <p className="text-sm text-text-secondary">
            Sign in as a parent/swimmer or club account to access the dashboard.
          </p>
        </Card>
      )}
    </PageSection>
  )
}
