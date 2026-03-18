import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { PageSection } from '../components/layout/PageSection'
import { InstructorsSection } from '../components/club'
import { PATHWAY_STAGES } from '../theme/tokens'
import { ROUTES } from '../routes'

const CLASS_TYPE_LABELS: Record<string, string> = {
  'learn-to-swim': 'Learn-to-Swim',
  'junior-squad': 'Junior Squad',
  'competitive-squad': 'Competitive Squad',
  'state-prep': 'State Prep',
  'elite-program': 'Elite Program',
}

export function ClassDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { accountType, clubClasses, clubSwimmers, clubInstructors } = useApp()

  const cls = clubClasses.find((c) => c.id === id)
  const enrolled = clubSwimmers.filter((s) => s.classId === id)
  const pathwayLabel = cls ? PATHWAY_STAGES.find((s) => s.id === cls.pathwayStageId)?.label ?? cls.pathwayStageId : '—'

  if (accountType !== 'club') {
    return (
      <PageSection title="Class">
        <p className="text-text-muted">This page is for club accounts.</p>
      </PageSection>
    )
  }

  if (!cls) {
    return (
      <PageSection title="Class">
        <p className="text-text-muted">Class not found.</p>
        <button
          type="button"
          onClick={() => navigate(ROUTES.app.classes)}
          className="mt-4 text-sm font-medium text-accent hover:underline"
        >
          Back to Classes
        </button>
      </PageSection>
    )
  }

  const typeLabel = CLASS_TYPE_LABELS[cls.classType] ?? cls.classType

  return (
    <PageSection
      title={cls.name}
      subtitle={`${typeLabel} · ${pathwayLabel}`}
    >
      <button
        type="button"
        onClick={() => navigate(ROUTES.app.classes)}
        className="mb-4 text-sm font-medium text-accent hover:underline"
      >
        ← Back to Classes
      </button>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <div className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
              Class details
            </h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div><dt className="text-text-muted">Coach</dt><dd className="font-medium text-text-primary">{cls.coachName}</dd></div>
              <div><dt className="text-text-muted">Age group</dt><dd className="font-medium text-text-primary">{cls.ageGroup}</dd></div>
              <div><dt className="text-text-muted">Schedule</dt><dd className="font-medium text-text-primary">{cls.trainingDays} · {cls.trainingTimes}</dd></div>
              <div><dt className="text-text-muted">Capacity</dt><dd className="font-medium text-text-primary">{enrolled.length} / {cls.capacity}</dd></div>
              <div><dt className="text-text-muted">Pathway stage</dt><dd className="font-medium text-success">{pathwayLabel}</dd></div>
            </dl>
          </div>
          <InstructorsSection
            instructors={clubInstructors}
            classId={cls.id}
            classNameLabel={cls.name}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
              Enrolled swimmers
            </h3>
            {enrolled.length === 0 ? (
              <p className="mt-3 text-sm text-text-muted">No swimmers enrolled.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {enrolled.map((s) => (
                  <li key={s.id} className="flex justify-between text-sm">
                    <span className="text-text-primary">{s.firstName} {s.lastName}</span>
                    <span className="text-text-secondary">{s.ageGroup} · {s.attendanceStatus}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
              Next sessions
            </h3>
            <p className="mt-3 text-sm text-text-secondary">
              Tue 5:00 pm · Thu 5:00 pm · Fri 5:00 pm
            </p>
          </div>

          <div className="rounded-[var(--radius-card)] border border-dashed border-border bg-card/50 p-5">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
              Attendance
            </h3>
            <p className="mt-3 text-sm text-text-muted">Attendance tracking will appear here.</p>
          </div>
        </div>
      </div>
    </PageSection>
  )
}
