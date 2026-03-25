import {
  PATHWAY_FUNNEL_STAGES,
  pathwayFunnelConversions,
  RETENTION_OVERALL_PCT,
  RETENTION_BY_AGE,
  PROGRESSION_WINDOW,
  PROGRESSION_BENCHMARK,
  HIGH_VALUE_SWIMMERS,
  PIPELINE_DEPTH,
  PARTICIPATION_VOLUME,
} from '../../data/systemHealthPathwayMetrics'
import { DashboardSection } from './DashboardSection'

export function SystemHealthPathwayPanel() {
  const { rows: funnelRows, largestDrop } = pathwayFunnelConversions()

  return (
    <div className="space-y-8">
      <div className="rounded-[var(--radius-card)] border border-border/80 bg-card p-5 shadow-[var(--shadow-card)]">
        <h2 className="text-sm font-semibold text-text-primary">What this view is for</h2>
        <p className="mt-2 text-sm text-text-secondary leading-relaxed">
          System Health translates the Swimming Australia <strong className="font-medium text-text-primary">pre-read</strong>{' '}
          into operational pathway questions: dropout, progression, retention risk, and pipeline strength. Figures below are{' '}
          <strong className="font-medium text-text-primary">structured demo outputs</strong> — in production they would be
          powered by a unified national registry, timestamped stage transitions, longitudinal activity, and meet/HP signals.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-text-muted">
          <li>Stage history → funnel conversion and largest drop-off between L2S → … → Elite.</li>
          <li>Year-on-year active status → retention overall and by age band.</li>
          <li>Progression events → actual vs expected movement velocity.</li>
          <li>Results + HP indicators → a retain-first list of high-value swimmers.</li>
        </ul>
      </div>

      <DashboardSection title="1. Pathway funnel">
        <p className="text-sm text-text-muted mb-4 max-w-3xl">
          Counts at each stage and conversion to the next. Largest drop-off:{' '}
          <strong className="text-warning">{largestDrop.from} → {largestDrop.to}</strong> ({largestDrop.conversionPct}% conversion).
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {PATHWAY_FUNNEL_STAGES.map((s) => (
            <div
              key={s.id}
              className="rounded-[var(--radius-card)] border border-border/80 bg-bg-elevated/40 p-4 text-center"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-text-muted">{s.label}</p>
              <p className="mt-1 text-xl font-semibold tabular-nums text-text-primary">{s.count.toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 overflow-x-auto rounded-lg border border-border/80">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-border/80 bg-bg-elevated/50 text-left text-xs uppercase tracking-wider text-text-muted">
                <th className="px-4 py-3">Transition</th>
                <th className="px-4 py-3 text-right">Conversion</th>
              </tr>
            </thead>
            <tbody>
              {funnelRows.map((r) => {
                const isWorst =
                  r.from === largestDrop.from && r.to === largestDrop.to
                return (
                  <tr
                    key={`${r.from}-${r.to}`}
                    className={`border-b border-border/50 last:border-0 ${isWorst ? 'bg-warning/10' : ''}`}
                  >
                    <td className="px-4 py-3 text-text-secondary">
                      {r.from} → {r.to}
                      {isWorst ? (
                        <span className="ml-2 text-xs font-medium text-warning">Largest drop-off</span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums text-text-primary">
                      {r.conversionPct}%
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </DashboardSection>

      <DashboardSection title="2. Retention rate">
        <p className="text-sm text-text-muted mb-4">
          Share of swimmers active year-on-year. Highest structural risk in demo data:{' '}
          <strong className="text-text-primary">8–12</strong> age band.
        </p>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-[var(--radius-card)] border border-border/80 bg-card p-4 shadow-[var(--shadow-card)]">
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Overall YOY</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums text-accent">{RETENTION_OVERALL_PCT}%</p>
          </div>
          <div className="lg:col-span-2 overflow-x-auto rounded-lg border border-border/80">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/80 bg-bg-elevated/50 text-left text-xs uppercase tracking-wider text-text-muted">
                  <th className="px-4 py-3">Age cohort</th>
                  <th className="px-4 py-3 text-right">Retention</th>
                  <th className="px-4 py-3">Risk</th>
                </tr>
              </thead>
              <tbody>
                {RETENTION_BY_AGE.map((row) => (
                  <tr key={row.band} className="border-b border-border/50 last:border-0">
                    <td className="px-4 py-3 text-text-secondary">{row.band}</td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums">{row.pct}%</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          row.risk === 'high'
                            ? 'text-warning font-medium'
                            : row.risk === 'low'
                              ? 'text-success'
                              : 'text-text-muted'
                        }
                      >
                        {row.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardSection>

      <DashboardSection title="3. Progression rate">
        <p className="text-sm text-text-muted mb-4 max-w-2xl">
          Window: <strong className="text-text-primary">{PROGRESSION_WINDOW}</strong>. Compare share moving up at least one
          pathway stage vs national cohort expectation.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-[var(--radius-card)] border border-border/80 bg-card p-4 shadow-[var(--shadow-card)]">
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Expected (benchmark)</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-black">{PROGRESSION_BENCHMARK.expectedPct}%</p>
          </div>
          <div className="rounded-[var(--radius-card)] border border-border/80 bg-card p-4 shadow-[var(--shadow-card)]">
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Actual</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-accent">{PROGRESSION_BENCHMARK.actualPct}%</p>
          </div>
          <div className="rounded-[var(--radius-card)] border border-warning/30 bg-warning/5 p-4 sm:col-span-2 lg:col-span-1">
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Read</p>
            <p className="mt-1 text-sm text-text-secondary">{PROGRESSION_BENCHMARK.note}</p>
          </div>
        </div>
      </DashboardSection>

      <DashboardSection title="4. High-value swimmers (retention priority)">
        <p className="text-sm text-text-muted mb-4">
          Top performers by combined meet trajectory and HP-style signals — the retain-first cohort for federations and clubs.
          Swimmers are surfaced when that strength overlaps <strong className="font-medium text-text-primary">engagement gaps</strong>{' '}
          the system can see: for example, no sanctioned meet times logged in 90+ days, or club training attendance below
          expected over the last block — so they are flagged for proactive contact before silent dropout, not only for raw talent.
        </p>
        <div className="overflow-x-auto rounded-lg border border-border/80">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border/80 bg-bg-elevated/50 text-left text-xs uppercase tracking-wider text-text-muted">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Swimmer</th>
                <th className="px-4 py-3">Age</th>
                <th className="px-4 py-3">Club</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Signal</th>
              </tr>
            </thead>
            <tbody>
              {HIGH_VALUE_SWIMMERS.map((s) => (
                <tr key={s.id} className="border-b border-border/50 last:border-0 hover:bg-bg-elevated/30">
                  <td className="px-4 py-3 text-text-muted">{s.priority}</td>
                  <td className="px-4 py-3 font-medium text-text-primary">{s.name}</td>
                  <td className="px-4 py-3 tabular-nums">{s.age}</td>
                  <td className="px-4 py-3 text-text-secondary">{s.club}</td>
                  <td className="px-4 py-3">{s.state}</td>
                  <td className="px-4 py-3 text-text-secondary max-w-xs">{s.signal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardSection>

      <DashboardSection title="5. Pipeline depth (late pathway)">
        <p className="text-sm text-text-muted mb-4">
          Population in upper stages — proxy for strength of the future elite pool (demo trend: +{PIPELINE_DEPTH.yoyChangePct}% YoY).
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[var(--radius-card)] border border-border/80 bg-card p-4 shadow-[var(--shadow-card)]">
            <p className="text-xs text-text-muted">State</p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-black">{PIPELINE_DEPTH.stateCount.toLocaleString()}</p>
          </div>
          <div className="rounded-[var(--radius-card)] border border-border/80 bg-card p-4 shadow-[var(--shadow-card)]">
            <p className="text-xs text-text-muted">Elite</p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-black">{PIPELINE_DEPTH.eliteCount.toLocaleString()}</p>
          </div>
          <div className="rounded-[var(--radius-card)] border border-accent/25 bg-accent/5 p-4 sm:col-span-3 lg:col-span-1">
            <p className="text-xs text-text-muted">Combined (State + Elite)</p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-accent">{PIPELINE_DEPTH.combined.toLocaleString()}</p>
          </div>
        </div>
      </DashboardSection>

      <DashboardSection title="6. Participation volume">
        <p className="text-sm text-text-muted mb-4">
          National active swimmers and how they distribute across pathway stages (same stage definitions as the funnel).
        </p>
        <div className="rounded-[var(--radius-card)] border border-border/80 bg-card p-4 shadow-[var(--shadow-card)] mb-4">
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Total active (national)</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums text-text-primary">
            {PARTICIPATION_VOLUME.totalActive.toLocaleString()}
          </p>
        </div>
        <ul className="space-y-3">
          {PARTICIPATION_VOLUME.byStage.map((row) => (
            <li key={row.label} className="flex items-center gap-3 text-sm">
              <span className="w-16 shrink-0 text-text-secondary">{row.label}</span>
              <div className="flex-1 h-2 rounded-full bg-bg-elevated overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent/35"
                  style={{ width: `${Math.min(100, row.pct)}%` }}
                />
              </div>
              <span className="w-24 text-right text-text-muted tabular-nums">
                {row.count.toLocaleString()} <span className="text-text-secondary">({row.pct}%)</span>
              </span>
            </li>
          ))}
        </ul>
      </DashboardSection>
    </div>
  )
}
