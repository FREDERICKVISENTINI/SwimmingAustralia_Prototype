import type { ReactNode } from 'react'
import { useFederationLightPage } from '../../context/FederationLightPageContext'

type Props = {
  label: string
  value: string | number
  subtext?: string
  accent?: 'default' | 'premium'
  icon?: ReactNode
}

export function FederationMetricCard({ label, value, subtext, accent = 'default', icon }: Props) {
  const light = useFederationLightPage()
  const hoverGlow =
    accent === 'premium'
      ? ''
      : light
        ? 'hover:border-accent/40 hover:shadow-[0_0_20px_-8px_rgb(0,153,204,0.2)]'
        : 'hover:border-accent/40 hover:shadow-[0_0_20px_-8px_rgb(53,199,243,0.25)]'

  return (
    <div
      className={`rounded-[var(--radius-card)] border border-border/80 bg-card p-5 shadow-[var(--shadow-card)] transition-all duration-200 hover:shadow-[var(--shadow-card-hover)] ${
        accent === 'premium' ? 'border-premium/40 ring-1 ring-premium/10' : hoverGlow
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">{label}</p>
          <p
            className={`mt-1 font-display text-2xl font-semibold md:text-3xl ${
              accent === 'premium' ? 'text-premium' : 'text-text-primary'
            }`}
          >
            {typeof value === 'number' && value >= 1000 ? value.toLocaleString() : value}
          </p>
          {subtext && <p className="mt-0.5 text-xs text-text-muted">{subtext}</p>}
        </div>
        {icon && <div className="text-accent/80">{icon}</div>}
      </div>
    </div>
  )
}
