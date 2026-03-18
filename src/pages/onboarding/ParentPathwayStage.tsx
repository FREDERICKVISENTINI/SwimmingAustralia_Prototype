import { PATHWAY_STAGES } from '../../theme/tokens'
import { Card } from '../../components/ui/Card'

type Props = {
  selected: string
  onSelect: (id: string) => void
  onNext: () => void
}

export function ParentPathwayStage({ selected, onSelect, onNext }: Props) {
  return (
    <div className="space-y-4">
      <Card>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Current pathway stage
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          Where is your swimmer in their journey?
        </p>
      </Card>
      <div className="grid gap-3 sm:grid-cols-1">
        {PATHWAY_STAGES.map((stage) => (
          <button
            key={stage.id}
            type="button"
            onClick={() => onSelect(stage.id)}
            className={`text-left transition-all ${
              selected === stage.id
                ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg'
                : ''
            }`}
          >
            <Card
              className={
                selected === stage.id
                  ? 'border-accent/60 bg-bg-elevated'
                  : 'hover:border-accent/30'
              }
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display font-semibold text-text-primary">
                    {stage.label}
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary">
                    {stage.description}
                  </p>
                </div>
                {selected === stage.id && (
                  <span className="text-success" aria-hidden>✓</span>
                )}
              </div>
            </Card>
          </button>
        ))}
      </div>
      <Card>
        <button
          type="button"
          onClick={onNext}
          className="w-full rounded-[var(--radius-button)] bg-accent px-4 py-2.5 font-medium text-bg transition-colors hover:bg-accent-bright"
        >
          Continue
        </button>
      </Card>
    </div>
  )
}
