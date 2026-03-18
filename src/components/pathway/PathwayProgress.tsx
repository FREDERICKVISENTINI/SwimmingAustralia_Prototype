import { useState } from 'react'
import { PATHWAY_STAGES } from '../../theme/tokens'
import type { PathwayStageData } from './PathwayStageCard'

type PathwayProgressProps = {
  /** Stage id that is considered "current"; earlier stages are completed, later are upcoming */
  currentStageId?: string | null
  /** Optional custom stages; defaults to PATHWAY_STAGES */
  stages?: readonly PathwayStageData[]
  className?: string
}

export function PathwayProgress({
  currentStageId = null,
  stages = PATHWAY_STAGES,
  className = '',
}: PathwayProgressProps) {
  const list = stages as readonly PathwayStageData[]
  const [selectedId, setSelectedId] = useState<string | null>(
    () => currentStageId ?? list[0]?.id ?? null
  )

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="relative">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-text-secondary">
            Pathway stage
          </span>
          <select
            value={selectedId ?? ''}
            onChange={(e) => setSelectedId(e.target.value || null)}
            className="w-full max-w-md rounded-[var(--radius-button)] border border-border bg-bg-elevated px-3 py-2.5 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {list.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}
