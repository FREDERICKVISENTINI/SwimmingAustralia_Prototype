import { useState, type ReactNode } from 'react'
import { Building2, Eye, EyeOff, Search, ShieldCheck } from 'lucide-react'
import {
  CLUB_DATABASE_DEMO_SEARCH_NAME,
  DEMO_CLUB_RECORD,
  type ClubRecord,
} from '../../data/federationClubDatabaseMock'

function initials(name: string) {
  const w = name.split(/\s+/).filter(Boolean)
  if (w.length === 0) return '?'
  if (w.length === 1) return w[0].slice(0, 2).toUpperCase()
  return (w[0][0] + w[w.length - 1][0]).toUpperCase()
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

function ActionRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-[var(--radius-card)] bg-bg-elevated/60 px-4 py-3">
      <span className="text-text-muted">{label}</span>
      <span className="text-right text-sm font-medium text-text-primary">{value}</span>
    </div>
  )
}

function complianceTone(status: ClubRecord['complianceStatus']): 'success' | 'warning' | 'danger' {
  if (status === 'Green') return 'success'
  if (status === 'Amber') return 'warning'
  return 'danger'
}

function ClubDetail({ club, anonymousView }: { club: ClubRecord; anonymousView: boolean }) {
  const complianceBadge = (
    <Badge tone={complianceTone(club.complianceStatus)}>Compliance: {club.complianceStatus}</Badge>
  )

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
              {anonymousView ? <Building2 className="h-9 w-9" /> : initials(club.tradingName)}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-2xl font-semibold tracking-tight text-text-primary">
                  {anonymousView ? <span className="font-mono text-xl">{club.clubId}</span> : club.tradingName}
                </h3>
                {complianceBadge}
                {anonymousView ? <Badge tone="default">Anonymous preview</Badge> : null}
              </div>

              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-text-secondary">
                {!anonymousView ? <span>Club ID: {club.clubId}</span> : null}
                <span>{club.state}</span>
                <span>{club.regionAffiliation}</span>
                {!anonymousView ? (
                  <>
                    <span>Head coach: {club.headCoach}</span>
                    <span>Pool: {club.poolVenue}</span>
                  </>
                ) : null}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge tone="success">{club.accreditationTier}</Badge>
                <Badge>{club.meetsHostedYtd} meets hosted (YTD)</Badge>
              </div>
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-3 lg:w-[360px]">
            <StatCard label="Active members" value={club.activeMembers} />
            <StatCard label="Programs / squads" value={club.squadsOffered} />
            <StatCard label="Retention vs cohort" value={club.retentionVsNational} />
            <StatCard label="Platform & services" value={club.platformSpendAnnual} />
          </div>
        </div>
      </div>

      <div className="rounded-[var(--radius-card)] border border-border/80 bg-card p-5 shadow-[var(--shadow-card)]">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Venue &amp; catchment</p>
        <p className="mt-1 text-xs text-text-muted">
          {anonymousView
            ? 'Facility address and catchment detail are hidden in anonymous view (demo).'
            : 'Primary training venue and regional draw used for sanctioning, events, and programs (demo).'}
        </p>
        {anonymousView ? (
          <div className="mt-4">
            <InfoRow label="State / territory" value={club.state} />
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InfoRow label="Postcode" value={club.geography.postcode} />
            <InfoRow label="Suburb / locality" value={club.geography.locality} />
            <InfoRow label="SA4 (statistical area)" value={club.geography.sa4Label} />
            <InfoRow label="Metro / regional" value={club.geography.regionType} />
            <InfoRow label="Catchment &amp; schools" value={club.geography.catchmentNote} full />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <Section title="Club registry &amp; governance" right={<ShieldCheck className="h-5 w-5 text-accent" aria-hidden />}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoRow label="Club ID (national)" value={club.clubId} />
              {!anonymousView ? (
                <>
                  <InfoRow label="Legal / trading" value={club.tradingName} />
                  <InfoRow label="Incorporation" value={club.incorporated} />
                  <InfoRow label="ABN (display)" value={club.abnDisplay} />
                  <InfoRow label="President / chair" value={club.president} />
                  <InfoRow label="Primary contact" value={club.primaryContactEmail} full />
                </>
              ) : (
                <InfoRow
                  label="Governance"
                  value="Named office-bearers and contact email hidden in anonymous view."
                  full
                />
              )}
            </div>
          </Section>

          <Section title="Programs &amp; squads">
            <div className="overflow-hidden rounded-[var(--radius-card)] border border-border/80">
              <table className="min-w-full divide-y divide-border/80 text-sm">
                <thead className="bg-bg-elevated/80">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-text-muted">Program</th>
                    <th className="px-4 py-3 text-left font-medium text-text-muted">Pathway focus</th>
                    <th className="px-4 py-3 text-right font-medium text-text-muted">Athletes</th>
                    <th className="px-4 py-3 text-left font-medium text-text-muted">Lead coach</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 bg-card">
                  {club.programs.map((row) => (
                    <tr key={row.programName}>
                      <td className="px-4 py-3 font-medium text-text-primary">{row.programName}</td>
                      <td className="px-4 py-3 text-text-secondary">{row.pathwayFocus}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-text-secondary">{row.athletes}</td>
                      <td className="px-4 py-3 text-text-secondary">
                        {anonymousView ? '—' : row.leadCoach}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Compliance &amp; accreditation">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoRow label="Safeguarding &amp; coaching standards" value={club.accreditationTier} full />
              <InfoRow label="Progression index (national)" value={club.progressionIndex} />
            </div>
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Club health (aggregated)">
            <div className="space-y-4">
              <ProgressBar label="Retention vs national expectation" value={82} />
              <ProgressBar label="Pathway progression strength" value={79} />
              <ProgressBar label="Meet hosting readiness" value={91} />
              <ProgressBar label="Volunteer &amp; official coverage" value={74} />
            </div>
          </Section>

          <Section title="State body notes">
            <div className="space-y-3">
              {club.stateBodyNotes.map((note) => (
                <div key={note} className="rounded-[var(--radius-card)] bg-bg-elevated/60 px-4 py-3 text-sm text-text-secondary">
                  {note}
                </div>
              ))}
            </div>
          </Section>

          <Section title="Governance snapshot">
            <div className="space-y-3">
              {club.governanceNotes.map((note) => (
                <div key={note} className="rounded-[var(--radius-card)] bg-bg-elevated/60 px-4 py-3 text-sm text-text-secondary">
                  {note}
                </div>
              ))}
            </div>
          </Section>

          <Section title="National program snapshot">
            <div className="space-y-3 text-sm text-text-secondary">
              <ActionRow label="Sanction status" value="Active — full competition" />
              <ActionRow label="Event hosting" value="Approved tier-2 regional" />
              <ActionRow label="Intervention" value="None — routine monitoring" />
              <ActionRow label="Next federation review" value="Q3 2026 (demo)" />
            </div>
          </Section>
        </div>
      </div>
    </>
  )
}

export function FederationClubDatabasePanel() {
  const [demoLoaded, setDemoLoaded] = useState(false)
  const [anonymousView, setAnonymousView] = useState(false)
  const visible = demoLoaded ? DEMO_CLUB_RECORD : null

  return (
    <div className="space-y-6">
      <div className="rounded-[var(--radius-card)] border border-border/80 bg-card p-4 shadow-[var(--shadow-card)] md:p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <p className="text-sm text-text-secondary">
                National club registry — governance, programs, compliance, and hosting signals (demo). One seeded club for
                testing.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDemoLoaded(true)}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[var(--radius-button)] border border-border bg-bg-elevated px-4 py-2.5 text-sm font-semibold text-text-primary shadow-sm transition hover:border-accent/40 hover:bg-accent/5"
              aria-label={`Load demo club ${CLUB_DATABASE_DEMO_SEARCH_NAME}`}
            >
              <Search className="h-4 w-4 shrink-0 text-text-muted" aria-hidden />
              Search {CLUB_DATABASE_DEMO_SEARCH_NAME}
            </button>
          </div>

          <div className="flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Privacy preview</p>
              <p className="mt-1 text-sm text-text-secondary">
                <strong className="font-medium text-text-primary">Anonymous view</strong> masks named individuals, contact
                details, and detailed address — club ID and aggregate metrics remain for oversight (demo).
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
          <ClubDetail club={visible} anonymousView={anonymousView} />
        ) : (
          <div className="rounded-[var(--radius-card)] border border-border/80 bg-card p-4 shadow-[var(--shadow-card)]">
            <p className="text-sm text-text-secondary">
              Click <strong className="font-medium text-text-primary">Search {CLUB_DATABASE_DEMO_SEARCH_NAME}</strong> above
              to load the seeded demo club.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
