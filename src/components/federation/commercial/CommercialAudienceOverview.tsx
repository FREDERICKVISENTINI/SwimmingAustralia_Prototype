import type { CommercialAudienceKpi } from '../../../data/federationCommercialInsights'

type Props = { kpis: CommercialAudienceKpi[] }

export function CommercialAudienceOverview({ kpis }: Props) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="font-display text-base font-semibold text-text-primary">Commercial audience overview</h3>
        <p className="mt-1 max-w-3xl text-sm text-text-secondary">
          Addressable segments derived from unified registrations, club affiliation, pathway stage, and event
          entries — framed as inventory, not generic traffic.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {kpis.map((k) => (
          <div
            key={k.id}
            className={`rounded-[var(--radius-card)] border p-4 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)] ${
              k.accent === 'premium'
                ? 'border-premium/35 bg-gradient-to-br from-premium/[0.07] to-card'
                : 'border-border/80 bg-card'
            }`}
          >
            <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-text-muted">{k.label}</p>
            <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-text-primary">{k.value}</p>
            <p className="mt-1 text-xs text-text-secondary leading-snug">{k.sublabel}</p>
            {k.footnote && <p className="mt-2 border-t border-border/50 pt-2 text-[0.7rem] leading-relaxed text-text-muted">{k.footnote}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}
