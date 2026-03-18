type Item = { id: string; title: string; description: string; ctaLabel: string }

type Props = { title: string; items: Item[] }

export function SponsorshipCard({ title, items }: Props) {
  return (
    <div className="rounded-[var(--radius-card)] border border-premium/40 bg-card p-5 shadow-[var(--shadow-card)] ring-1 ring-premium/10 md:p-6">
      <p className="text-xs font-medium uppercase tracking-wider text-premium">
        {title}
      </p>
      <ul className="mt-4 space-y-4">
        {items.map((item) => (
          <li key={item.id} className="border-b border-border/50 pb-4 last:border-0 last:pb-0">
            <h4 className="font-display font-semibold text-text-primary">
              {item.title}
            </h4>
            <p className="mt-1 text-sm text-text-secondary">{item.description}</p>
            <button
              type="button"
              className="mt-2 rounded-[var(--radius-button)] bg-premium/20 px-3 py-1.5 text-sm font-medium text-premium transition-colors hover:bg-premium/30"
            >
              {item.ctaLabel}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
