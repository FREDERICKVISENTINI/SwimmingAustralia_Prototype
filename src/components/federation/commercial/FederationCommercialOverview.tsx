import type { ReactNode } from 'react'

/**
 * National commercial narrative for the federation Commercial section.
 * Figures are structured demo data — production would aggregate registrations, spend proxies, and engagement.
 */

function InsightCard({
  title,
  value,
  description,
  insight,
}: {
  title: string
  value: string
  description: string
  insight: string
}) {
  return (
    <div className="rounded-[var(--radius-card)] border border-border/80 bg-card p-4 shadow-[var(--shadow-card)]">
      <p className="text-sm text-text-muted">{title}</p>
      <p className="text-2xl font-semibold text-text-primary tabular-nums">{value}</p>
      <p className="text-sm text-text-secondary">{description}</p>
      <p className="mt-1 text-xs text-accent">{insight}</p>
    </div>
  )
}

function Explanation({ children }: { children: ReactNode }) {
  return <p className="mt-2 border-t border-border/60 pt-2 text-xs text-text-muted">{children}</p>
}

export function FederationCommercialOverview() {
  return (
    <div className="space-y-8">
      <div className="rounded-[var(--radius-card)] border border-border/80 bg-card p-5 shadow-[var(--shadow-card)]">
        <h2 className="text-sm font-semibold text-text-primary">What this page shows</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text-secondary">
          A <strong className="font-medium text-text-primary">monetisation intelligence layer</strong> — where value sits in
          the swimming ecosystem, where it leaks, and where it can be extracted. This is not a revenue report: it is a
          structured view of <strong className="font-medium text-text-primary">audience scale</strong>,{' '}
          <strong className="font-medium text-text-primary">pathway friction</strong>,{' '}
          <strong className="font-medium text-text-primary">family economics</strong>,{' '}
          <strong className="font-medium text-text-primary">engagement concentration</strong>, and{' '}
          <strong className="font-medium text-text-primary">event and infrastructure leverage</strong>. Figures are{' '}
          <strong className="font-medium text-text-primary">illustrative</strong>; production would tie registrations,
          payments, attendance, and meet entries to sponsor-ready reach and ROI.
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text-muted">
          Every block below implies an action: who to target, what to fix, and where Swimming Australia can package
          inventory before brands.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">Core commercial signals</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <InsightCard
            title="Largest sponsorable entry audience"
            value="1.2M"
            description="Learn-to-swim participants — mass youth reach at top of funnel (illustrative)"
            insight="Package national L2S inventory for brands that need household penetration, not niche sport reach"
          />
          <InsightCard
            title="Parents drive the economic layer"
            value="800k"
            description="Active family units linked to junior registrations (illustrative)"
            insight="Decision-makers on fees, travel, and gear — anchor partnerships around family journeys, not individual athletes"
          />
          <InsightCard
            title="Engagement predicts monetisation"
            value="~65%"
            description="Estimated share of ecosystem spend from top 30% most active swimmers (illustrative)"
            insight="Prioritise high-engagement cohorts for partner pilots — disproportionate ROI vs long tail"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-2 rounded-[var(--radius-card)] border border-border/80 bg-card p-5 shadow-[var(--shadow-card)]">
          <h2 className="font-semibold text-text-primary">Family vs individual spend</h2>
          <p className="text-2xl font-semibold tabular-nums text-text-primary">$1,500–$2,000</p>
          <p className="text-sm text-text-secondary">
            Avg annual spend per swimmer — family-funded through junior years; competitive tier typically 2–3× (illustrative)
          </p>
          <Explanation>
            Swimming runs as a family-funded ecosystem: bundle affiliates, travel partners, and gear offers where spend
            concentrates — avoid optimising only for individual athlete tiers early in the pathway.
          </Explanation>
        </div>

        <div className="space-y-2 rounded-[var(--radius-card)] border border-border/80 bg-card p-5 shadow-[var(--shadow-card)]">
          <h2 className="font-semibold text-text-primary">Commercial hotspots</h2>
          <ul className="space-y-1 text-sm text-text-secondary">
            <li>Gold Coast +111% YoY commercial intensity index (demo)</li>
            <li>Inner West Sydney +95% — over-subscribed facilities, pricing power</li>
            <li>Eastern Melbourne +77% — travel-linked meet spend cluster</li>
          </ul>
          <Explanation>
            High-demand regions support premium pricing and expansion; travel-heavy meet corridors are under-leveraged for
            accommodation, transport, and logistics partners.
          </Explanation>
        </div>

        <div className="space-y-2 rounded-[var(--radius-card)] border border-border/80 bg-card p-5 shadow-[var(--shadow-card)]">
          <h2 className="font-semibold text-text-primary">Performance pipeline (spotlight)</h2>
          <p className="text-2xl font-semibold tabular-nums text-text-primary">210k</p>
          <p className="text-sm text-text-secondary">
            Competitive swimmers — strongest alignment with performance brands; top ~10% of cohorts drive disproportionate
            discretionary spend (illustrative)
          </p>
          <ul className="space-y-1 text-sm text-text-secondary">
            <li>Aaron Thompson — broadcast & rights storylines</li>
            <li>Emily Wilson — premium product & sponsorship fit</li>
            <li>Lily Chen — national pathway visibility for long-term brand association</li>
          </ul>
          <Explanation>
            Named pathway athletes anchor premium tiers: use elite concentration to package broadcast, rights, and brand
            alignment beyond raw participation numbers.
          </Explanation>
        </div>
      </section>

      <section className="rounded-[var(--radius-card)] border border-accent/25 bg-accent/5 p-5">
        <h2 className="font-semibold text-accent">Addressable opportunity — illustrative scale</h2>
        <ul className="mt-3 space-y-2 text-sm text-text-secondary">
          <li>
            <strong className="font-medium text-text-primary">$320M</strong> Learn-to-Swim sponsorship market — mass reach
            at national scale; ideal for household brands and participation narratives.
          </li>
          <li>
            <strong className="font-medium text-text-primary">$210M</strong> retention opportunity from drop-off cohorts —
            fix bridge-to-club leakage before value compounds; intervention products and partnerships.
          </li>
          <li>
            <strong className="font-medium text-text-primary">$95M</strong> regional expansion gap — underserved corridors vs
            demand; franchise programs, facility partnerships, and sponsor-led geo pilots.
          </li>
          <li>
            <strong className="font-medium text-text-primary">$70M</strong> event commercialisation potential — meets
            concentrate attention; vendors, ticketing, and on-site activation under-indexed vs attendance.
          </li>
          <li>
            <strong className="font-medium text-text-primary">$40M</strong> idle facility monetisation — off-peak pool
            capacity; programmes, bookings, and private access where demand exceeds slot supply.
          </li>
        </ul>
      </section>
    </div>
  )
}
