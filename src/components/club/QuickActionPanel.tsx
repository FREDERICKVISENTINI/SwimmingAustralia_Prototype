type Action = { label: string; onClick: () => void }

type Props = { actions: Action[] }

export function QuickActionPanel({ actions }: Props) {
  return (
    <div className="rounded-[var(--radius-card)] border border-border/80 bg-card p-4 shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)]">
      <p className="text-xs font-medium uppercase tracking-wider text-text-muted border-l-2 border-accent/50 pl-3">Quick actions</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {actions.map(({ label, onClick }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            className="rounded-[var(--radius-button)] bg-accent/20 px-3 py-2 text-sm font-medium text-accent transition-all duration-200 hover:bg-accent/35 hover:shadow-[0_0_12px_-2px_rgb(53,199,243,0.3)] hover:-translate-y-0.5"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
