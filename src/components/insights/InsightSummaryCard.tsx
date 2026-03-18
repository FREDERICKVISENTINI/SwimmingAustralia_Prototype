import type { ReactNode } from 'react'

type Props = {
  title?: string
  children: ReactNode
  className?: string
}

export function InsightSummaryCard({ title, children, className = '' }: Props) {
  return (
    <div
      className={`rounded-[var(--radius-card)] border border-border/80 bg-card p-5 shadow-[var(--shadow-card)] transition-all duration-200 hover:shadow-[var(--shadow-card-hover)] hover:border-accent/20 ${className}`}
    >
      {title && (
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted border-l-2 border-accent/50 pl-3">
          {title}
        </h3>
      )}
      <div className={title ? 'mt-3' : ''}>{children}</div>
    </div>
  )
}
