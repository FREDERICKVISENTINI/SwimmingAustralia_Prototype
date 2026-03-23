type Props = { registered: number; capacity: number }

export function SpotsRemaining({ registered, capacity }: Props) {
  const remaining = capacity - registered
  const pct = Math.min(registered / capacity, 1)
  const colour =
    remaining === 0
      ? 'text-red-400'
      : remaining <= 3
        ? 'text-amber-400'
        : 'text-success'

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2 text-xs">
        <span className="text-text-muted">{registered} / {capacity} registered</span>
        <span className={`font-semibold ${colour}`}>
          {remaining === 0 ? 'Full' : `${remaining} spot${remaining === 1 ? '' : 's'} left`}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-border/60">
        <div
          className={`h-full rounded-full transition-all ${
            remaining === 0 ? 'bg-red-400' : remaining <= 3 ? 'bg-amber-400' : 'bg-success'
          }`}
          style={{ width: `${pct * 100}%` }}
        />
      </div>
    </div>
  )
}
