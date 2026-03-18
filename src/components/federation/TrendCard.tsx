type Props = {
  label: string
  value: string | number
  trend?: 'up' | 'down' | 'stable'
  subtext?: string
  className?: string
}

export function TrendCard({ label, value, trend, subtext, className = '' }: Props) {
  const trendLabel = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'
  const trendColor =
    trend === 'up' ? 'text-success' : trend === 'down' ? 'text-red-400' : 'text-text-muted'
  return (
    <div
      className={`rounded-[var(--radius-card)] border border-border/80 bg-card p-4 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] ${className}`}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-text-muted">{label}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="font-display text-xl font-semibold text-text-primary">{value}</span>
        {trend !== undefined && <span className={`text-sm ${trendColor}`}>{trendLabel}</span>}
      </div>
      {subtext && <p className="mt-0.5 text-xs text-text-muted">{subtext}</p>}
    </div>
  )
}
