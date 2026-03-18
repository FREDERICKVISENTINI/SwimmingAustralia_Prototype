import type { CalendarActivityFilter, CalendarViewMode } from '../../types/calendar'

const VIEW_LABELS: Record<CalendarViewMode, string> = {
  month: 'Month',
  week: 'Week',
  agenda: 'Agenda',
}

const ACTIVITY_OPTIONS: { value: CalendarActivityFilter; label: string }[] = [
  { value: 'all', label: 'All activities' },
  { value: 'training', label: 'Training' },
  { value: 'competition', label: 'Competitions' },
  { value: 'assessment', label: 'Assessments' },
  { value: 'camp-program', label: 'Camps / Programs' },
  { value: 'club-event', label: 'Club Event' },
]

type Props = {
  viewMode: CalendarViewMode
  onViewModeChange: (mode: CalendarViewMode) => void
  activityFilter: CalendarActivityFilter
  onActivityFilterChange: (filter: CalendarActivityFilter) => void
}

export function CalendarFilterBar({
  viewMode,
  onViewModeChange,
  activityFilter,
  onActivityFilterChange,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex rounded-lg border border-border bg-bg-elevated p-0.5">
        {(['month', 'week', 'agenda'] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => onViewModeChange(mode)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              viewMode === mode
                ? 'bg-accent text-bg'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {VIEW_LABELS[mode]}
          </button>
        ))}
      </div>
      <select
        value={activityFilter}
        onChange={(e) => onActivityFilterChange(e.target.value as CalendarActivityFilter)}
        className="rounded-[var(--radius-button)] border border-border bg-bg-elevated px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      >
        {ACTIVITY_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
