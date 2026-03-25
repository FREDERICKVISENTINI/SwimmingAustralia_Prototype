type Props = { children: string }

export function RecommendationRationaleTag({ children }: Props) {
  return (
    <span className="inline-flex rounded-md border border-border/80 bg-bg-elevated px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-text-muted">
      {children}
    </span>
  )
}
