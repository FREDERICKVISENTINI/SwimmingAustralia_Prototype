import type { ReactNode } from 'react'
import type { SponsorableCohort } from '../../../data/federationCommercialInsights'
import { Target } from 'lucide-react'

type Props = { cohorts: SponsorableCohort[] }

/** Bold key pathway terms in axes copy for scanability. */
function axesWithBoldHighlights(text: string): ReactNode {
  const parts = text.split(/(recreational|competitive)/gi)
  return parts.map((part, i) =>
    /^(recreational|competitive)$/i.test(part) ? (
      <strong key={i} className="font-semibold text-text-primary">
        {part}
      </strong>
    ) : (
      part
    )
  )
}

export function SponsorableCohortsPanel({ cohorts }: Props) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-premium/12 text-premium">
          <Target className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <h3 className="font-display text-base font-semibold text-text-primary">Targeting &amp; segmentation</h3>
          <p className="mt-1 max-w-3xl text-sm text-text-secondary">
            Sponsor-ready cohorts built from age, pathway, region, meet level, and household linkage — packaged the
            way partnership teams brief campaigns.
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {cohorts.map((c) => (
          <article
            key={c.id}
            className="flex flex-col rounded-[var(--radius-card)] border border-border/80 bg-card p-4 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-start justify-between gap-3">
              <h4 className="min-w-0 font-display text-sm font-semibold leading-snug text-text-primary">{c.title}</h4>
              <div className="flex max-w-[min(100%,14rem)] shrink-0 flex-col items-end gap-1.5 text-right">
                <span className="rounded-md bg-bg-elevated px-2 py-0.5 text-xs font-semibold tabular-nums text-accent">
                  {c.size.toLocaleString()}
                </span>
                {c.sizeCallout && (
                  <p className="rounded-md border border-amber-500/35 bg-amber-500/10 px-2 py-1.5 text-[0.65rem] font-medium leading-snug text-amber-950 dark:text-amber-100/95">
                    {c.sizeCallout}
                  </p>
                )}
              </div>
            </div>
            <p className="mt-2 text-[0.7rem] font-medium uppercase tracking-wide text-text-muted">Axes</p>
            <p className="mt-0.5 text-xs text-text-secondary">{axesWithBoldHighlights(c.axes)}</p>
            <p className="mt-3 text-[0.7rem] font-medium uppercase tracking-wide text-premium">Sponsor fit</p>
            <p className="mt-0.5 text-sm text-text-primary">{c.sponsorFit}</p>
            <p className="mt-3 border-t border-border/60 pt-3 text-xs leading-relaxed text-text-muted">{c.valueNote}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
