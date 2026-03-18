import type { ServiceTier } from '../../types/pathwayRecommendations'

const TIER_LABELS: Record<ServiceTier, string> = {
  entry: 'Entry',
  development: 'Development',
  performance: 'Performance',
  premium: 'Premium',
  elite: 'Elite',
}

const TIER_STYLES: Record<ServiceTier, string> = {
  entry: 'border-border bg-bg-elevated/80 text-text-muted',
  development: 'border-accent/40 bg-accent/10 text-accent',
  performance: 'border-accent/50 bg-accent/15 text-accent',
  premium: 'border-premium/50 bg-premium/15 text-premium',
  elite: 'border-premium ring-1 ring-premium/30 bg-premium/20 text-premium',
}

type Props = { tier: ServiceTier; className?: string }

export function PremiumBadge({ tier, className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${TIER_STYLES[tier]} ${className}`}
    >
      {TIER_LABELS[tier]}
    </span>
  )
}
