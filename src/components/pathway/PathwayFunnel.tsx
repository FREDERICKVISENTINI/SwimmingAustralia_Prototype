import { PATHWAY_STAGES } from '../../theme/tokens'

/** First four stages shown separately; State Pathway + Elite combined as "Elite". */
const FUNNEL_STAGES = [
  ...PATHWAY_STAGES.slice(0, 4),
  { id: 'elite', label: 'Elite', combinedIds: ['state-pathway', 'elite'] as const },
]

type Props = {
  currentStageId: string
  swimmerName: string
  onStageSelect?: (stageId: string) => void
  className?: string
}

/**
 * Visual funnel showing pathway stages with the swimmer's current stage highlighted.
 * State Pathway and Elite are combined into one "Elite" segment. Segments are clickable.
 */
export function PathwayFunnel({ currentStageId, swimmerName, onStageSelect, className = '' }: Props) {
  return (
    <div className={`rounded-[var(--radius-card)] border border-border bg-card p-4 shadow-[var(--shadow-card)] md:p-5 ${className}`}>
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">
        You are here
      </p>
      <div className="flex flex-wrap items-stretch gap-1 sm:gap-2">
        {FUNNEL_STAGES.map((stage) => {
          const isCurrent =
            stage.id === currentStageId ||
            ('combinedIds' in stage && stage.combinedIds.includes(currentStageId as 'state-pathway' | 'elite'))
          const stageId = stage.id
          const handleClick = () => onStageSelect?.(stageId)

          return (
            <button
              key={stage.id}
              type="button"
              onClick={handleClick}
              className={`
                flex min-w-0 flex-1 basis-0 flex-col rounded-lg px-2 py-2 text-center transition-colors
                sm:min-w-[80px] sm:basis-[80px]
                hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-[var(--color-card)]
                ${isCurrent
                  ? 'bg-accent/25 ring-1 ring-accent text-accent'
                  : 'bg-bg-elevated/80 text-text-muted cursor-pointer'}
              `}
            >
              <span className="truncate text-xs font-medium sm:text-sm">
                {stage.label}
              </span>
              {isCurrent && (
                <span className="mt-1 truncate text-xs font-medium text-accent">
                  {swimmerName}
                </span>
              )}
            </button>
          )
        })}
      </div>
      <p className="mt-4 border-t border-border/60 pt-4 text-sm leading-relaxed text-text-secondary">
        The <strong className="font-medium text-text-primary">highlighted stage</strong> follows this swimmer’s squad /
        pathway on file. It updates when their club assigns a new squad or you change pathway stage in{' '}
        <strong className="font-medium text-text-primary">My Swimmers</strong>. Tapping another stage previews that step
        (demo: saves as their stage). With several swimmers on your account, each can be on a different step — use the
        swimmer control under the page title to switch.
      </p>
    </div>
  )
}
