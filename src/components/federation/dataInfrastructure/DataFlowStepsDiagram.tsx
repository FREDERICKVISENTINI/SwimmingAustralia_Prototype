import { Fragment } from 'react'
import type { DataInfrastructureFlow } from '../../../data/dataInfrastructureFlows'

function BetweenStepArrow() {
  return (
    <span
      className="flex shrink-0 justify-center py-0.5 text-base font-medium leading-none text-text-muted md:w-6 md:items-center md:justify-center md:py-0"
      aria-hidden
    >
      <span className="md:hidden">↓</span>
      <span className="hidden md:inline">→</span>
    </span>
  )
}

type DataFlowStepsDiagramProps = {
  flow: DataInfrastructureFlow
  /** Extra class on the outer row (e.g. spacing). */
  className?: string
}

/** Horizontal / vertical step boxes with arrows — shared by Data flow section and category modal. */
export function DataFlowStepsDiagram({ flow, className = '' }: DataFlowStepsDiagramProps) {
  return (
    <div
      className={`flex flex-col gap-0 md:flex-row md:flex-nowrap md:items-stretch md:overflow-x-auto md:pb-1 md:[scrollbar-width:thin] ${className}`}
    >
      {flow.steps.map((step, index) => (
        <Fragment key={step}>
          {index > 0 && <BetweenStepArrow />}
          <div className="flex min-h-[2.875rem] min-w-0 flex-1 rounded-md border border-border/60 bg-bg-elevated/80 px-3 py-2.5 text-[0.8rem] font-medium leading-snug text-text-primary md:min-w-[7.5rem] md:max-w-[16rem] md:items-center">
            <span className="w-full text-center md:text-left">{step}</span>
          </div>
        </Fragment>
      ))}
    </div>
  )
}
