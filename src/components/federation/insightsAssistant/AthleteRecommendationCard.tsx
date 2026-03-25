import type { RecommendationAthlete } from '../../../types/insightsAssistant'
import { RecommendationRationaleTag } from './RecommendationRationaleTag'

type Props = { athlete: RecommendationAthlete; rank?: number }

export function AthleteRecommendationCard({ athlete, rank }: Props) {
  return (
    <article className="rounded-[var(--radius-card)] border border-border/80 bg-card p-4 shadow-[var(--shadow-card)] transition-colors hover:border-accent/25">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-baseline gap-2">
          {rank != null && (
            <span className="font-display text-lg font-semibold tabular-nums text-text-muted">{rank}.</span>
          )}
          <div>
            <h3 className="font-display text-base font-semibold text-text-primary">{athlete.name}</h3>
            <p className="mt-0.5 text-sm text-text-secondary">
              Age {athlete.age} · {athlete.club} · {athlete.state}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {athlete.signalBasis && (
            <span
              className={`rounded-md px-2 py-0.5 text-xs font-semibold uppercase ${
                athlete.signalBasis === 'hp'
                  ? 'border border-premium/35 bg-premium/10 text-premium'
                  : athlete.signalBasis === 'meet'
                    ? 'border border-accent/30 bg-accent/10 text-accent'
                    : athlete.signalBasis === 'risk'
                      ? 'border border-amber-500/35 bg-amber-500/10 text-amber-900 dark:text-amber-100'
                      : 'border border-emerald-500/35 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100'
              }`}
            >
              {athlete.signalBasis === 'hp'
                ? 'HP'
                : athlete.signalBasis === 'meet'
                  ? 'Meet'
                  : athlete.signalBasis === 'risk'
                    ? 'Risk'
                    : 'Results'}
            </span>
          )}
          <span className="rounded-md border border-accent/30 bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
            {athlete.pathwayStage}
          </span>
        </div>
      </div>
      <p className="mt-3 text-sm text-text-secondary">{athlete.performanceNote}</p>
      <p className="mt-2 text-sm leading-relaxed text-text-primary">{athlete.rationale}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {athlete.signalTags.map((t) => (
          <RecommendationRationaleTag key={t}>{t}</RecommendationRationaleTag>
        ))}
      </div>
    </article>
  )
}
