import { DATA_INFRASTRUCTURE_FLOWS } from '../../../data/dataInfrastructureFlows'
import { DataFlowStepsDiagram } from './DataFlowStepsDiagram'

export type DataFlowSectionProps = {
  selectedFlowId: string | null
  onFlowSelect: (flowId: string) => void
}

const FLOW_CARD_BASE =
  'w-full rounded-[var(--radius-card)] border bg-card p-5 text-left shadow-[var(--shadow-card)] transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-bg'

const FLOW_CARD_IDLE = 'border-border/80 hover:-translate-y-0.5 hover:border-border hover:shadow-md'

const FLOW_CARD_SELECTED = 'border-accent/50 shadow-md ring-2 ring-accent/35'

export function DataFlowSection({ selectedFlowId, onFlowSelect }: DataFlowSectionProps) {
  return (
    <section className="space-y-6 md:space-y-8">
      <div className="max-w-3xl space-y-2">
        <h2 className="font-display text-xl font-semibold tracking-tight text-text-primary md:text-2xl">Data flow</h2>
        <p className="text-sm leading-relaxed text-text-secondary">
          From capture to insight — a simple view of how each stream moves through the platform.{' '}
          <span className="text-text-muted">Select a flow to highlight related categories below.</span>
        </p>
      </div>

      <div className="grid gap-4 md:gap-5 xl:gap-6">
        {DATA_INFRASTRUCTURE_FLOWS.map((flow) => {
          const isSelected = selectedFlowId === flow.id
          return (
            <button
              key={flow.id}
              type="button"
              onClick={() => onFlowSelect(flow.id)}
              className={`${FLOW_CARD_BASE} ${isSelected ? FLOW_CARD_SELECTED : FLOW_CARD_IDLE}`}
              aria-pressed={isSelected}
            >
              <h3 className="font-display text-[0.9375rem] font-semibold tracking-tight text-text-primary">
                {flow.title}
              </h3>

              <div className="mt-5">
                <DataFlowStepsDiagram flow={flow} />
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
