import { Link } from 'react-router-dom'
import type { ClubInstructor } from '../../types/club'
import { ROUTES } from '../../routes'

type Props = {
  instructors: ClubInstructor[]
  /** If set, only show instructors assigned to this class. */
  classId?: string | null
  classNameLabel?: string | null
}

export function InstructorsSection({
  instructors,
  classId = null,
  classNameLabel = null,
}: Props) {
  const list = classId
    ? instructors.filter((i) => i.classIds.includes(classId))
    : instructors

  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
        Instructors
      </h3>
      <p className="mt-1 text-xs text-text-secondary">
        {classId && classNameLabel
          ? `Assigned to ${classNameLabel}. Instructors are linked via their personal AusSwim accounts.`
          : 'Instructors are added through their personal accounts on AusSwim.'}
      </p>
      {list.length === 0 ? (
        <p className="mt-4 text-sm text-text-muted">
          {classId ? 'No instructors assigned to this class.' : 'No instructors linked yet.'}
        </p>
      ) : (
        <ul className="mt-4 space-y-4">
          {list.map((inst) => {
            const bankWarning = !inst.bankDetailsComplete
            const wwccWarning = !inst.workingWithChildrenComplete
            const hasWarnings = bankWarning || wwccWarning
            return (
              <li key={inst.id}>
                <Link
                  to={ROUTES.app.instructorDetail(inst.id)}
                  className={`block rounded-lg border py-3 px-4 transition-colors hover:border-accent/40 hover:bg-bg-elevated/50 ${
                    hasWarnings ? 'border-amber-500/50 bg-amber-500/5' : 'border-border/60 bg-bg-elevated/30'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-text-primary">{inst.fullName}</p>
                      <p className="mt-0.5 text-sm text-text-secondary">
                        Member number: <span className="font-mono text-text-primary">{inst.memberNumber}</span>
                      </p>
                      {inst.email && (
                        <p className="mt-0.5 text-xs text-text-muted">{inst.email}</p>
                      )}
                    </div>
                    <span className="text-xs text-accent">View profile →</span>
                  </div>
                  {hasWarnings && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {bankWarning && (
                        <span className="inline-flex items-center gap-1 rounded bg-amber-500/20 px-2 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                          Bank details not completed
                        </span>
                      )}
                      {wwccWarning && (
                        <span className="inline-flex items-center gap-1 rounded bg-amber-500/20 px-2 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                          Working with Children accreditation not verified
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
