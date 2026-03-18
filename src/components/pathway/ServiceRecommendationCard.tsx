import type { RecommendedService } from '../../types/pathwayRecommendations'
import { PremiumBadge } from './PremiumBadge'

type Props = { service: RecommendedService; showTier?: boolean }

const PREMIUM_TIERS = ['premium', 'elite'] as const

function isPremiumTier(tier: string): boolean {
  return PREMIUM_TIERS.includes(tier as (typeof PREMIUM_TIERS)[number])
}

export function ServiceRecommendationCard({ service, showTier = true }: Props) {
  const usePremiumStyle = isPremiumTier(service.tier)

  return (
    <article
      className={`rounded-[var(--radius-card)] border p-4 text-left shadow-[var(--shadow-card)] transition-colors hover:border-accent/30 ${
        usePremiumStyle
          ? 'border-premium/40 bg-card ring-1 ring-premium/10'
          : 'border-border bg-card'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-display font-semibold text-text-primary">
          {service.title}
        </h3>
        {showTier && <PremiumBadge tier={service.tier} />}
      </div>
      <p className="mt-2 text-sm text-text-secondary">{service.description}</p>
      <div className="mt-2 text-xs text-text-muted">{service.serviceType}</div>
      <div className="mt-3">
        <button
          type="button"
          className={`rounded-[var(--radius-button)] px-3 py-1.5 text-sm font-medium transition-colors ${
            usePremiumStyle
              ? 'bg-premium/20 text-premium hover:bg-premium/30'
              : 'bg-accent/20 text-accent hover:bg-accent/30'
          }`}
        >
          {service.ctaLabel}
        </button>
      </div>
    </article>
  )
}
