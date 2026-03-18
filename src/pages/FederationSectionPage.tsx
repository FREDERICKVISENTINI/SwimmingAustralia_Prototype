import { useState, useMemo, useCallback } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { PageSection } from '../components/layout/PageSection'
import {
  DashboardSection,
  InsightTable,
  LeaderboardCard,
  HeatmapPlaceholder,
  FunnelChartPlaceholder,
  TrendCard,
  SummaryBadge,
  FilterBar,
} from '../components/federation'
import {
  DEFAULT_FEDERATION_FILTERS,
  PARTICIPATION_METRICS,
  AGE_GROUP_DISTRIBUTION,
  GENDER_DISTRIBUTION,
  STAGE_RETENTION,
  TALENT_LEADERBOARD,
  TALENT_SUMMARY,
  PATHWAY_FUNNEL,
  CONVERSION_SUMMARY,
  CLUB_PERFORMANCE_SUMMARY,
  EVENT_ANALYTICS,
  NATIONAL_RANKINGS_PREVIEW,
  PATHWAY_STAGE_DISTRIBUTION_COMMERCIAL,
  SPONSORSHIP_SUMMARY,
  EMERGING_ATHLETES,
  deriveFilteredMetrics,
} from '../data/federationDashboardData'
import type { FederationFilters } from '../data/federationDashboardData'
import { FEDERATION_DATA_INTELLIGENCE_RECOMMENDATIONS } from '../data/insightsContent'
import {
  FEDERATION_SECTIONS,
  isFederationSectionId,
  type FederationSectionId,
} from '../data/federationSections'
import { ROUTES } from '../routes'
import { Award } from 'lucide-react'

