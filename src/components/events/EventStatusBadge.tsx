import type { EventStatus } from '../../types/club'

const CONFIG: Record<EventStatus, { label: string; className: string }> = {
  draft:     { label: 'Draft', className: 'bg-border/60 text-text-muted' },
  published: { label: 'Published', className: 'bg-success/15 text-success' },
  cancelled: { label: 'Cancelled', className: 'bg-red-500/15 text-red-400' },
}

export function EventStatusBadge({ status }: { status: EventStatus }) {
  const { label, className } = CONFIG[status] ?? CONFIG.draft
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>
      {label}
    </span>
  )
}
