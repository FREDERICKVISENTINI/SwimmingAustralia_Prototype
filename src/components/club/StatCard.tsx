import type { StatUpload } from '../../types/club'

type Props = {
  swimmerName: string
  latestMetric?: string
  latestValue?: string
  latestDate?: string | null
  pathwayStageId: string
  className?: string | null
  onUploadStats?: () => void
}

export function StatCard({
  swimmerName,
  latestMetric,
  latestValue,
  latestDate,
  pathwayStageId,
  className,
  onUploadStats,
}: Props) {
  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-semibold text-text-primary">{swimmerName}</h3>
        {onUploadStats && (
          <button
            type="button"
            onClick={onUploadStats}
            className="text-sm font-medium text-accent hover:underline"
          >
            Upload stats
          </button>
        )}
      </div>
      <p className="mt-1 text-sm text-text-secondary">{className ?? '—'} · {pathwayStageId.replace(/-/g, ' ')}</p>
      {(latestMetric || latestValue) && (
        <p className="mt-2 font-medium text-text-primary">
          {latestMetric ?? 'Latest'}: {latestValue ?? '—'}
        </p>
      )}
      {latestDate && <p className="mt-0.5 text-xs text-text-muted">Updated {latestDate}</p>}
    </div>
  )
}
