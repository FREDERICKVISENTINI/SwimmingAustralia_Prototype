import type { ReactNode } from 'react'

type Props = {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
}

export function CalendarSummaryCard({ title, value, subtitle, icon }: Props) {
  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
            {title}
          </p>
          <p className="mt-1 font-display text-xl font-semibold text-text-primary">
            {value}
          </p>
          {subtitle && (
            <p className="mt-0.5 text-sm text-text-secondary">{subtitle}</p>
          )}
        </div>
        {icon && (
          <span className="text-text-muted opacity-80" aria-hidden>
            {icon}
          </span>
        )}
      </div>
    </div>
  )
}
