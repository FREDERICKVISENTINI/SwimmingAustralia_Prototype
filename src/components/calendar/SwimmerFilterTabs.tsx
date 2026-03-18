type Props = {
  swimmers: string[]
  selectedSwimmer: string | null
  onSelect: (swimmer: string | null) => void
}

export function SwimmerFilterTabs({
  swimmers,
  selectedSwimmer,
  onSelect,
}: Props) {
  if (swimmers.length <= 1) return null

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
          selectedSwimmer === null
            ? 'bg-accent text-bg'
            : 'border border-border bg-bg-elevated text-text-secondary hover:bg-card hover:text-text-primary'
        }`}
      >
        All swimmers
      </button>
      {swimmers.map((name) => (
        <button
          key={name}
          type="button"
          onClick={() => onSelect(name)}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            selectedSwimmer === name
              ? 'bg-accent text-bg'
              : 'border border-border bg-bg-elevated text-text-secondary hover:bg-card hover:text-text-primary'
          }`}
        >
          {name}
        </button>
      ))}
    </div>
  )
}
