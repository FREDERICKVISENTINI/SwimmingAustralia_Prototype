import type { NextStepInfo } from '../../types/pathwayRecommendations'
import { ChevronRight } from 'lucide-react'

type Props = {
  nextStep: NextStepInfo
  onCtaClick?: () => void
}

export function NextStepCard({ nextStep, onCtaClick }: Props) {
  return (
    <div className="rounded-[var(--radius-card)] border border-accent/30 bg-card p-5 shadow-[var(--shadow-card)] md:p-6">
      <p className="text-xs font-medium uppercase tracking-wider text-accent">
        Next step in pathway
      </p>
      <h3 className="mt-2 font-display text-xl font-semibold text-text-primary">
        {nextStep.stageLabel}
      </h3>
      <p className="mt-3 text-sm text-text-secondary">{nextStep.description}</p>
      <div className="mt-4">
        <button
          type="button"
          onClick={onCtaClick}
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-button)] bg-accent px-4 py-2.5 text-sm font-medium text-bg transition-colors hover:bg-accent-bright"
        >
          {nextStep.ctaLabel}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
