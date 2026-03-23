import type { EventType } from '../../types/club'

const CONFIG: Record<EventType, { label: string; className: string }> = {
  'training-session': { label: 'Training', className: 'bg-accent/15 text-accent' },
  meet:               { label: 'Meet', className: 'bg-success/15 text-success' },
  clinic:             { label: 'Clinic', className: 'bg-premium/15 text-premium' },
  'testing-day':      { label: 'Testing Day', className: 'bg-purple-500/15 text-purple-400' },
}

export function EventTypeBadge({ type }: { type: EventType }) {
  const { label, className } = CONFIG[type] ?? CONFIG['training-session']
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>
      {label}
    </span>
  )
}
