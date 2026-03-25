import { Link } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { PageSection } from '../components/layout/PageSection'
import { ROUTES } from '../routes'
import { TIER_FEATURES } from '../data/plansTierComparison'

function Cell({ on }: { on: boolean }) {
  return on ? (
    <Check className="mx-auto h-5 w-5 text-success" aria-label="Included" />
  ) : (
    <X className="mx-auto h-5 w-5 text-text-muted/50" aria-label="Not included" />
  )
}

export function PlansPage() {
  const { accountType, isPremiumTier, setIsPremiumTier } = useApp()
  const isParent = accountType === 'parent'
  const isClub = accountType === 'club'

  return (
    <PageSection
      title="Plans & billing"
      subtitle="Prototype revenue map: what families and clubs pay for, and what unlocks premium data and analytics. Figures are illustrative."
    >
      <div className="rounded-[var(--radius-card)] border border-border/80 bg-card p-5 shadow-[var(--shadow-card)] md:p-6">
        <h2 className="font-display text-base font-semibold text-text-primary">How money is made on the platform</h2>
        <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm text-text-secondary">
          <li>
            <strong className="text-text-primary">Subscriptions</strong> — parent/family access to insights, benchmarking, and expert outputs.
          </li>
          <li>
            <strong className="text-text-primary">Club &amp; platform fees</strong> — squad tools, premium analytics, and HP integrations.
          </li>
          <li>
            <strong className="text-text-primary">Events &amp; competitions</strong> — registration and service fees (see Calendar → Events and Payments).
          </li>
        </ul>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-elevated/50">
              <th className="px-4 py-3 text-left font-display font-semibold text-text-primary">Capability</th>
              <th className="px-4 py-3 text-center font-semibold text-text-secondary">Free</th>
              <th className="px-4 py-3 text-center font-semibold text-premium">Family Premium</th>
              <th className="px-4 py-3 text-center font-semibold text-accent">Club Pro</th>
            </tr>
          </thead>
          <tbody>
            {TIER_FEATURES.map((row) => (
              <tr key={row.label} className="border-b border-border/60">
                <td className="px-4 py-3 text-text-secondary">{row.label}</td>
                <td className="px-4 py-3 text-center">
                  <Cell on={row.free} />
                </td>
                <td className="px-4 py-3 text-center">
                  <Cell on={row.premium} />
                </td>
                <td className="px-4 py-3 text-center">
                  <Cell on={row.clubPro} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
        {(isParent || isClub) && (
          <div className="flex flex-wrap items-center gap-3 rounded-[var(--radius-card)] border border-premium/30 bg-premium/5 px-4 py-3">
            <span className="text-sm font-medium text-text-primary">Premium tier (prototype)</span>
            <button
              type="button"
              onClick={() => setIsPremiumTier(!isPremiumTier)}
              className={`rounded-[var(--radius-button)] px-4 py-2 text-sm font-semibold transition ${
                isPremiumTier
                  ? 'bg-premium/25 text-premium ring-1 ring-premium/40'
                  : 'border border-border bg-bg-elevated text-text-primary hover:bg-bg-elevated/80'
              }`}
            >
              {isPremiumTier ? 'Premium enabled' : 'Enable Premium (demo)'}
            </button>
            <span className="text-xs text-text-muted">Unlocks club dashboard benchmarking and related gates.</span>
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          {isParent && (
            <Link
              to={ROUTES.app.insights}
              className="inline-flex items-center rounded-[var(--radius-button)] bg-accent px-4 py-2 text-sm font-semibold text-bg hover:bg-accent-bright"
            >
              Insights &amp; subscription
            </Link>
          )}
          <Link
            to={ROUTES.app.profileSettings}
            className="inline-flex items-center rounded-[var(--radius-button)] border border-border px-4 py-2 text-sm font-medium text-text-primary hover:bg-bg-elevated"
          >
            Settings
          </Link>
          <Link
            to={ROUTES.app.payments}
            className="inline-flex items-center rounded-[var(--radius-button)] border border-border px-4 py-2 text-sm font-medium text-text-primary hover:bg-bg-elevated"
          >
            Payments &amp; fees
          </Link>
        </div>
      </div>
    </PageSection>
  )
}
