import { Card } from '../../components/ui/Card'
import { PATHWAY_STAGES } from '../../theme/tokens'

type Props = {
  selected: string[]
  onToggle: (stageId: string) => void
  onNext: () => void
}

export function CoachPathwayFocus({ selected, onToggle, onNext }: Props) {
  const handleToggle = (stageId: string) => {
    onToggle(stageId)
  }

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Pathway focus
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          Select the stages you primarily work with. You can choose more than one. (Demo: you can skip and continue.)
        </p>
      </Card>
      <div className="grid gap-3 sm:grid-cols-1">
        {PATHWAY_STAGES.map((stage) => {
          const isSelected = selected.includes(stage.id)
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => handleToggle(stage.id)}
              className={`text-left transition-all ${
                isSelected ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg' : ''
              }`}
            >
              <Card
                className={
                  isSelected
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
                  {isSelected && (
                    <span className="text-success" aria-hidden>
                      ✓
                    </span>
                  )}
                </div>
              </Card>
            </button>
          )
        })}
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
