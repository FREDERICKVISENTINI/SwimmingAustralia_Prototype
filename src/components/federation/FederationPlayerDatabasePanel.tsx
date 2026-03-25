import { useState, type ReactNode } from 'react'
import { Eye, EyeOff, Search } from 'lucide-react'
import {
  DEMO_PLAYER_RECORD,
  PLAYER_DATABASE_DEMO_SEARCH_NAME,
  type PlayerRecord,
  type SpartaIIProfile,
} from '../../data/federationPlayerDatabaseMock'

function initials(name: string) {
  const p = name.split(/\s+/).filter(Boolean)
  if (p.length === 0) return '?'
  if (p.length === 1) return p[0].slice(0, 2).toUpperCase()
  return (p[0][0] + p[p.length - 1][0]).toUpperCase()
}

function Badge({
  children,
  tone = 'default',
}: {
  children: ReactNode
  tone?: 'default' | 'success' | 'warning' | 'danger'
}) {
  const tones = {
    default: 'bg-bg-elevated text-text-secondary ring-1 ring-border/70',
    success: 'bg-success/15 text-success',
    warning: 'bg-warning/15 text-warning',
    danger: 'bg-red-500/15 text-red-700 dark:text-red-400',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  )
}

function StatCard({
  label,
  value,
  subtext,
}: {
  label: string
  value: string | number
  subtext?: string
}) {
  return (
    <div className="rounded-[var(--radius-card)] border border-border/80 bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="text-xs uppercase tracking-[0.12em] text-text-muted">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-text-primary tabular-nums">{value}</div>
      {subtext ? <div className="mt-1 text-sm text-text-muted">{subtext}</div> : null}
    </div>
  )
}

function Section({
  title,
  children,
  right,
}: {
  title: string
  children: ReactNode
  right?: ReactNode
}) {
  return (
    <section className="rounded-[var(--radius-card)] border border-border/80 bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <h3 className="font-display text-lg font-semibold tracking-tight text-text-primary">{title}</h3>
        {right}
      </div>
      {children}
    </section>
  )
}

function InfoRow({
  label,
  value,
  full = false,
}: {
  label: string
  value: string
  full?: boolean
}) {
  return (
    <div className={`rounded-[var(--radius-card)] bg-bg-elevated/60 p-4 ${full ? 'md:col-span-2' : ''}`}>
      <div className="text-xs uppercase tracking-[0.12em] text-text-muted">{label}</div>
      <div className="mt-2 text-sm font-medium text-text-primary">{value}</div>
    </div>
  )
}

function ProgressBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-text-secondary">{label}</span>
        <span className="font-medium tabular-nums text-text-primary">{value}%</span>
      </div>
      <div className="h-3 rounded-full bg-bg-elevated">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-accent/70 to-accent"
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
    </div>
  )
}

function TrendPill({ trend }: { trend: 'up' | 'flat' | 'down' }) {
  const map = {
    up: 'bg-success/15 text-success',
    flat: 'bg-warning/15 text-warning',
    down: 'bg-red-500/15 text-red-700',
  }
  const label = { up: 'Improving', flat: 'Stable', down: 'Declining' }
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${map[trend]}`}>{label[trend]}</span>
  )
}

function SpartaReadBadge({ read }: { read: SpartaIIProfile['metrics'][number]['read'] }) {
  const styles = {
    'Above cohort': 'bg-success/15 text-success ring-1 ring-success/25',
    'On track': 'bg-bg-elevated text-text-secondary ring-1 ring-border/70',
    Monitor: 'bg-warning/15 text-warning ring-1 ring-warning/30',
  }
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[read]}`}>{read}</span>
  )
}

