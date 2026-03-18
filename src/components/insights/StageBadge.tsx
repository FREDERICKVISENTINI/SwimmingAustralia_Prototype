import { PATHWAY_STAGES } from '../../theme/tokens'
import type { PathwayStageId } from '../../types/insights'

type Props = { stageId: PathwayStageId }

export function StageBadge({ stageId }: Props) {
  const stage = PATHWAY_STAGES.find((s) => s.id === stageId)
  const label = stage?.label ?? stageId

  return (
    <span className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
      Current stage: {label}
    </span>
  )
}
