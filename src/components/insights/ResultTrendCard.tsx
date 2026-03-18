import type { MeetResult } from '../../types/insights'

/** Parse time string to seconds for comparison. "42.15" -> 42.15, "1:04.22" -> 64.22 */
function timeToSeconds(t: string): number | null {
  if (!t || t === '—') return null
  const parts = t.trim().split(':')
  if (parts.length === 1) return parseFloat(parts[0]) || null
  if (parts.length === 2) {
    const min = parseInt(parts[0], 10)
    const sec = parseFloat(parts[1])
    if (Number.isNaN(min) || Number.isNaN(sec)) return null
    return min * 60 + sec
  }
  return null
}

/** Compute trend from list of times (oldest first). Lower is better. */
function getTrendLabel(resultsWithTime: { time: string }[]): 'Improving' | 'Stable' | 'Building' {
  const secs = resultsWithTime.map((r) => timeToSeconds(r.time)).filter((s): s is number => s != null)
  if (secs.length < 2) return 'Stable'
  const first = secs[0]
  const last = secs[secs.length - 1]
  const diff = last - first
  if (diff < -0.1) return 'Improving'
  if (diff > 0.1) return 'Building'
  return 'Stable'
}

type Props = {
  event: string
  /** Results for this event, sorted by date ascending (oldest first). */
  results: MeetResult[]
}

export function ResultTrendCard({ event, results }: Props) {
  const withTime = results.filter((r) => r.time !== '—' && r.time.trim() !== '')
  const sorted = [...withTime].sort((a, b) => a.dateISO.localeCompare(b.dateISO))
  const trend = getTrendLabel(sorted)

  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-text-primary">Trend · {event}</h3>
        <span
          className={`rounded px-2 py-1 text-xs font-medium ${
            trend === 'Improving'
              ? 'bg-success/20 text-success'
              : trend === 'Building'
                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                : 'bg-bg-elevated text-text-secondary'
          }`}
        >
          {trend}
        </span>
      </div>
      <ul className="space-y-2 text-sm">
        {sorted.map((r) => (
          <li key={r.id} className="flex items-center justify-between gap-2 border-b border-border/50 pb-2 last:border-0 last:pb-0">
            <span className="text-text-secondary">{r.date}</span>
            <span className="flex items-center gap-2 font-medium text-text-primary">
              {r.time}
              {r.isPB && (
                <span className="rounded bg-success/20 px-1.5 py-0.5 text-xs text-success">PB</span>
              )}
            </span>
          </li>
        ))}
      </ul>
      {sorted.length < 2 && (
        <p className="mt-2 text-xs text-text-muted">Race this event again to see a trend.</p>
      )}
    </div>
  )
}