export function FederationSectionPage() {
  const { sectionId } = useParams<{ sectionId: string }>()
  const [filtersBySection, setFiltersBySection] = useState<
    Partial<Record<FederationSectionId, FederationFilters>>
  >({})

  const validSectionId =
    sectionId && isFederationSectionId(sectionId) ? sectionId : null

  const filters = useMemo((): FederationFilters => {
    if (!validSectionId) return DEFAULT_FEDERATION_FILTERS
    return filtersBySection[validSectionId] ?? DEFAULT_FEDERATION_FILTERS
  }, [validSectionId, filtersBySection])

  const derived = useMemo(() => deriveFilteredMetrics(filters), [filters])

  const onFilterChange = useCallback((key: keyof FederationFilters, value: string) => {
    setFiltersBySection((prev) => {
      const id = sectionId
      if (!id || !isFederationSectionId(id)) return prev
      const current = prev[id] ?? DEFAULT_FEDERATION_FILTERS
      return { ...prev, [id]: { ...current, [key]: value } }
    })
  }, [sectionId])

  const talentColumns = useMemo(
    () => [
      { key: 'name', header: 'Athlete' },
      { key: 'club', header: 'Club' },
      { key: 'age', header: 'Age' },
      { key: 'stroke', header: 'Stroke' },
      {
        key: 'improvement',
        header: 'PB improvement (90d)',
        render: (row: (typeof EMERGING_ATHLETES)[number]) => (
          <span className="text-success">+{row.improvement}%</span>
        ),
      },
      {
        key: 'flag',
        header: 'Flag',
        render: (row: (typeof EMERGING_ATHLETES)[number]) =>
          row.flag ? <SummaryBadge variant="accent">Talent</SummaryBadge> : '—',
      },
    ],
    []
  )

  if (!validSectionId) {
    return <Navigate to={ROUTES.app.federationDashboard} replace />
  }

  const section = FEDERATION_SECTIONS.find((s) => s.id === validSectionId)!

  return (
    <PageSection title={section.label}>
      <p className="text-sm text-text-muted -mt-2 mb-4">
        <Link to={ROUTES.app.federationDashboard} className="text-accent hover:underline">
          ← Federation dashboard
        </Link>
      </p>

      <FilterBar filters={filters} onFilterChange={onFilterChange} />

      <div className="mt-6">
        {validSectionId === 'participation-growth' && (
          <DashboardSection
            title="Participation & Growth"
            subtitle="Track the overall health and growth of swimming nationally."
          >
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <TrendCard
                    label="Total registered"
                    value={derived.total.toLocaleString()}
                    trend="up"
                    subtext={derived.isFiltered ? 'Filtered view' : `+${PARTICIPATION_METRICS.yoyGrowth}% YoY`}
                  />
                  <TrendCard label="Club membership" value={Math.round(derived.total * 0.62).toLocaleString()} />
                  <div className="rounded-[var(--radius-card)] border border-border/80 bg-card p-4 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]">
                    <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                      Pathway retention (stages)
                    </p>
                    <div className="mt-2 space-y-2">
                      {STAGE_RETENTION.map((row) => (
                        <div key={`${row.from}-${row.to}`} className="text-xs">
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="text-text-secondary">
                              {row.from} → {row.to}
                            </span>
                            <span className="font-medium text-text-primary tabular-nums">
                              {row.rate}%
                            </span>
                          </div>
                          <div className="mt-1 h-1.5 rounded-full bg-border/60">
                            <div
                              className="h-full rounded-full bg-success"
                              style={{ width: `${row.rate}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <HeatmapPlaceholder title="National participation heat map" />
              </div>
              <div className="space-y-4">
                <div className="rounded-[var(--radius-card)] border border-border/80 bg-card p-4 shadow-[var(--shadow-card)]">
                  <h3 className="text-sm font-semibold text-text-primary mb-3">Age group distribution</h3>
                  <ul className="space-y-2">
                    {AGE_GROUP_DISTRIBUTION.map((row) => (
                      <li key={row.label} className="flex justify-between text-sm">
                        <span className="text-text-secondary">{row.label}</span>
                        <span className="text-text-muted">{row.pct}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[var(--radius-card)] border border-border/80 bg-card p-4 shadow-[var(--shadow-card)]">
                  <h3 className="text-sm font-semibold text-text-primary mb-3">Gender distribution</h3>
                  <ul className="space-y-2">
                    {GENDER_DISTRIBUTION.map((row) => (
                      <li key={row.label} className="flex justify-between text-sm">
                        <span className="text-text-secondary">{row.label}</span>
                        <span className="text-text-muted">{row.pct}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[var(--radius-card)] border border-border/80 bg-card p-4 shadow-[var(--shadow-card)]">
                  <h3 className="text-sm font-semibold text-text-primary mb-3">Regional participation</h3>
                  <ul className="space-y-2">
                    {derived.filteredRegions.slice(0, 5).map((row) => (
                      <li key={row.region} className="flex justify-between text-sm">
                        <span className="text-text-secondary">{row.region}</span>
                        <span className="text-text-muted">{row.count.toLocaleString()} ({row.pct}%)</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {STAGE_RETENTION.map((row) => (
                <TrendCard
                  key={row.from}
                  label={`${row.from} → ${row.to}`}
                  value={`${row.rate}%`}
                  subtext="conversion"
                />
              ))}
            </div>
          </DashboardSection>
        )}

        {validSectionId === 'talent-identification' && (
          <DashboardSection
            title="Talent Identification"
            subtitle="Identify emerging high-potential swimmers earlier."
          >
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <InsightTable
                  columns={talentColumns}
                  // filteredAthletes is derived from EMERGING_ATHLETES with filters applied.
                  // Cast keeps the table happy without over-tight typing.
                  data={derived.filteredAthletes as any}
                  emptyMessage="No emerging athletes"
                />
              </div>
              <div className="space-y-4">
                <LeaderboardCard title="Top performance improvers (90d)" rows={TALENT_LEADERBOARD} />
                <div className="rounded-[var(--radius-card)] border border-border/80 bg-card p-4 shadow-[var(--shadow-card)]">
                  <h3 className="text-sm font-semibold text-text-primary mb-2">Talent summary</h3>
                  <p className="text-2xl font-display font-semibold text-accent">{derived.talentFlaggedCount.toLocaleString()}</p>
                  <p className="text-xs text-text-muted">Flagged athletes</p>
                  <p className="mt-2 text-sm text-text-secondary">
                    {TALENT_SUMMARY.vsNationalAvg}× national average improvement
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {TALENT_SUMMARY.topStrokes.map((s) => (
                      <SummaryBadge key={s} variant="accent">{s}</SummaryBadge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </DashboardSection>
        )}

        {validSectionId === 'performance-pipeline' && (
          <DashboardSection
            title="Performance Pipeline"
            subtitle="Track how swimmers progress through the national pathway."
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <FunnelChartPlaceholder stages={PATHWAY_FUNNEL} title="Pathway funnel" />
              <div className="space-y-4">
                {CONVERSION_SUMMARY.map((row) => (
                  <TrendCard
                    key={row.label}
                    label={row.label}
                    value={`${row.rate}%`}
                    trend={row.trend}
                    subtext="conversion rate"
                  />
                ))}
              </div>
            </div>
          </DashboardSection>
        )}

        {validSectionId === 'club-performance' && (
          <DashboardSection
            title="Club Performance"
            subtitle="Understand which clubs are developing and retaining athletes most effectively."
          >
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="overflow-x-auto rounded-lg border border-border/80 bg-card">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/80 bg-bg-elevated/50">
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">#</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">Club</th>
                        <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-muted">Retention</th>
                        <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-muted">Improvement</th>
                        <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-muted">Progression</th>
                      </tr>
                    </thead>
                    <tbody>
                      {derived.filteredClubs.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-6 text-center text-sm text-text-muted">No clubs match the current filters.</td>
                        </tr>
                      ) : (
                        derived.filteredClubs.map((row) => (
                          <tr key={row.name} className="border-b border-border/50 last:border-0 hover:bg-bg-elevated/30">
                            <td className="px-4 py-3 text-text-muted">{row.rank}</td>
                            <td className="px-4 py-3 font-medium text-text-primary">{row.name}</td>
                            <td className="px-4 py-3 text-right text-success">{row.retention}%</td>
                            <td className="px-4 py-3 text-right text-accent">+{row.improvement}%</td>
                            <td className="px-4 py-3 text-right text-text-secondary">{row.progression}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="space-y-3">
                <TrendCard label="Avg club retention" value={`${CLUB_PERFORMANCE_SUMMARY.avgRetention}%`} />
                <TrendCard label="Avg improvement" value={`+${CLUB_PERFORMANCE_SUMMARY.avgImprovement}%`} />
                <TrendCard label="Top clubs progression" value={CLUB_PERFORMANCE_SUMMARY.topClubsProgression} subtext="to higher stages" />
              </div>
            </div>
          </DashboardSection>
        )}

        {validSectionId === 'national-event-analytics' && (
          <DashboardSection
            title="National Event Analytics"
            subtitle="Monitor competition participation and performance trends nationally."
          >
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:col-span-3">
                <TrendCard label="Meets this year" value={EVENT_ANALYTICS.meetsThisYear} />
                <TrendCard label="Avg participation / meet" value={EVENT_ANALYTICS.avgParticipationPerMeet} />
                <TrendCard label="Qualification rate" value={`${EVENT_ANALYTICS.qualificationRate}%`} />
                <TrendCard label="PB improvement rate" value={`${EVENT_ANALYTICS.pbImprovementRate}%`} trend="up" />
              </div>
              <div className="lg:col-span-2">
                <div className="rounded-[var(--radius-card)] border border-border/80 bg-card p-5 shadow-[var(--shadow-card)]">
                  <h3 className="text-sm font-semibold text-text-primary mb-3">Participation by meet level</h3>
                  <ul className="space-y-2">
                    {derived.filteredMeetLevels.map((row) => (
                      <li key={row.level} className="flex items-center gap-3">
                        <span className="w-20 text-sm text-text-secondary">{row.level}</span>
                        <div className="flex-1 h-6 rounded bg-bg-elevated/80 overflow-hidden">
                          <div
                            className="h-full rounded bg-accent/30"
                            style={{ width: `${row.pct}%` }}
                          />
                        </div>
                        <span className="text-sm text-text-muted w-16 text-right">{row.count.toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <div className="rounded-[var(--radius-card)] border border-border/80 bg-card p-5 shadow-[var(--shadow-card)]">
                  <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Award className="h-4 w-4 text-premium" />
                    National rankings preview
                  </h3>
                  <ul className="space-y-2">
                    {NATIONAL_RANKINGS_PREVIEW.map((row) => (
                      <li key={row.rank} className="flex items-center justify-between gap-2 text-sm">
                        <span className="text-text-muted w-5">{row.rank}</span>
                        <span className="text-text-primary font-medium truncate">{row.name}</span>
                        <span className="text-accent shrink-0">{row.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </DashboardSection>
        )}

        {validSectionId === 'commercial-sponsorship' && (
          <DashboardSection
            title="Commercial & Sponsorship Insights"
            subtitle="Data that supports funding, partnerships, sponsor value, and platform revenue."
          >
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="space-y-3">
                {SPONSORSHIP_SUMMARY.map((row) => (
                  <div
                    key={row.label}
                    className={`rounded-[var(--radius-card)] border p-4 ${
                      row.highlight ? 'border-premium/40 bg-premium/5' : 'border-border/80 bg-card'
                    } shadow-[var(--shadow-card)]`}
                  >
                    <p className="text-xs font-medium uppercase tracking-wider text-text-muted">{row.label}</p>
                    <p className={`mt-1 text-xl font-semibold ${row.highlight ? 'text-premium' : 'text-text-primary'}`}>
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="lg:col-span-2">
                <div className="rounded-[var(--radius-card)] border border-border/80 bg-card p-5 shadow-[var(--shadow-card)]">
                  <h3 className="text-sm font-semibold text-text-primary mb-3">Pathway stage distribution (commercial reach)</h3>
                  <ul className="space-y-2">
                    {PATHWAY_STAGE_DISTRIBUTION_COMMERCIAL.map((row) => (
                      <li key={row.stage} className="flex items-center gap-3">
                        <span className="w-36 text-sm text-text-secondary">{row.stage}</span>
                        <div className="flex-1 h-5 rounded bg-bg-elevated/80 overflow-hidden">
                          <div
                            className="h-full rounded bg-premium/30"
                            style={{ width: `${row.pct}%` }}
                          />
                        </div>
                        <span className="text-sm text-text-muted w-10 text-right">{row.pct}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="mt-4 text-sm text-text-muted">
                  National oversight of participation, talent, progression, and club performance in one view—supporting federation reporting and sponsor conversations.
                </p>
              </div>
            </div>
            <div className="mt-6 rounded-[var(--radius-card)] border border-border/80 bg-bg-elevated/50 p-5 shadow-[var(--shadow-card)]">
              <h3 className="text-sm font-semibold text-text-primary mb-3">Platform revenue</h3>
              <p className="text-xs text-text-muted mb-4">
                Revenue mix evolution: club base, Club Premium upsell, federation analytics, and member payments.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-border/60 bg-card p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-premium">B2B — Clubs</p>
                  <p className="mt-1 font-medium text-text-primary">Club Premium</p>
                  <p className="mt-1 text-sm text-text-secondary">
                    Benchmarking, performance insights, club analytics, and advanced reports. Clubs get federation visibility and retention tools; platform gains ARPU and retention.
                  </p>
                </div>
                <div className="rounded-lg border border-border/60 bg-card p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-accent">B2C — Members / parents</p>
                  <p className="mt-1 font-medium text-text-primary">Payments & reports</p>
                  <p className="mt-1 text-sm text-text-secondary">
                    Fees paid through the platform (term, assessments). Optional member premium and pathway readiness reports. New revenue slice from convenience and value-add.
                  </p>
                </div>
              </div>
            </div>
          </DashboardSection>
        )}

        {FEDERATION_DATA_INTELLIGENCE_RECOMMENDATIONS[validSectionId].length > 0 && (
          <div className="mt-8 rounded-[var(--radius-card)] border border-border/80 bg-card/60 p-5 shadow-[var(--shadow-card)]">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted mb-4">
              Data & intelligence
            </h3>
            <ul className="space-y-4">
              {FEDERATION_DATA_INTELLIGENCE_RECOMMENDATIONS[validSectionId].map((item) => (
                <li key={item.title}>
                  <p className="text-sm font-semibold text-text-primary">{item.title}</p>
                  <p className="mt-1 text-sm text-text-secondary leading-relaxed">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </PageSection>
  )
}
