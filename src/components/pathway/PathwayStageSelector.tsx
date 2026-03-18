import { PATHWAY_STAGES } from '../../theme/tokens'
import type { PathwayStageData } from './PathwayStageCard'

type Props = {
  value: string | null
  onChange: (stageId: string) => void
  stages?: readonly PathwayStageData[]
  label?: string
  className?: string
}

export function PathwayStageSelector({
  value,
  onChange,
  stages = PATHWAY_STAGES,
  label = 'Pathway stage',
  className = '',
}: Props) {
  const list = stages as readonly PathwayStageData[]

  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-medium text-text-secondary">
        {label}
      </span>
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || '')}
        className="w-full max-w-md rounded-[var(--radius-button)] border border-border bg-bg-elevated px-3 py-2.5 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      >
        {list.map((stage) => (
          <option key={stage.id} value={stage.id}>
            {stage.label}
          </option>
        ))}
      </select>
    </label>
  )
}
