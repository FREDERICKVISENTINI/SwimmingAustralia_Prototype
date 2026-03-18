import { PATHWAY_STAGES } from '../../theme/tokens'
import type { PathwayStageData } from './PathwayStageCard'

type PathwaySnapshotProps = {
  currentStageId: string
  stages?: readonly PathwayStageData[]
  className?: string
}

function getStatus(index: number, currentIndex: number): 'completed' | 'current' | 'upcoming' {
  if (index < currentIndex) return 'completed'
  if (index === currentIndex) return 'current'
  return 'upcoming'
}

export function PathwaySnapshot({
  currentStageId,
  stages = PATHWAY_STAGES,
  className = '',
}: PathwaySnapshotProps) {
  const list = stages as readonly PathwayStageData[]
  const currentIndex = list.findIndex((s) => s.id === currentStageId)
  const safeIndex = currentIndex >= 0 ? currentIndex : 0

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        {list.map((stage, index) => {
          const status = getStatus(index, safeIndex)
          const isCurrent = status === 'current'
          const isCompleted = status === 'completed'
          const isLast = index === list.length - 1
          return (
            <div key={stage.id} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                  isCurrent
                    ? 'bg-accent/20 text-accent ring-1 ring-accent/50'
                    : isCompleted
                      ? 'bg-success/15 text-success'
                      : 'bg-border/40 text-text-muted'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                    isCurrent ? 'bg-accent' : isCompleted ? 'bg-success' : 'bg-text-muted'
                  }`}
                  aria-hidden
                />
                {stage.label}
              </div>
              {!isLast && (
                <span
                  className="text-border text-[10px]"
                  aria-hidden
                >
                  →
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
