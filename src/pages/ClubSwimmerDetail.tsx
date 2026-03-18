import { useParams, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { PageSection } from '../components/layout/PageSection'
import { Card } from '../components/ui/Card'
import { ROUTES } from '../routes'
import { PATHWAY_STAGES } from '../theme/tokens'
import type { ClubSwimmer, TalentFlagType, StatUploadSource } from '../types/club'

const SOURCE_LABELS: Record<StatUploadSource, string> = {
  'meet-result': 'Meet',
  'training-observation': 'Training',
  assessment: 'Assessment',
  'manual-entry': 'Manual',
}

const TALENT_FLAG_LABELS: Record<TalentFlagType, string> = {
  technique: 'Technique',
  'rapid-improvement': 'Rapid improvement',
  'coach-observation': 'Coach observation',
  'hp-signal': 'HP signal',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function ClubSwimmerDetail() {
  const { id } = useParams<{ id: string }>()
  const { accountType, clubSwimmers, clubClasses, clubStatUploads } = useApp()

  const swimmer = id ? (clubSwimmers.find((s) => s.id === id) ?? null) : null
  const results = swimmer
    ? clubStatUploads.filter((u) => u.swimmerId === swimmer.id).sort((a, b) => (b.date > a.date ? 1 : -1))
    : []

  if (accountType !== 'club') {
    return (
      <PageSection title="Swimmer details">
        <p className="text-text-muted">This page is for club accounts.</p>
      </PageSection>
    )
  }

  if (!swimmer) {
    return (
      <PageSection title="Swimmer not found">
        <Card className="p-6">
          <p className="text-text-muted">This swimmer could not be found.</p>
          <Link to={ROUTES.app.swimmers} className="mt-3 inline-block text-sm font-medium text-accent hover:underline">
            ← Back to Swimmers
          </Link>
        </Card>
      </PageSection>
    )
  }

  const fullName = `${swimmer.firstName} ${swimmer.lastName}`
  const pathwayLabel = PATHWAY_STAGES.find((s) => s.id === swimmer.pathwayStageId)?.label ?? swimmer.pathwayStageId
  const classInfo = swimmer.classId ? clubClasses.find((c) => c.id === swimmer.classId) : null

  const hasContact =
    swimmer.contactEmail || swimmer.contactPhone || swimmer.parentGuardianName

  return (
    <PageSection
      title={fullName}
      subtitle="Details, contact, and club history."
    >
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link
          to={ROUTES.app.swimmers}
          className="text-sm font-medium text-accent hover:underline"
        >
          ← Back to Swimmers
        </Link>
      </div>

      <div className="space-y-6">
        {/* Contact */}
        <section className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
            Contact
          </h2>
          {hasContact ? (
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {swimmer.parentGuardianName && (
                <div>
                  <dt className="text-xs text-text-muted">Parent / guardian</dt>
                  <dd className="font-medium text-text-primary">{swimmer.parentGuardianName}</dd>
                </div>
              )}
              {swimmer.contactEmail && (
                <div>
                  <dt className="text-xs text-text-muted">Email</dt>
                  <dd>
                    <a
                      href={`mailto:${swimmer.contactEmail}`}
                      className="font-medium text-accent hover:underline"
                    >
                      {swimmer.contactEmail}
                    </a>
                  </dd>
                </div>
              )}
              {swimmer.contactPhone && (
                <div>
                  <dt className="text-xs text-text-muted">Phone</dt>
                  <dd>
                    <a
                      href={`tel:${swimmer.contactPhone.replace(/\s/g, '')}`}
                      className="font-medium text-accent hover:underline"
                    >
                      {swimmer.contactPhone}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="mt-4 text-sm text-text-muted">No contact details on file.</p>
          )}
        </section>

        {/* Details */}
        <section id="details" className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
            Details
          </h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-xs text-text-muted">Date of birth</dt>
              <dd className="font-medium text-text-primary">{formatDate(swimmer.dateOfBirth)}</dd>
            </div>
            <div>
              <dt className="text-xs text-text-muted">Age group</dt>
              <dd className="font-medium text-text-primary">{swimmer.ageGroup}</dd>
            </div>
            <div>
              <dt className="text-xs text-text-muted">Pathway stage</dt>
              <dd className="font-medium text-text-primary">{pathwayLabel}</dd>
            </div>
            <div>
              <dt className="text-xs text-text-muted">Class</dt>
              <dd className="font-medium text-text-primary">{swimmer.className ?? '—'}</dd>
            </div>
            {classInfo && (
              <div>
                <dt className="text-xs text-text-muted">Coach</dt>
                <dd className="font-medium text-text-primary">{classInfo.coachName}</dd>
              </div>
            )}
            <div>
              <dt className="text-xs text-text-muted">Attendance</dt>
              <dd className="font-medium text-text-primary capitalize">{swimmer.attendanceStatus.replace(/-/g, ' ')}</dd>
            </div>
            <div>
              <dt className="text-xs text-text-muted">Payment status</dt>
              <dd className="font-medium text-text-primary capitalize">{swimmer.paymentStatus ?? '—'}</dd>
            </div>
            {swimmer.talentFlags?.length ? (
              <div className="sm:col-span-2">
                <dt className="text-xs text-text-muted">Talent signals</dt>
                <dd className="mt-1 flex flex-wrap gap-1">
                  {swimmer.talentFlags.map((f) => (
                    <span
                      key={f}
                      className="inline-flex rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success"
                    >
                      {TALENT_FLAG_LABELS[f]}
                    </span>
                  ))}
                </dd>
              </div>
            ) : null}
            {swimmer.notes ? (
              <div className="sm:col-span-2 lg:col-span-3">
                <dt className="text-xs text-text-muted">Notes</dt>
                <dd className="mt-1 font-medium text-text-primary whitespace-pre-wrap">{swimmer.notes}</dd>
              </div>
            ) : null}
          </dl>

          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted mt-6 mb-3">
            Results & event details
          </h3>
          {results.length === 0 ? (
            <p className="text-sm text-text-muted">No results or events recorded yet. Add times and notes from Stats.</p>
          ) : (
            <div className="overflow-x-auto rounded-[var(--radius-button)] border border-border/80">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-bg-elevated/80">
                    <th className="px-3 py-2 font-medium text-text-muted">Date</th>
                    <th className="px-3 py-2 font-medium text-text-muted">Event / metric</th>
                    <th className="px-3 py-2 font-medium text-text-muted">Value</th>
                    <th className="px-3 py-2 font-medium text-text-muted">Source</th>
                    <th className="px-3 py-2 font-medium text-text-muted">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((u) => (
                    <tr key={u.id} className="border-b border-border/70 last:border-0">
                      <td className="px-3 py-2 text-text-secondary">{u.date}</td>
                      <td className="px-3 py-2 font-medium text-text-primary">{u.eventMetric}</td>
                      <td className="px-3 py-2 text-text-secondary">{u.value}</td>
                      <td className="px-3 py-2 text-text-muted">{SOURCE_LABELS[u.source]}</td>
                      <td className="px-3 py-2 text-text-muted max-w-[12rem] truncate" title={u.coachNotes ?? undefined}>
                        {u.coachNotes ?? '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Past clubs */}
        <section className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
            Club history
          </h2>
          {swimmer.pastClubs?.length ? (
            <ul className="mt-4 space-y-3">
              {swimmer.pastClubs.map((c, i) => (
                <li key={i} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border/60 pb-3 last:border-0 last:pb-0">
                  <span className="font-medium text-text-primary">{c.clubName}</span>
                  <span className="text-sm text-text-muted">
                    {c.from} – {c.to ?? 'current'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-text-muted">
              Current club: {swimmer.className ?? '—'} (no prior club history recorded).
            </p>
          )}
        </section>
      </div>
    </PageSection>
  )
}
