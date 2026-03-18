import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import type { TeamProfile } from '../context/AppContext'
import { PageSection } from '../components/layout/PageSection'
import { ClubMetricCard, QuickActionPanel } from '../components/club'
import { PATHWAY_STAGES } from '../theme/tokens'
import { ROUTES } from '../routes'
import { AlertTriangle } from 'lucide-react'

const ORG_TYPE_LABELS: Record<TeamProfile['organisationType'], string> = {
  club: 'Club',
  'swim school': 'Swim school',
  'squad program': 'Squad program',
  'state program': 'State program',
}

export function ClubDashboard() {
  const { teamProfile, clubClasses, clubSwimmers, clubPayments, clubStatUploads, isPremiumTier } = useApp()
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

  // At-risk detection (club only): no stats in 30+ days OR overdue payment
  const atRiskSwimmers = useMemo(() => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return clubSwimmers.filter((s) => {
      const noRecentStat = !s.latestStatDate || new Date(s.latestStatDate) < thirtyDaysAgo
      const paymentIssue = s.paymentStatus === 'overdue'
      return noRecentStat || paymentIssue
    })
  }, [clubSwimmers])

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
        <ClubMetricCard label="Recent stat uploads" value={clubStatUploads.length} subtext="This period" to={ROUTES.app.insights} />
      </div>

      <QuickActionPanel
        actions={[
          { label: 'Create class', onClick: () => navigate(ROUTES.app.classes) },
          { label: 'Add swimmer', onClick: () => navigate(ROUTES.app.swimmers) },
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

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
            Upcoming activity
          </h3>
          <p className="mt-3 text-sm text-text-secondary">
            Sessions and events from your classes appear here. Link your calendar for full view.
          </p>
          <p className="mt-2 text-xs text-text-muted">Next: Junior Squad A · Tue 5:00 pm</p>
        </div>
        <div className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
            Recent uploads
          </h3>
          {recentUploads.length === 0 ? (
            <p className="mt-3 text-sm text-text-muted">No stats uploaded yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {recentUploads.map((u) => (
                <li key={u.id} className="flex justify-between text-sm">
                  <span className="text-text-primary">{u.swimmerName}</span>
                  <span className="text-text-secondary">{u.eventMetric} {u.value}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-[var(--radius-card)] border border-success/30 bg-card p-5 shadow-[var(--shadow-card)]">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
          Club pathway support
        </h3>
        <p className="mt-2 text-sm text-text-secondary">
          Use Classes, Swimmers, and Stats to manage development across the pathway. Upload times and observations to keep progression visible for athletes and parents.
        </p>
      </div>

      {isPremiumTier && (
        <div className="space-y-6 mt-8 pt-8 border-t border-border/80">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
            Premium features
          </h3>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[var(--radius-card)] border border-premium/30 bg-card p-5 shadow-[var(--shadow-card)]">
              <h4 className="font-display text-sm font-semibold text-text-primary">National Benchmarking</h4>
              <p className="mt-2 text-sm text-text-secondary">
                Compare your swimmers to state and national averages. Your club has {totalSwimmers} swimmers; state median for similar clubs is ~95.
              </p>
              <p className="mt-2 text-xs text-text-muted">Based on existing pathway and registration data.</p>
            </div>
            <div className="rounded-[var(--radius-card)] border border-premium/30 bg-card p-5 shadow-[var(--shadow-card)]">
              <h4 className="font-display text-sm font-semibold text-text-primary">Performance Insights</h4>
              <p className="mt-2 text-sm text-text-secondary">
                Swimmer improvement trends and progression from your uploaded results. {clubStatUploads.length} uploads this period feed into trend views.
              </p>
              <p className="mt-2 text-xs text-text-muted">Uses your existing stats and event data.</p>
            </div>
            <div className="rounded-[var(--radius-card)] border border-premium/30 bg-card p-5 shadow-[var(--shadow-card)]">
              <h4 className="font-display text-sm font-semibold text-text-primary">Club Analytics</h4>
              <p className="mt-2 text-sm text-text-secondary">
                Retention trends and athlete progression visibility by pathway stage and class. {activeClasses} active classes, {totalSwimmers} swimmers across pathway stages.
              </p>
              <p className="mt-2 text-xs text-text-muted">Derived from classes, swimmers, and pathway data.</p>
            </div>
            <div className="rounded-[var(--radius-card)] border border-premium/30 bg-card p-5 shadow-[var(--shadow-card)]">
              <h4 className="font-display text-sm font-semibold text-text-primary">Advanced Reports</h4>
              <p className="mt-2 text-sm text-text-secondary">
                Downloadable parent and coach reports: progression summaries, attendance, and performance snapshots from your existing data.
              </p>
              <p className="mt-2 text-xs text-text-muted">Export available for current term.</p>
            </div>
          </div>

          <div className="rounded-[var(--radius-card)] border border-premium/30 bg-premium/5 p-5 shadow-[var(--shadow-card)]">
            <h4 className="font-display text-sm font-semibold text-premium">Federation Visibility</h4>
            <p className="mt-2 text-sm text-text-secondary">
              Your club is eligible for broader pathway insights and state/national program visibility when you use Premium. Data is shared in line with pathway reporting so athletes can be considered for development opportunities.
            </p>
          </div>
        </div>
      )}
    </PageSection>
  )
}
