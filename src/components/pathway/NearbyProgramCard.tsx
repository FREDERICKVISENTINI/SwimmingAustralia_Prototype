import type { NearbyProgram } from '../../types/pathwayRecommendations'

type Props = { program: NearbyProgram }

export function NearbyProgramCard({ program }: Props) {
  return (
    <article className="rounded-[var(--radius-card)] border border-border bg-card p-4 text-left shadow-[var(--shadow-card)] transition-colors hover:border-accent/30">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-display font-semibold text-text-primary">
          {program.title}
        </h3>
        <span className="rounded-md border border-border bg-bg-elevated px-2 py-0.5 text-xs text-text-muted">
          {program.category}
        </span>
      </div>
      <p className="mt-2 text-sm text-text-secondary">{program.description}</p>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-muted">
        <span>{program.location}</span>
        {program.distance && <span>{program.distance}</span>}
      </div>
      <div className="mt-3">
        <button
          type="button"
          className="rounded-[var(--radius-button)] bg-accent/20 px-3 py-1.5 text-sm font-medium text-accent transition-colors hover:bg-accent/30"
        >
          {program.ctaLabel}
        </button>
      </div>
    </article>
  )
}
