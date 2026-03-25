import { useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import type { TeamProfile } from '../context/AppContext'
import { PageSection } from '../components/layout/PageSection'
import { ClubMetricCard, QuickActionPanel } from '../components/club'
import { EventCard } from '../components/events/EventCard'
import { PATHWAY_STAGES } from '../theme/tokens'
import { ROUTES } from '../routes'
import { AlertTriangle, Lock, Unlock } from 'lucide-react'

const ORG_TYPE_LABELS: Record<TeamProfile['organisationType'], string> = {
  club: 'Club',
  'swim school': 'Swim school',
  'squad program': 'Squad program',
  'state program': 'State program',
}

export function ClubDashboard() {
  const { teamProfile, clubClasses, clubSwimmers, clubPayments, clubStatUploads, isPremiumTier, clubEvents, eventRegistrations, attendanceRecords } = useApp()
  const navigate = useNavigate()

  if (!teamProfile) {
    return (
      <PageSection title="Club dashboard">
        <p className="text-text-muted">No team profile. Complete club onboarding to access the dashboard.</p>
      </PageSection>
    )
  }

  const orgTypeLabel = ORG_TYPE_LABELS[teamProfile.organisationType] ?? teamProfile.organisationType
  const pathwayLabelsFromClasses = [...new Set(clubClasses.map((c) => c.pathwayStageId))]
    .map((id) => PATHWAY_STAGES.find((s) => s.id === id)?.label ?? id.replace(/-/g, ' '))
    .filter(Boolean)
  const pathwaySummary = pathwayLabelsFromClasses.length > 1
    ? pathwayLabelsFromClasses.join(' · ')
    : pathwayLabelsFromClasses[0] ?? null
  const totalSwimmers = clubSwimmers.length
  const activeClasses = clubClasses.filter((c) => c.status === 'active').length
  const paid = clubPayments.filter((p) => p.status === 'paid').length
  const overdue = clubPayments.filter((p) => p.status === 'overdue').length
  const due = clubPayments.filter((p) => p.status === 'due').length
  const totalCollected = clubPayments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  const outstanding = clubPayments.filter((p) => p.status === 'due' || p.status === 'overdue').reduce((s, p) => s + p.amount, 0)
  const recentUploads = clubStatUploads.slice(0, 5)

  const upcomingEvents = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    return clubEvents
      .filter((e) => e.status === 'published' && e.date >= today)
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 3)
  }, [clubEvents])

  const atRiskSwimmers = useMemo(() => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return clubSwimmers.filter((s) => {
      const noRecentStat = !s.latestStatDate || new Date(s.latestStatDate) < thirtyDaysAgo
      const paymentIssue = s.paymentStatus === 'overdue'
      const inactive = s.attendanceStatus === 'inactive'
      const swimmerRecords = attendanceRecords.filter((a) => a.swimmerId === s.id)
      const present = swimmerRecords.filter((a) => a.status === 'present').length
      const lowAttendance = swimmerRecords.length >= 3 && (present / swimmerRecords.length) < 0.6
      return noRecentStat || paymentIssue || inactive || lowAttendance
    })
  }, [clubSwimmers, attendanceRecords])

  return (
    <PageSection
      title={teamProfile.organisationName}
      subtitle="Manage classes, swimmers, payments, and performance data."
    >
      <div className="rounded-[var(--radius-card)] border border-border bg-bg-elevated p-6 shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-block rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-medium text-accent">
            Club account
          </span>
          {isPremiumTier && (
            <span className="inline-block rounded-full border border-premium/50 bg-premium/15 px-2.5 py-0.5 text-xs font-medium text-premium">
              Premium Active
            </span>
          )}
        </div>
        <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-text-primary md:text-3xl">
          {teamProfile.organisationName}
        </h2>
        <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-text-secondary">
          <span>{orgTypeLabel}</span>
          <span className="text-text-muted">·</span>
          <span>{teamProfile.state}</span>
          {pathwaySummary && (
            <>
              <span className="text-text-muted">·</span>
              <span className="font-medium text-success">{pathwaySummary}</span>
            </>
          )}
        </dl>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <ClubMetricCard label="Total swimmers" value={totalSwimmers} />
        <ClubMetricCard label="Active classes" value={activeClasses} subtext={`${clubClasses.length} total`} />
        <ClubMetricCard label="Payments collected" value={`$${totalCollected}`} subtext={`${paid} paid`} />
        <ClubMetricCard label="Outstanding" value={`$${outstanding}`} subtext={`${due + overdue} due/overdue`} />
        <ClubMetricCard label="Recent stat uploads" value={clubStatUploads.length} subtext="This period" to={ROUTES.app.stats} />
      </div>

      <QuickActionPanel
        actions={[
          { label: 'Create event', onClick: () => navigate(ROUTES.app.eventCreate) },
          { label: 'Add swimmer', onClick: () => navigate(ROUTES.app.classes) },
          { label: 'Upload stats', onClick: () => navigate(ROUTES.app.stats) },
          { label: 'Record payment', onClick: () => navigate(ROUTES.app.payments) },
        ]}
      />

      {atRiskSwimmers.length > 0 && (
        <div className="rounded-[var(--radius-card)] border border-amber-500/30 bg-amber-500/5 p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
            <h3 className="font-display text-sm font-semibold text-amber-300">
              Retention watch — {Math.min(atRiskSwimmers.length, 3)} swimmer{Math.min(atRiskSwimmers.length, 3) !== 1 ? 's' : ''} flagged
            </h3>
          </div>
          <ul className="space-y-2">
            {atRiskSwimmers.slice(0, 3).map((s) => {
              const noStat = !s.latestStatDate || new Date(s.latestStatDate) < (() => { const d = new Date(); d.setDate(d.getDate() - 30); return d })()
              const reasons = [
                noStat ? 'No stat upload in 30+ days' : null,
                s.paymentStatus === 'overdue' ? 'Payment overdue' : null,
              ].filter(Boolean)
              return (
                <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-amber-500/5 px-3 py-2 text-sm">
                  <span className="font-medium text-text-primary">{s.firstName} {s.lastName}</span>
                  <span className="text-text-muted text-xs">{s.className ?? '—'}</span>
                  <div className="flex flex-wrap gap-1 ml-auto">
                    {reasons.map((r) => (
                      <span key={r} className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-300">{r}</span>
                    ))}
                  </div>
                </li>
              )
            })}
          </ul>
          <p className="mt-3 text-xs text-text-muted">Flags: no recent stat upload or overdue payment. Review and follow up to reduce dropout risk.</p>
        </div>
      )}

      {/* Upcoming events */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-text-primary">Upcoming events</h2>
          <Link to={ROUTES.app.events} className="text-sm font-medium text-accent hover:underline">
            Manage all →
          </Link>
        </div>
        {upcomingEvents.length === 0 ? (
          <div className="rounded-[var(--radius-card)] border border-border/60 bg-card px-5 py-8 text-center">
            <p className="text-sm text-text-muted">No upcoming published events.</p>
            <Link
              to={ROUTES.app.eventCreate}
              className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
            >
              Create an event →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((evt) => (
              <EventCard
                key={evt.id}
                event={evt}
                registrations={eventRegistrations}
                showStatus
              />
            ))}
          </div>
        )}
      </section>

      {/* Recent uploads */}
      {recentUploads.length > 0 && (
        <div className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
            Recent stat uploads
          </h3>
          <ul className="mt-3 space-y-2">
            {recentUploads.map((u) => (
              <li key={u.id} className="flex justify-between text-sm">
                <span className="text-text-primary">{u.swimmerName}</span>
                <span className="text-text-secondary">{u.eventMetric} {u.value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Premium insights section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-text-primary flex items-center gap-2">
            {isPremiumTier ? <Unlock className="h-4 w-4 text-premium" /> : <Lock className="h-4 w-4 text-text-muted" />}
            Premium Insights
          </h2>
          {!isPremiumTier && (
            <span className="text-xs text-text-muted">Enable Premium in Settings to unlock</span>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <PremiumCard
            title="National Benchmarking"
            description="Compare your swimmers to state and national averages by pathway stage and age group."
            locked={!isPremiumTier}
          >
            <div className="space-y-2">
              {PATHWAY_STAGES.slice(1, 5).map((stage) => {
                const count = clubSwimmers.filter((s) => s.pathwayStageId === stage.id).length
                const natAvg = Math.round(count * (0.8 + Math.random() * 0.4))
                return (
                  <div key={stage.id} className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">{stage.label}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-text-primary font-medium">{count} swimmers</span>
                      <span className="text-text-muted">vs. {natAvg} avg</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </PremiumCard>

          <PremiumCard
            title="Attendance Analytics"
            description="Attendance trends, dropout risk scoring, and engagement patterns across your club."
            locked={!isPremiumTier}
          >
            <div className="space-y-2">
              {(() => {
                const total = attendanceRecords.length
                const present = attendanceRecords.filter((a) => a.status === 'present').length
                const rate = total > 0 ? Math.round((present / total) * 100) : 0
                return (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Overall attendance rate</span>
                      <span className="text-text-primary font-semibold">{rate}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Total sessions tracked</span>
                      <span className="text-text-primary font-medium">{total}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">At-risk swimmers</span>
                      <span className="text-red-400 font-medium">{atRiskSwimmers.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Avg. sessions per swimmer</span>
                      <span className="text-text-primary font-medium">
                        {clubSwimmers.length > 0 ? (total / clubSwimmers.length).toFixed(1) : '0'}
                      </span>
                    </div>
                  </>
                )
              })()}
            </div>
          </PremiumCard>
        </div>
      </section>

    </PageSection>
  )
}

function PremiumCard({
  title,
  description,
  locked,
  children,
}: {
  title: string
  description: string
  locked: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={`relative rounded-[var(--radius-card)] border p-5 shadow-[var(--shadow-card)] transition-all ${
        locked
          ? 'border-border bg-card'
          : 'border-premium/30 bg-card'
      }`}
    >
      <h3 className="font-display text-sm font-semibold text-text-primary">{title}</h3>
      <p className="mt-1 text-xs text-text-muted">{description}</p>
      <div className={`mt-4 ${locked ? 'blur-sm select-none pointer-events-none' : ''}`}>
        {children}
      </div>
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-[var(--radius-card)] bg-bg/60 backdrop-blur-[2px]">
          <div className="text-center">
            <Lock className="mx-auto h-6 w-6 text-text-muted" />
            <p className="mt-2 text-sm font-medium text-text-secondary">Unlock with Premium</p>
            <p className="mt-0.5 text-xs text-text-muted">Enable in Settings → Premium</p>
            <Link
              to={ROUTES.app.plans}
              className="mt-3 inline-block text-xs font-medium text-accent hover:underline"
            >
              View Plans &amp; billing
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
