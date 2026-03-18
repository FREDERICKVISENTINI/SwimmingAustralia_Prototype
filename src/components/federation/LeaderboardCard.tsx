import type { ReactNode } from 'react'

type Row = {
  rank: number
  name: string
  metric: string
  label?: string
}

type Props = {
  title: string
  rows: readonly Row[] | Row[]
  renderExtra?: (row: Row) => ReactNode
  className?: string
}

export function LeaderboardCard({ title, rows, renderExtra, className = '' }: Props) {
  return (
    <div
      className={`rounded-[var(--radius-card)] border border-border/80 bg-card p-5 shadow-[var(--shadow-card)] ${className}`}
    >
      <h3 className="text-sm font-semibold text-text-primary mb-3">{title}</h3>
      <ul className="space-y-2">
        {rows.map((row) => (
          <li
            key={row.rank}
            className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 hover:bg-bg-elevated/40"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-medium text-text-muted w-5 shrink-0">{row.rank}</span>
              <span className="truncate text-sm text-text-primary">{row.name}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm font-medium text-accent">{row.metric}</span>
              {renderExtra && renderExtra(row)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
