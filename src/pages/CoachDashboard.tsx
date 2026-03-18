import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { PageSection } from '../components/layout/PageSection'
import { Card } from '../components/ui/Card'
import { PATHWAY_STAGES } from '../theme/tokens'
import type { ClubSwimmer, TalentFlagType } from '../types/club'

const TALENT_FLAG_LABELS: Record<TalentFlagType, string> = {
  technique: 'Technique',
  'rapid-improvement': 'Rapid improvement',
  'coach-observation': 'Coach observation',
  'hp-signal': 'HP signal',
}

function TalentFlagBadges({ flags }: { flags: TalentFlagType[] }) {
  if (!flags?.length) return <span className="text-text-muted text-sm">—</span>
  return (
    <div className="flex flex-wrap gap-1">
      {flags.map((f) => (
        <span
          key={f}
          className="inline-flex rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success"
        >
          {TALENT_FLAG_LABELS[f]}
        </span>
      ))}
    </div>
  )
}

export function CoachDashboard() {
  const { accountType, coachProfile, clubSwimmers, clubClasses } = useApp()
  const [classFilter, setClassFilter] = useState<string>('')
  const [flaggedOnly, setFlaggedOnly] = useState(false)

  const isClub = accountType === 'club'
  const isFederation = accountType === 'federation'

  const filteredSwimmers = useMemo(() => {
    let list = clubSwimmers
    if (classFilter) {
      list = list.filter((s) => s.classId === classFilter)
    }
    if (flaggedOnly) {
      list = list.filter((s) => s.talentFlags?.length)
    }
    return list
  }, [clubSwimmers, classFilter, flaggedOnly])

  const flaggedCount = useMemo(
    () => clubSwimmers.filter((s) => s.talentFlags?.length).length,
    [clubSwimmers]
  )

  const pathwayLabel = (stageId: string) =>
    PATHWAY_STAGES.find((s) => s.id === stageId)?.label ?? stageId

  if (isFederation) {
    const pathwayLabels =
      coachProfile?.pathwayFocus?.length
        ? coachProfile.pathwayFocus
            .map((id) => PATHWAY_STAGES.find((s) => s.id === id)?.label ?? id)
            .join(', ')
        : '—'
    return (
      <PageSection
        title="Federation dashboard"
        subtitle="Govern and support the pathway at state and national level."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Organisation</p>
            <p className="mt-1 font-medium text-text-primary">{coachProfile?.organisation ?? '—'}</p>
          </Card>
          <Card>
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Role</p>
            <p className="mt-1 font-medium text-text-primary">{coachProfile?.roleTitle ?? '—'}</p>
          </Card>
          <Card>
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Accreditation</p>
            <p className="mt-1 font-medium text-success">{coachProfile?.accreditationLevel ?? '—'}</p>
          </Card>
        </div>
        <Card className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Pathway focus</p>
          <p className="mt-1 font-medium text-text-primary">{pathwayLabels}</p>
        </Card>
      </PageSection>
    )
  }

  if (!isClub) {
    return (
      <PageSection title="Coach dashboard">
        <Card>
          <p className="text-text-muted">Sign in as a club to use the coach talent view.</p>
        </Card>
      </PageSection>
    )
  }

  return (
    <PageSection
      title="Coach view"
      subtitle="Your squad and talent watch. Flags are based on technique, improvement, and observation—not only race times."
    >
      {/* Explainer */}
      <div className="rounded-[var(--radius-card)] border border-border/80 bg-bg-elevated/50 px-4 py-3 text-sm text-text-secondary">
        <p>
          <strong className="text-text-primary">Talent signals</strong> come from technique assessment, improvement
          trends, and coach observation—not only fastest times. Use this view to spot athletes worth watching.
        </p>
      </div>

      {/* My squad summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Squad size</p>
          <p className="mt-1 font-display text-2xl font-semibold text-text-primary">
            {clubSwimmers.length}
          </p>
          <p className="mt-0.5 text-sm text-text-secondary">swimmers on roster</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Flagged</p>
          <p className="mt-1 font-display text-2xl font-semibold text-success">
            {flaggedCount}
          </p>
          <p className="mt-0.5 text-sm text-text-secondary">talent / HP signals</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2">
          <span className="text-sm font-medium text-text-secondary">Class</span>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-sm text-text-primary"
          >
            <option value="">All classes</option>
            {clubClasses.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={flaggedOnly}
            onChange={(e) => setFlaggedOnly(e.target.checked)}
            className="rounded border-border text-accent focus:ring-accent"
          />
          <span className="text-sm font-medium text-text-secondary">Flagged only</span>
        </label>
      </div>

      {/* Talent watch list */}
      <section>
        <h2 className="font-display text-lg font-semibold text-text-primary md:text-xl">
          Talent watch
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          Athletes with technique, improvement, or HP signals. Click through to Swimmers for full details and stats.
        </p>
        {filteredSwimmers.length === 0 ? (
          <Card className="mt-4 p-6">
            <p className="text-text-muted">
              {flaggedOnly || classFilter
                ? 'No swimmers match the current filters.'
                : 'No swimmers on roster yet. Add swimmers in Swimmers to see them here.'}
            </p>
          </Card>
        ) : (
          <div className="mt-4 overflow-hidden rounded-[var(--radius-card)] border border-border bg-card shadow-[var(--shadow-card)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-bg-elevated/80">
                    <th className="px-4 py-3 font-medium text-text-muted">Name</th>
                    <th className="px-4 py-3 font-medium text-text-muted">Class</th>
                    <th className="px-4 py-3 font-medium text-text-muted">Pathway stage</th>
                    <th className="px-4 py-3 font-medium text-text-muted">Talent signals</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSwimmers.map((s: ClubSwimmer) => (
                    <tr key={s.id} className="border-b border-border/70 last:border-0">
                      <td className="px-4 py-3 font-medium text-text-primary">
                        {s.firstName} {s.lastName}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">{s.className ?? '—'}</td>
                      <td className="px-4 py-3 text-text-secondary">
                        {pathwayLabel(s.pathwayStageId)}
                      </td>
                      <td className="px-4 py-3">
                        <TalentFlagBadges flags={s.talentFlags ?? []} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </PageSection>
  )
}
