import { Link } from 'react-router-dom'
import type { SwimClass } from '../../types/club'
import { ROUTES } from '../../routes'

const CLASS_TYPE_LABELS: Record<SwimClass['classType'], string> = {
  'learn-to-swim': 'Learn-to-Swim',
  'junior-squad': 'Junior Squad',
  'competitive-squad': 'Competitive Squad',
  'state-prep': 'State Prep',
  'elite-program': 'Elite Program',
}

type Props = {
  class: SwimClass
  /** When provided, show this count (from roster) instead of class.swimmerCount. */
  enrolledCount?: number
}

export function ClassCard({ class: c, enrolledCount }: Props) {
  const typeLabel = CLASS_TYPE_LABELS[c.classType] ?? c.classType
  const swimmerCount = enrolledCount !== undefined ? enrolledCount : c.swimmerCount
  return (
    <Link
      to={ROUTES.app.classDetail(c.id)}
      className="block rounded-[var(--radius-card)] border border-border/80 bg-card p-4 shadow-[var(--shadow-card)] transition-all duration-200 hover:shadow-[var(--shadow-card-hover)] hover:border-accent/40 hover:bg-bg-elevated/50 border-l-4 border-l-transparent hover:border-l-accent"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-text-primary">{c.name}</h3>
          <p className="mt-0.5 text-sm text-text-muted">{typeLabel}</p>
        </div>
        <span
          className={`rounded px-2 py-0.5 text-xs font-medium ${
            c.status === 'active' ? 'bg-success/20 text-success' : c.status === 'full' ? 'bg-amber-500/20 text-amber-400' : 'bg-bg-elevated text-text-muted'
          }`}
        >
          {c.status}
        </span>
      </div>
      <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-secondary">
        <span>{c.coachName}</span>
        <span>·</span>
        <span>{c.ageGroup}</span>
        <span>·</span>
        <span>{swimmerCount}/{c.capacity} swimmers</span>
      </dl>
      <p className="mt-2 text-xs text-text-muted">{c.trainingDays} · {c.trainingTimes}</p>
    </Link>
  )
}
