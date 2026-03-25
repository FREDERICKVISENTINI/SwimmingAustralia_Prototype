import { Calendar, MapPin, Users } from 'lucide-react'
import type { NearbyProgram } from '../../types/pathwayRecommendations'
import { SpotsRemaining } from '../events/SpotsRemaining'

type Props = { program: NearbyProgram }

export function NearbyProgramCard({ program }: Props) {
  return (
    <article className="group rounded-[var(--radius-card)] border border-border/80 bg-card p-5 text-left shadow-[var(--shadow-card)] transition-all hover:border-accent/30 hover:shadow-[var(--shadow-card-hover)]">
      <div>
        <span className="inline-flex rounded-md border border-border bg-bg-elevated px-2 py-0.5 text-xs font-medium text-text-muted">
          {program.category}
        </span>
      </div>

      <h3 className="mt-2.5 font-display text-base font-semibold text-text-primary transition-colors group-hover:text-accent">
        {program.title}
      </h3>

      <p className="mt-2 line-clamp-2 text-sm text-text-secondary">{program.description}</p>

      <div className="mt-3 space-y-1.5 text-sm text-text-secondary">
        {program.nextSessionSummary ? (
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 shrink-0 text-text-muted" aria-hidden />
            {program.nextSessionSummary}
          </div>
        ) : null}
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-text-muted" aria-hidden />
          {program.location}
        </div>
        {program.coachName ? (
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 shrink-0 text-text-muted" aria-hidden />
            <span>{program.coachName}</span>
          </div>
        ) : null}
      </div>

      <div className="mt-4">
        <SpotsRemaining registered={program.registered} capacity={program.capacity} />
      </div>

      <div className="mt-4">
        <button
          type="button"
          className="w-full rounded-[var(--radius-button)] bg-accent px-4 py-2.5 text-sm font-semibold text-bg transition hover:bg-accent-bright"
        >
          {program.ctaLabel}
        </button>
      </div>
    </article>
  )
}
