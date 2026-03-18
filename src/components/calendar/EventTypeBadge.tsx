import type { CalendarEventType } from '../../types/calendar'

const TYPE_LABELS: Record<CalendarEventType, string> = {
  training: 'Training',
  competition: 'Competition',
  assessment: 'Assessment',
  'camp-program': 'Camp / Program',
  'club-event': 'Club Event',
}

const TYPE_STYLES: Record<CalendarEventType, string> = {
  training: 'bg-accent/20 text-accent border border-accent/40',
  competition: 'bg-success/20 text-success border border-success/40',
  assessment: 'bg-premium/20 text-premium border border-premium/40',
  'camp-program': 'bg-accent/10 text-accent-bright border border-accent/30',
  'club-event': 'bg-bg-elevated text-text-muted border border-border',
}

type Props = { type: CalendarEventType; className?: string }

export function EventTypeBadge({ type, className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${TYPE_STYLES[type]} ${className}`}
    >
      {TYPE_LABELS[type]}
    </span>
  )
}