function SpartaIIExampleBlock({ profile }: { profile: SpartaIIProfile }) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-text-muted">Example — CEO / board view</p>
      <div className="rounded-[var(--radius-card)] border border-accent/25 bg-gradient-to-br from-accent/5 to-transparent p-4 shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">{profile.productLabel}</p>
            <p className="mt-1 text-sm text-text-secondary">
              Session {profile.sessionDate} · {profile.venue}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-text-muted">Composite</p>
            <p className="text-2xl font-semibold tabular-nums text-text-primary">{profile.compositeIndex}</p>
            <p className="text-xs text-text-muted">{profile.nationalPercentile}</p>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-text-primary">{profile.executiveHeadline}</p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-border/80">
          <table className="w-full min-w-[420px] text-sm">
            <thead>
              <tr className="border-b border-border/80 bg-bg-elevated/60 text-left text-xs uppercase tracking-wider text-text-muted">
                <th className="px-3 py-2.5">Metric</th>
                <th className="px-3 py-2.5">Result</th>
                <th className="px-3 py-2.5">Read</th>
              </tr>
            </thead>
            <tbody>
              {profile.metrics.map((row) => (
                <tr key={row.metric} className="border-b border-border/50 last:border-0">
                  <td className="px-3 py-2.5 text-text-secondary">{row.metric}</td>
                  <td className="px-3 py-2.5 font-medium tabular-nums text-text-primary">{row.value}</td>
                  <td className="px-3 py-2.5">
                    <SpartaReadBadge read={row.read} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-text-muted">
          Illustrative layout only — production would sync certified Sparta II exports and cohort norms into the national
          swimmer record.
        </p>
      </div>
    </div>
  )
}

function ActionRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-[var(--radius-card)] bg-bg-elevated/60 px-4 py-3">
      <span className="text-text-muted">{label}</span>
      <span className="text-right text-sm font-medium text-text-primary">{value}</span>
    </div>
  )
}

