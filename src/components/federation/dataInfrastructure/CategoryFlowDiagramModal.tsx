import { Modal } from '../../ui/Modal'
import { DataFlowStepsDiagram } from './DataFlowStepsDiagram'
import type { DataInfrastructureFlow } from '../../../data/dataInfrastructureFlows'

type CategoryFlowDiagramModalProps = {
  open: boolean
  onClose: () => void
  categoryTitle: string
  flows: DataInfrastructureFlow[]
}

export function CategoryFlowDiagramModal({
  open,
  onClose,
  categoryTitle,
  flows,
}: CategoryFlowDiagramModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${categoryTitle} — system flows`}
      panelClassName="max-w-3xl"
    >
      <p className="text-sm leading-relaxed text-text-secondary">
        This data category feeds the following platform flows (capture → insight). Select a flow in the section
        above to highlight related categories on the page.
      </p>

      {flows.length === 0 ? (
        <p className="mt-4 text-sm text-text-muted">No linked flow is defined for this category yet.</p>
      ) : (
        <div className="mt-6 space-y-8">
          {flows.map((flow) => (
            <div key={flow.id}>
              <h3 className="font-display text-sm font-semibold tracking-tight text-text-primary">{flow.title}</h3>
              <div className="mt-4 rounded-[var(--radius-card)] border border-border/70 bg-bg-elevated/40 p-4">
                <DataFlowStepsDiagram flow={flow} />
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  )
}
