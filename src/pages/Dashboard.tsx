import { Link } from 'react-router-dom'
import { Users, CreditCard, User, Map, BarChart3, Calendar } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { PageSection } from '../components/layout/PageSection'
import { Card } from '../components/ui/Card'
import { ROUTES } from '../routes'
import { PATHWAY_STAGES } from '../theme/tokens'
import { getPathwayStageContent } from '../data/pathwayStageContent'
import { MOCK_CALENDAR_EVENTS } from '../data/calendarEvents'

export function Dashboard() {
  const { accountType, swimmers, swimmerProfile, activeSwimmerId } = useApp()
  const isMember = accountType === 'parent'
  const familyCount = swimmers.length

  const currentStageLabel = swimmerProfile
    ? PATHWAY_STAGES.find((s) => s.id === swimmerProfile.pathwayStage)?.label ?? swimmerProfile.pathwayStage
    : null
  const pathwayContent = swimmerProfile ? getPathwayStageContent(swimmerProfile.pathwayStage) : null
  const nextStep = pathwayContent?.nextStep ?? null

  const upcomingEvents = activeSwimmerId
    ? MOCK_CALENDAR_EVENTS.filter(
        (e) => e.swimmerId === activeSwimmerId && e.status !== 'completed' && e.date >= new Date().toISOString().slice(0, 10)
      )
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 3)
    : []

  return (
    <PageSection
      title="Swimming Australia"
      subtitle="Connect participation to performance through a visible national pathway."
    >
      {isMember && (
        <div className="grid gap-4 sm:grid-cols-2 mb-6">
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
                    ? 'Add swimmers to your account to manage profiles, results, and pathway.'
                    : familyCount === 1
                      ? '1 member on your account. View profile, insights, and calendar.'
                      : `${familyCount} members on your account. View profiles, insights, and calendar.`}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm font-medium text-accent">Manage family →</p>
          </Link>
          <Link
            to={ROUTES.app.payments}
            className="block rounded-[var(--radius-card)] border border-border/80 bg-card p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)] hover:border-accent/30"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent/15 p-2.5">
                <CreditCard className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-text-primary">Payments</h2>
                <p className="text-sm text-text-secondary">
                  View and pay fees for your swimmers. Term fees, assessments, and other charges in one place.
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm font-medium text-accent">Pay or view balance →</p>
          </Link>
        </div>
      )}

      {isMember && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="p-5">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
              Current stage & next step
            </h3>
            {swimmerProfile ? (
              <>
                <p className="mt-2 font-medium text-text-primary">
                  {currentStageLabel ?? '—'}
                </p>
                {nextStep && swimmerProfile.pathwayStage !== 'recreation' ? (
                  <p className="mt-1 text-sm text-text-secondary">
                    Next: {nextStep.stageLabel}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-text-muted">
                    {swimmerProfile.pathwayStage === 'recreation'
                      ? 'Explore the pathway to find your next step.'
                      : 'You’re viewing the pathway. Select a stage below to explore.'}
                  </p>
                )}
                <Link
                  to={ROUTES.app.pathway}
                  className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
                >
                  View pathway →
                </Link>
              </>
            ) : (
              <p className="mt-2 text-sm text-text-muted">Add a swimmer to see their stage and next step.</p>
            )}
          </Card>

          <Card className="p-5">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
              Quick links
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  to={ROUTES.app.profile}
                  className="flex items-center gap-2 text-sm font-medium text-accent hover:underline"
                >
                  <User className="h-4 w-4" /> Profile
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.app.pathway}
                  className="flex items-center gap-2 text-sm font-medium text-accent hover:underline"
                >
                  <Map className="h-4 w-4" /> Pathway
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.app.insights}
                  className="flex items-center gap-2 text-sm font-medium text-accent hover:underline"
                >
                  <BarChart3 className="h-4 w-4" /> Insights
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.app.calendar}
                  className="flex items-center gap-2 text-sm font-medium text-accent hover:underline"
                >
                  <Calendar className="h-4 w-4" /> Calendar
                </Link>
              </li>
            </ul>
          </Card>

          <Card className="p-5">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
              Recent activity
            </h3>
            {upcomingEvents.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {upcomingEvents.map((evt) => (
                  <li key={evt.id} className="text-sm">
                    <p className="font-medium text-text-primary">{evt.title}</p>
                    <p className="text-text-muted">
                      {new Date(evt.date).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })}
                      {evt.startTime ? ` · ${evt.startTime}` : ''}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-text-muted">
                {activeSwimmerId
                  ? 'No upcoming events. Check the calendar for more.'
                  : 'Select a swimmer to see their upcoming events.'}
              </p>
            )}
            <Link
              to={ROUTES.app.calendar}
              className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
            >
              View calendar →
            </Link>
          </Card>
        </div>
      )}

      {!isMember && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <p className="text-sm text-text-secondary">
              Your overview and pathway summary will appear here.
            </p>
          </Card>
          <Card>
            <p className="text-sm text-text-secondary">
              Quick links to profile, pathway, and assessments.
            </p>
          </Card>
          <Card>
            <p className="text-sm text-text-secondary">
              Recent activity and next steps.
            </p>
          </Card>
        </div>
      )}
    </PageSection>
  )
}
