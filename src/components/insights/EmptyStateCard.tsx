type Props = {
  title: string
  description?: string
  ctaLabel?: string
  onCtaClick?: () => void
}

export function EmptyStateCard({
  title,
  description,
  ctaLabel,
  onCtaClick,
}: Props) {
  return (
    <div className="rounded-[var(--radius-card)] border border-dashed border-border bg-card/50 p-8 text-center">
      <h3 className="font-display font-semibold text-text-primary">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-text-muted">{description}</p>
      )}
      {ctaLabel && (
        <button
          type="button"
          onClick={onCtaClick}
          className="mt-4 rounded-[var(--radius-button)] bg-accent/20 px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/30"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  )
}
