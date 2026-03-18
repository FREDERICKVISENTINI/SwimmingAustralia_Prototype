export type PathwayStageStatus = 'completed' | 'current' | 'upcoming'

export type PathwayStageData = {
  id: string
  label: string
  description: string
}

type PathwayStageCardProps = {
  stage: PathwayStageData
  status?: PathwayStageStatus
  /** When true, show activation-layer emphasis (e.g. for Junior Squad) */
  isActivationLayer?: boolean
  className?: string
}

const STATUS_LABELS: Record<PathwayStageStatus, string> = {
  completed: 'Completed',
  current: 'Current',
  upcoming: 'Upcoming',
}

export function PathwayStageCard({
  stage,
  status,
  isActivationLayer = false,
  className = '',
}: PathwayStageCardProps) {
  const isCurrent = status === 'current'
  const isCompleted = status === 'completed'
  const isUpcoming = status === 'upcoming'

  const cardStyles = [
    'rounded-[var(--radius-card)] border p-5 text-left transition-all',
    'bg-card text-text-primary shadow-[var(--shadow-card)]',
    isCurrent && !isActivationLayer && 'border-accent ring-2 ring-accent/30 shadow-[0_0_24px_-4px_rgba(53,199,243,0.25)]',
    isCurrent && isActivationLayer && 'border-success ring-2 ring-success/40 shadow-[0_0_24px_-4px_rgba(67,224,208,0.2)]',
    isCompleted && 'border-border opacity-90',
    isUpcoming && status && 'border-border opacity-80',
    isActivationLayer && !isCurrent && 'border-success/40',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cardStyles}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-display text-lg font-semibold tracking-tight text-text-primary">
          {stage.label}
        </h3>
        {status && (
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              isCurrent
                ? 'bg-accent/20 text-accent'
                : isCompleted
                  ? 'bg-success/15 text-success'
                  : 'bg-border/50 text-text-muted'
            }`}
          >
            {STATUS_LABELS[status]}
          </span>
        )}
        {isActivationLayer && (
          <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-medium text-success">
            Activation layer
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-text-secondary">{stage.description}</p>
    </div>
  )
}
