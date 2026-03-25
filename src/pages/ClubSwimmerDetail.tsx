import { useEffect, useMemo } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { AlertTriangle, Award } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { PageSection } from '../components/layout/PageSection'
import { Card } from '../components/ui/Card'
import { SwimmerPathwayRecommendationsPanel } from '../components/club/SwimmerPathwayRecommendationsPanel'
import { ROUTES } from '../routes'
import { PATHWAY_STAGES } from '../theme/tokens'
import { getProgressionTimeline, getMilestoneBadges } from '../data/swimmerProgress'
import type { TalentFlagType, StatUploadSource } from '../types/club'

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
  const location = useLocation()
  const { accountType, swimmers, clubSwimmers, clubClasses, clubStatUploads, attendanceRecords, isPremiumTier } = useApp()

  const allSwimmers = swimmers.length > 0 ? swimmers : clubSwimmers
  const swimmer = id ? (allSwimmers.find((s) => s.id === id) ?? null) : null
  const results = swimmer
    ? clubStatUploads.filter((u) => u.swimmerId === swimmer.id).sort((a, b) => (b.date > a.date ? 1 : -1))
    : []

  const hashKey = location.hash.replace(/^#/, '')
  /** Profile vs Details table links: each hash shows only that pane; no hash = full page. */
  const view: 'full' | 'profile' | 'details' =
    hashKey === 'profile' ? 'profile' : hashKey === 'details' || hashKey === 'pathway' ? 'details' : 'full'
  const showProfileBlock = view === 'full' || view === 'profile'
  const showDetailsBlock = view === 'full' || view === 'details'

  useEffect(() => {
    if (view === 'details' && hashKey === 'pathway') {
      const frame = requestAnimationFrame(() => {
        document.getElementById('pathway')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
      return () => cancelAnimationFrame(frame)
    }
    if (view === 'full' && hashKey) {
      const frame = requestAnimationFrame(() => {
        document.getElementById(hashKey)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
      return () => cancelAnimationFrame(frame)
    }
  }, [location.pathname, location.hash, view, hashKey])

  const isClub = accountType === 'club'

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

  const swimmerAttendance = useMemo(
    () => attendanceRecords.filter((a) => a.swimmerId === swimmer.id).sort((a, b) => (b.date > a.date ? 1 : -1)),
    [attendanceRecords, swimmer.id]
  )
  const presentCount = swimmerAttendance.filter((a) => a.status === 'present').length
  const totalAttendance = swimmerAttendance.length
  const attendancePct = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : null
  const lastAttended = swimmerAttendance.find((a) => a.status === 'present')?.date ?? swimmer.lastAttendanceDate ?? null

  const isAtRisk = (() => {
    const reasons: string[] = []
    if (swimmer.attendanceStatus === 'inactive') reasons.push('Marked inactive')
    if (swimmer.paymentStatus === 'overdue') reasons.push('Payment overdue')
    if (attendancePct !== null && attendancePct < 60) reasons.push(`Low attendance (${attendancePct}%)`)
    if (!swimmer.latestStatDate) {
      reasons.push('No results recorded')
    } else {
      const daysSinceStat = Math.floor((Date.now() - new Date(swimmer.latestStatDate).getTime()) / 86400000)
      if (daysSinceStat > 30) reasons.push(`No results in ${daysSinceStat}+ days`)
    }
    return reasons.length > 0 ? reasons : null
  })()

  const timeline = useMemo(() => getProgressionTimeline(swimmer), [swimmer])
  const badges = useMemo(() => getMilestoneBadges(swimmer), [swimmer])

  const hasContact =
    swimmer.contactEmail || swimmer.contactPhone || swimmer.parentGuardianName

  const backTo = isClub ? ROUTES.app.classes : ROUTES.app.dashboard
  const backLabel = isClub ? '← Back to Swimmers' : '← Back to Dashboard'

  return (
    <PageSection
      title={fullName}
      subtitle={
        view === 'profile' ? (
          <span>Contact, club history, and squad roster.</span>
        ) : view === 'details' ? (
          <span>Pathway, SPARTA II context, and meet / training results.</span>
        ) : (
          <span>
            <strong className="text-text-primary">Profile</strong> covers contact, club history, and squad roster.{' '}
            <strong className="text-text-primary">Details</strong> (below) is SPARTA II / state pathway and meet results.
          </span>
        )
      }
    >
      <div className="mb-6">
        <Link to={backTo} className="text-sm font-medium text-accent hover:underline">
          {backLabel}
        </Link>
      </div>

      <div className="space-y-6">
        {/* At-risk indicator */}
        {isAtRisk && (
          <div className="flex items-start gap-3 rounded-[var(--radius-card)] border border-red-400/30 bg-red-400/5 px-5 py-4">
            <AlertTriangle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-400">At Risk</p>
              <ul className="mt-1 space-y-0.5">
                {isAtRisk.map((r) => (
                  <li key={r} className="text-xs text-red-300/80">{r}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Attendance history */}
        {showProfileBlock && totalAttendance > 0 && (
          <section className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
              Attendance
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-2xl font-display font-semibold text-text-primary">{attendancePct}%</p>
                <p className="text-xs text-text-muted">Attendance rate</p>
              </div>
              <div>
                <p className="text-2xl font-display font-semibold text-text-primary">{presentCount}/{totalAttendance}</p>
                <p className="text-xs text-text-muted">Sessions attended</p>
              </div>
              <div>
                <p className="text-2xl font-display font-semibold text-text-primary">{lastAttended ? formatDate(lastAttended) : '—'}</p>
                <p className="text-xs text-text-muted">Last attended</p>
              </div>
            </div>
            {swimmerAttendance.length > 0 && (
              <div className="mt-4 border-t border-border/60 pt-4">
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Recent</h3>
                <div className="space-y-1.5">
                  {swimmerAttendance.slice(0, 8).map((a) => (
                    <div key={a.id} className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">{formatDate(a.date)}</span>
                      <span className={a.status === 'present' ? 'font-medium text-success' : 'text-red-400'}>
                        {a.status === 'present' ? 'Present' : 'Absent'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Progression timeline + badges */}
        {showProfileBlock && timeline.length > 0 && (
          <section className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
              Progression
            </h2>
            {badges.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {badges.map((b) => (
                  <span
                    key={b.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent"
                    title={b.description ?? b.label}
                  >
                    <Award className="h-3 w-3" />
                    {b.label}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-4 border-l-2 border-border/60 pl-4 space-y-3">
              {timeline.map((evt, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[1.35rem] top-1.5 h-2 w-2 rounded-full bg-accent" />
                  <p className="text-xs text-text-muted">{formatDate(evt.date)}</p>
                  <p className="text-sm text-text-primary">{evt.label}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Profile: contact + club history + roster — hidden on #details / #pathway */}
        {showProfileBlock && (
        <section
          id="profile"
          className="scroll-mt-24 rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)]"
        >
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
            Profile
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            Parent / guardian contact and where the swimmer has trained. Squad roster is in the <strong className="text-text-primary">Details</strong>{' '}
            subsection{view === 'full' ? ' below' : ''}. Use <strong className="text-text-primary">Details</strong> in the
            nav for pathway &amp; results only.
          </p>

          <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-text-muted mt-6 mb-3">
            Contact
          </h3>
          {hasContact ? (
            <dl className="grid gap-3 sm:grid-cols-2">
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
            <p className="text-sm text-text-muted">No contact details on file.</p>
          )}

          <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-text-muted mt-8 mb-3">
            Club history
          </h3>
          {swimmer.pastClubs?.length ? (
            <ul className="space-y-3">
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
            <p className="text-sm text-text-muted">
              Current club: {swimmer.className ?? '—'} (no prior club history recorded).
            </p>
          )}

          <div className="mt-8 border-t border-border/60 pt-8">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
              Details
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Squad roster: enrolment, pathway stage, coach, attendance, and notes.
            </p>

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
          </div>
        </section>
        )}

        {/* Details: SPARTA II / pathway + results — hidden on #profile */}
        {showDetailsBlock && (
        <section
          id="details"
          className="scroll-mt-24 rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)]"
        >
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
            Pathway &amp; results
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            High-performance pathway (SPARTA II, state report) and meet / training results.
          </p>

          <div id="pathway" className="scroll-mt-24">
            <SwimmerPathwayRecommendationsPanel swimmer={swimmer} suppressTopBorder />
          </div>

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
        )}

        {/* Premium: pathway benchmarking */}
        {isClub && (
          <section className={`relative rounded-[var(--radius-card)] border p-5 shadow-[var(--shadow-card)] ${isPremiumTier ? 'border-premium/30 bg-card' : 'border-border bg-card'}`}>
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
              Pathway benchmarking
            </h2>
            <p className="mt-1 text-xs text-text-muted">
              How {swimmer.firstName} compares to national averages for {pathwayLabel} swimmers.
            </p>
            <div className={`mt-4 space-y-2 ${isPremiumTier ? '' : 'blur-sm select-none pointer-events-none'}`}>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Attendance vs. stage avg</span>
                <span className="font-medium text-success">{attendancePct ?? '—'}% vs 78%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Results recorded</span>
                <span className="font-medium text-text-primary">{results.length} vs 5.2 avg</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Time at current stage</span>
                <span className="font-medium text-text-primary">14 months vs 18 avg</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Readiness for next stage</span>
                <span className="font-medium text-accent">Progressing</span>
              </div>
            </div>
            {!isPremiumTier && (
              <div className="absolute inset-0 flex items-center justify-center rounded-[var(--radius-card)] bg-bg/60 backdrop-blur-[2px]">
                <div className="text-center px-4">
                  <Award className="mx-auto h-6 w-6 text-text-muted" />
                  <p className="mt-2 text-sm font-medium text-text-secondary">Premium insights not purchased</p>
                  <p className="mt-0.5 text-xs text-text-muted max-w-sm mx-auto">
                    Your organisation has not bought premium insights — pathway benchmarking is not available until Premium is
                    enabled for the club.
                  </p>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </PageSection>
  )
}
