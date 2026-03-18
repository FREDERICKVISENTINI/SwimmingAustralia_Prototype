import type { MeetResult } from '../../types/insights'

type Props = {
  results: MeetResult[]
  /** Show most recent first (sorted by dateISO desc). */
  sortByDateDesc?: boolean
  selectedResultId?: string | null
  onSelectResult?: (result: MeetResult) => void
}

export function MeetDataTable({
  results,
  sortByDateDesc = true,
  selectedResultId = null,
  onSelectResult,
}: Props) {
  const sorted = sortByDateDesc
    ? [...results].sort((a, b) => b.dateISO.localeCompare(a.dateISO))
    : results

  if (results.length === 0) {
    return (
      <div className="rounded-[var(--radius-card)] border border-border bg-card p-6 text-center text-sm text-text-muted">
        No meet results yet. Your results will appear here when they are submitted.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-card shadow-[var(--shadow-card)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-elevated/80">
              <th className="px-4 py-3 font-medium text-text-muted">Meet</th>
              <th className="px-4 py-3 font-medium text-text-muted">Date</th>
              <th className="px-4 py-3 font-medium text-text-muted">Event</th>
              <th className="px-4 py-3 font-medium text-text-muted">Time</th>
              <th className="px-4 py-3 font-medium text-text-muted">Place</th>
              <th className="px-4 py-3 font-medium text-text-muted" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => {
              const isSelected = selectedResultId === row.id
              return (
                <tr
                  key={row.id}
                  role={onSelectResult ? 'button' : undefined}
                  tabIndex={onSelectResult ? 0 : undefined}
                  onClick={onSelectResult ? () => onSelectResult(row) : undefined}
                  onKeyDown={
                    onSelectResult
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            onSelectResult(row)
                          }
                        }
                      : undefined
                  }
                  className={`border-b border-border/70 last:border-0 ${
                    onSelectResult ? 'cursor-pointer transition-colors hover:bg-bg-elevated/60' : ''
                  } ${isSelected ? 'bg-accent/15' : ''}`}
                >
                  <td className="px-4 py-3 text-text-primary">{row.meetName}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.date}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.event}</td>
                  <td className="px-4 py-3 font-medium text-text-primary">{row.time}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.placement ?? '—'}</td>
                  <td className="px-4 py-3">
                    {row.isPB && (
                      <span className="rounded bg-success/20 px-2 py-0.5 text-xs font-medium text-success">
                        PB
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
