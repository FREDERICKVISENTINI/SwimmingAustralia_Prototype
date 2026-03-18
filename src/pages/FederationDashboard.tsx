import { useMemo, useState } from 'react'
import { PageSection } from '../components/layout/PageSection'
import { FederationMetricCard } from '../components/federation'
import { AustraliaSwimmerDensityMap } from '../components/federation/AustraliaSwimmerDensityMap'
import {
  FEDERATION_SUMMARY_METRICS,
  DEFAULT_FEDERATION_FILTERS,
  deriveFilteredMetrics,
} from '../data/federationDashboardData'
import type { FederationFilters } from '../data/federationDashboardData'
import {
  NATIONAL_PARTICIPATION_BY_STATE,
  NATIONAL_SWIMMER_TOTAL,
  HP_TALENT_SIGNALS_NATIONAL,
  DROPOUT_RISK_AGGREGATE,
  CLUB_COMPLIANCE_NATIONAL,
  PLATFORM_REVENUE_NATIONAL,
} from '../data/federationNationalDashboard'
import {
  BarChart3,
  Users,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  Wallet,
  MapPin,
  Flag,
} from 'lucide-react'

function formatAud(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`
  return `$${n}`
}

const cardClass =
  'rounded-[var(--radius-card)] border border-border/80 bg-card p-5 shadow-[var(--shadow-card)]'

export function FederationDashboard() {
  const [filters] = useState<FederationFilters>(DEFAULT_FEDERATION_FILTERS)
  const derived = useMemo(() => deriveFilteredMetrics(filters), [filters])

  const fundingPct = Math.min(
    100,
    Math.round(
      (PLATFORM_REVENUE_NATIONAL.ytdTotal / PLATFORM_REVENUE_NATIONAL.selfFundTargetAnnual) * 100
    )
  )

  return (
    <PageSection
      title="Federation dashboard"
      subtitle={
        <div className="space-y-2">
          <p>
            <strong className="font-semibold text-text-primary">National oversight.</strong> Highest-level
            view for Swimming Australia and state staff — swimmers, clubs, states, and platform revenue.
            All figures are <strong className="font-semibold text-text-primary">aggregated</strong>; no
            individual PII.
          </p>
          <p className="text-text-muted text-[0.9rem]">
            Aim: one federation view on a unified data system — registrations, meets, pathway stages,
            and club activity in one place.
          </p>
        </div>
      }
    >
      {/* Summary metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <FederationMetricCard
          label="Registered swimmers (national)"
          value={NATIONAL_SWIMMER_TOTAL.toLocaleString()}
          subtext="By state affiliation"
          icon={<Users className="h-5 w-5" />}
        />
        <FederationMetricCard
          label="New registrations (YTD)"
          value={`+${FEDERATION_SUMMARY_METRICS.newRegistrationsThisYear.toLocaleString()}`}
          subtext="YoY growth signal"
          icon={<BarChart3 className="h-5 w-5" />}
        />
        <FederationMetricCard
          label="HP talent signals"
          value={HP_TALENT_SIGNALS_NATIONAL.totalSignals.toLocaleString()}
          subtext={`${HP_TALENT_SIGNALS_NATIONAL.clubsContributing} clubs contributing`}
          icon={<Sparkles className="h-5 w-5" />}
        />
        <FederationMetricCard
          label="Platform revenue (YTD)"
          value="$xM"
          subtext={PLATFORM_REVENUE_NATIONAL.fiscalYearLabel}
          icon={<Wallet className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Participation by state */}
        <div className={cardClass}>
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-accent" />
            <h2 className="font-display text-base font-semibold text-text-primary">
              Participation by state
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                  <th className="pb-2 pr-4">State</th>
                  <th className="pb-2 pr-4 text-right">Swimmers</th>
                  <th className="pb-2 text-right">Share</th>
                </tr>
              </thead>
              <tbody>
                {NATIONAL_PARTICIPATION_BY_STATE.map((row) => (
                  <tr key={row.state} className="border-b border-border/60 last:border-0">
                    <td className="py-2.5 font-medium text-text-primary">{row.state}</td>
                    <td className="py-2.5 text-right tabular-nums text-text-secondary">
                      {row.swimmers.toLocaleString()}
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-text-muted">
                      {row.sharePct.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Map */}
        <div className={cardClass}>
          <AustraliaSwimmerDensityMap />
        </div>
      </div>

      {/* HP talent signals */}
      <div className={cardClass}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <h2 className="font-display text-base font-semibold text-text-primary">
              HP talent signals (national)
            </h2>
          </div>
          <p className="text-xs text-text-muted">
            Strongest states: {HP_TALENT_SIGNALS_NATIONAL.topStates.join(', ')}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {HP_TALENT_SIGNALS_NATIONAL.byType.map((row) => (
            <div
              key={row.label}
              className="rounded-lg border border-border/80 bg-bg px-4 py-3"
              style={{
                borderLeftWidth: 3,
                borderLeftColor:
                  row.accent === 'blue'
                    ? '#0099cc'
                    : row.accent === 'teal'
                      ? '#0d9488'
                      : row.accent === 'gold'
                        ? '#b45309'
                        : '#1a8a5c',
              }}
            >
              <p className="text-2xl font-semibold tabular-nums text-text-primary">
                {row.count.toLocaleString()}
              </p>
              <p className="mt-1 text-xs font-medium text-text-secondary leading-snug">{row.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dropout risk */}
      <div className={cardClass}>
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-premium" />
          <h2 className="font-display text-base font-semibold text-text-primary">
            Dropout risk (aggregated)
          </h2>
        </div>
        <p className="mb-4 text-sm text-text-secondary">
          Flags surfaced at <strong className="text-text-primary">state and club level</strong> for early
          intervention — cohort-level counts only.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-bg px-4 py-3">
            <p className="text-sm text-text-muted">Swimmers flagged (national)</p>
            <p className="mt-1 text-2xl font-semibold text-text-primary">
              {DROPOUT_RISK_AGGREGATE.swimmersFlaggedNational.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-bg px-4 py-3">
            <p className="text-sm text-text-muted">Clubs with at least one flag</p>
            <p className="mt-1 text-2xl font-semibold text-text-primary">
              {DROPOUT_RISK_AGGREGATE.clubsWithFlags}
            </p>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                <th className="pb-2">State</th>
                <th className="pb-2 text-right">Flagged swimmers</th>
                <th className="pb-2 text-right">Clubs</th>
              </tr>
            </thead>
            <tbody>
              {DROPOUT_RISK_AGGREGATE.byState.map((r) => (
                <tr key={r.state} className="border-b border-border/60 last:border-0">
                  <td className="py-2 font-medium text-text-primary">{r.state}</td>
                  <td className="py-2 text-right tabular-nums">{r.flagged.toLocaleString()}</td>
                  <td className="py-2 text-right tabular-nums text-text-muted">{r.clubs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Club compliance */}
      <div className={cardClass}>
        <div className="mb-4 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-success" />
          <h2 className="font-display text-base font-semibold text-text-primary">
            Club compliance (national)
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-bg px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">WWCC current</p>
            <p className="mt-1 text-2xl font-semibold text-text-primary">
              {CLUB_COMPLIANCE_NATIONAL.wwccCurrentPct.toFixed(1)}%
            </p>
          </div>
          <div className="rounded-lg border border-border bg-bg px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Accreditation</p>
            <p className="mt-1 text-2xl font-semibold text-text-primary">
              {CLUB_COMPLIANCE_NATIONAL.accreditationCurrentPct.toFixed(1)}%
            </p>
          </div>
          <div className="rounded-lg border border-border bg-bg px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Renewals (30d)</p>
            <p className="mt-1 text-2xl font-semibold text-text-primary">
              {CLUB_COMPLIANCE_NATIONAL.renewalsDue30Days}
            </p>
            <p className="text-xs text-text-muted">Due window</p>
          </div>
          <div className="rounded-lg border border-border bg-bg px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">At-risk clubs</p>
            <p className="mt-1 text-2xl font-semibold text-premium">
              {CLUB_COMPLIANCE_NATIONAL.atRiskClubs}
            </p>
            <p className="text-xs text-text-muted">WWCC / accreditation gaps</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-text-muted">
          Clubs audited YTD: {CLUB_COMPLIANCE_NATIONAL.clubsAuditedYTD} (sample-based).
        </p>
      </div>

      {/* Revenue + self-funding */}
      <div className={cardClass}>
        <div className="mb-4 flex items-center gap-2">
          <Wallet className="h-5 w-5 text-accent" />
          <h2 className="font-display text-base font-semibold text-text-primary">
            Platform revenue by stream
          </h2>
        </div>
        <p className="mb-2 text-sm text-text-secondary">
          Progress toward <strong className="text-text-primary">self-funding target</strong> (annual):{' '}
          {formatAud(PLATFORM_REVENUE_NATIONAL.selfFundTargetAnnual)}
        </p>
        <div className="mb-6">
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-text-muted">YTD vs target</span>
            <span className="font-semibold text-text-primary">{fundingPct}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-border/80">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${fundingPct}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-text-muted">
            YTD {formatAud(PLATFORM_REVENUE_NATIONAL.ytdTotal)} · illustrative prototype figures
          </p>
        </div>
        <ul className="space-y-3">
          {PLATFORM_REVENUE_NATIONAL.streams.map((s) => {
            const pct = (s.ytd / PLATFORM_REVENUE_NATIONAL.ytdTotal) * 100
            return (
              <li key={s.id}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-text-primary">{s.label}</span>
                  <span className="tabular-nums text-text-secondary">{formatAud(s.ytd)}</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-border/60">
                  <div
                    className="h-full rounded-full bg-accent/70"
                    style={{ width: `${Math.round(pct)}%` }}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="rounded-lg border border-border/80 bg-accent/5 px-4 py-3 text-sm text-text-secondary">
        <strong className="text-text-primary">Retention (pathway):</strong>{' '}
        {derived.retentionRate}% stage-to-stage ·{' '}
        <strong className="text-text-primary">National events (90d):</strong>{' '}
        {FEDERATION_SUMMARY_METRICS.upcomingNationalEvents}
      </div>
    </PageSection>
  )
}