function PlayerDetail({ player, anonymousView }: { player: PlayerRecord; anonymousView: boolean }) {
  return (
    <>
      <div className="rounded-[var(--radius-card)] border border-border/80 bg-card p-6 shadow-[var(--shadow-card)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl text-2xl font-semibold ${
                anonymousView ? 'bg-bg-elevated text-text-muted ring-1 ring-border/80' : 'bg-accent/15 text-accent'
              }`}
              aria-hidden
            >
              {anonymousView ? '—' : initials(player.fullName)}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-2xl font-semibold tracking-tight text-text-primary">
                  {anonymousView ? (
                    <span className="font-mono text-xl">{player.memberId}</span>
                  ) : (
                    player.fullName
                  )}
                </h3>
                {player.highPotential ? <Badge tone="success">High potential</Badge> : null}
                {player.retentionPriority ? <Badge tone="warning">Retention priority</Badge> : null}
                {anonymousView ? (
                  <Badge tone="default">Anonymous preview</Badge>
                ) : null}
              </div>

              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-text-secondary">
                {!anonymousView ? <span>Member ID: {player.memberId}</span> : null}
                <span>{player.age} yrs</span>
                <span>{player.gender}</span>
                <span>{player.state}</span>
                {!anonymousView ? (
                  <>
                    <span>{player.club}</span>
                    <span>Coach: {player.coach}</span>
                  </>
                ) : null}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge>{player.currentStage}</Badge>
                <Badge tone="success">{player.percentile}</Badge>
                <Badge
                  tone={
                    player.inactivityRisk === 'Low' ? 'success' : player.inactivityRisk === 'Medium' ? 'warning' : 'danger'
                  }
                >
                  Risk: {player.inactivityRisk}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-3 lg:w-[360px]">
            <StatCard label="Attendance" value={`${player.attendanceRate}%`} />
            <StatCard label="Competition frequency" value={player.competitionFrequency} />
            <StatCard label="Progression velocity" value={player.progressionVelocity} />
            <StatCard label="Linked value" value={player.linkedValue} />
          </div>
        </div>
      </div>

      <div className="rounded-[var(--radius-card)] border border-border/80 bg-card p-5 shadow-[var(--shadow-card)]">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Geography &amp; catchment</p>
        <p className="mt-1 text-xs text-text-muted">
          {anonymousView
            ? 'Detailed location is not shown in anonymous view (demo).'
            : 'Registration / residential geo used for national mapping and regional programs (demo).'}
        </p>
        {anonymousView ? (
          <div className="mt-4">
            <InfoRow label="State / territory" value={player.state} />
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InfoRow label="Postcode" value={player.geography.postcode} />
            <InfoRow label="Suburb / locality" value={player.geography.locality} />
            <InfoRow label="SA4 (statistical area)" value={player.geography.sa4Label} />
            <InfoRow label="Metro / regional" value={player.geography.regionType} />
            <InfoRow label="Primary catchment" value={player.geography.catchmentNote} full />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <Section title="Overview" right={<Badge>{player.nextStage} next</Badge>}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {!anonymousView ? <InfoRow label="Date of birth" value={player.dob} /> : null}
              {!anonymousView ? <InfoRow label="Family account" value={player.familyAccount} /> : null}
              <InfoRow label="Current stage" value={player.currentStage} />
              <InfoRow label="Next likely stage" value={player.nextStage} />
              <InfoRow label="Club retention rate" value={player.clubRetentionRate} />
              <InfoRow label="Club progression rate" value={player.clubProgressionRate} />
              <InfoRow label="HP flag" value={player.hpFlag} full />
            </div>
          </Section>

          <Section title="Competition performance">
            <div className="overflow-hidden rounded-[var(--radius-card)] border border-border/80">
              <table className="min-w-full divide-y divide-border/80 text-sm">
                <thead className="bg-bg-elevated/80">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-text-muted">Event</th>
                    <th className="px-4 py-3 text-left font-medium text-text-muted">Best time</th>
                    <th className="px-4 py-3 text-left font-medium text-text-muted">Season best</th>
                    <th className="px-4 py-3 text-left font-medium text-text-muted">Ranking</th>
                    <th className="px-4 py-3 text-left font-medium text-text-muted">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 bg-card">
                  {player.meetResults.map((result) => (
                    <tr key={result.event}>
                      <td className="px-4 py-3 font-medium text-text-primary">{result.event}</td>
                      <td className="px-4 py-3 text-text-secondary">{result.bestTime}</td>
                      <td className="px-4 py-3 text-text-secondary">{result.seasonBest}</td>
                      <td className="px-4 py-3 text-text-secondary">{result.ranking}</td>
                      <td className="px-4 py-3">
                        <TrendPill trend={result.trend} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Pathway progression">
            <div className="space-y-4">
              {player.progression.map((stage, index) => (
                <div key={stage.stage} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-4 w-4 rounded-full ${stage.status === 'current' ? 'bg-accent' : 'bg-border'}`}
                    />
                    {index !== player.progression.length - 1 ? (
                      <div className="mt-1 h-full min-h-[1.5rem] w-px bg-border" />
                    ) : null}
                  </div>

                  <div className="pb-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-text-primary">{stage.stage}</span>
                      {stage.status === 'current' ? <Badge tone="success">Current</Badge> : null}
                    </div>
                    <div className="mt-1 text-sm text-text-muted">
                      Entered {stage.enteredAt} • Duration {stage.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Engagement & retention">
            <div className="space-y-4">
              <ProgressBar label="Attendance rate" value={player.attendanceRate} />
              <ProgressBar label="Retention score" value={88} />
              <ProgressBar label="Progression strength" value={84} />
              <ProgressBar label="Elite readiness" value={71} />
            </div>
          </Section>

          <Section
            title="Sparta II & talent context"
            right={
              <span className="rounded-full bg-bg-elevated px-2.5 py-1 text-xs font-medium text-text-muted ring-1 ring-border/70">
                Demo
              </span>
            }
          >
            <p className="mb-4 text-sm text-text-secondary">
              How <strong className="font-medium text-text-primary">Sparta II</strong> physical profiling could appear on
              the national system — structured for executive briefings
              {!anonymousView ? ' alongside coach and HP notes' : ''}.
            </p>
            <SpartaIIExampleBlock profile={player.spartaII} />
            {!anonymousView ? (
              <div className="mt-6 border-t border-border/60 pt-5">
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">Coach & HP notes</h4>
                <div className="space-y-3">
                  {player.coachNotes.map((note) => (
                    <div
                      key={note}
                      className="rounded-[var(--radius-card)] bg-bg-elevated/60 px-4 py-3 text-sm text-text-secondary"
                    >
                      {note}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="mt-6 border-t border-border/60 pt-5 text-sm text-text-muted">
                Coach-written notes are not shown in anonymous view.
              </p>
            )}
          </Section>

          <Section title="National program snapshot">
            <div className="space-y-3 text-sm text-text-secondary">
              <ActionRow label="Retention priority" value="Yes — maintain in system" />
              <ActionRow label="HP review recommended" value="Next 60 days" />
              <ActionRow label="Club environment risk" value="Low" />
              <ActionRow label="Intervention required" value="No immediate concern" />
            </div>
          </Section>
        </div>
      </div>
    </>
  )
}

export function FederationPlayerDatabasePanel() {
  const [demoProfileLoaded, setDemoProfileLoaded] = useState(false)
  const [anonymousView, setAnonymousView] = useState(false)

  const visible = demoProfileLoaded ? DEMO_PLAYER_RECORD : null

  return (
    <div className="space-y-6">
      <div className="rounded-[var(--radius-card)] border border-border/80 bg-card p-4 shadow-[var(--shadow-card)] md:p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <p className="text-sm text-text-secondary">
                National swimmer profile — pathway, performance, and retention signals (demo). One seeded record for
                testing.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDemoProfileLoaded(true)}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[var(--radius-button)] border border-border bg-bg-elevated px-4 py-2.5 text-sm font-semibold text-text-primary shadow-sm transition hover:border-accent/40 hover:bg-accent/5"
              aria-label={`Load demo profile for ${PLAYER_DATABASE_DEMO_SEARCH_NAME}`}
            >
              <Search className="h-4 w-4 shrink-0 text-text-muted" aria-hidden />
              Search {PLAYER_DATABASE_DEMO_SEARCH_NAME}
            </button>
          </div>

          <div className="flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Privacy preview</p>
              <p className="mt-1 text-sm text-text-secondary">
                <strong className="font-medium text-text-primary">Anonymous view</strong> shows the record keyed by{' '}
                <span className="font-mono text-text-primary">member ID</span> only — coach name, family account, coach
                notes, DOB, and detailed geography are hidden; linked value remains visible as a benchmark metric (demo).
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={anonymousView}
              onClick={() => setAnonymousView((v) => !v)}
              className={`flex shrink-0 items-center gap-2 rounded-[var(--radius-button)] border px-4 py-2.5 text-sm font-semibold transition ${
                anonymousView
                  ? 'border-accent/40 bg-accent/10 text-accent'
                  : 'border-border bg-bg-elevated text-text-secondary hover:text-text-primary'
              }`}
            >
              {anonymousView ? <EyeOff className="h-4 w-4 shrink-0" aria-hidden /> : <Eye className="h-4 w-4 shrink-0" aria-hidden />}
              {anonymousView ? 'Anonymous on' : 'Anonymous off'}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {visible ? (
          <PlayerDetail player={visible} anonymousView={anonymousView} />
        ) : (
          <div className="rounded-[var(--radius-card)] border border-border/80 bg-card p-4 shadow-[var(--shadow-card)]">
            <p className="text-sm text-text-secondary">
              Click <strong className="font-medium text-text-primary">Search {PLAYER_DATABASE_DEMO_SEARCH_NAME}</strong> above
              to load the seeded demo profile.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
