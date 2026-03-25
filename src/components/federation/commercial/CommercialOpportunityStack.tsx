import type { RevenueOpportunity } from '../../../data/federationCommercialInsights'

const REVENUE_BADGE: Record<RevenueOpportunity['revenueType'], string> = {
  Sponsorship: 'bg-premium/12 text-premium border-premium/25',
  Subscription: 'bg-accent/12 text-accent border-accent/25',
  Services: 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 border-emerald-500/20',
  Events: 'bg-amber-500/10 text-amber-900 dark:text-amber-100 border-amber-500/25',
  'Data & analytics': 'bg-bg-elevated text-text-secondary border-border/80',
}

type Props = { opportunities: RevenueOpportunity[] }

export function CommercialOpportunityStack({ opportunities }: Props) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="font-display text-base font-semibold text-text-primary">Revenue opportunities &amp; packaging</h3>
        <p className="mt-1 max-w-3xl text-sm text-text-secondary">
          How audiences convert into monetisable products: sponsorship rights, subscriptions, services, and
          data-backed programmes — not undifferentiated “platform revenue”.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {opportunities.map((o) => (
          <article
            key={o.id}
            className="flex flex-col rounded-[var(--radius-card)] border border-border/80 bg-card/90 p-4 shadow-[var(--shadow-card)]"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide ${REVENUE_BADGE[o.revenueType]}`}
              >
                {o.revenueType}
              </span>
              {o.tier && (
                <span className="text-[0.65rem] font-medium text-text-muted">{o.tier}</span>
              )}
            </div>
            <h4 className="mt-2 font-display text-sm font-semibold leading-snug text-text-primary">{o.name}</h4>
            <p className="mt-1 text-xs text-text-muted">
              <span className="font-medium text-text-secondary">Audience:</span> {o.audience}
            </p>
            <p className="mt-3 flex-1 text-xs leading-relaxed text-text-secondary">{o.explanation}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
