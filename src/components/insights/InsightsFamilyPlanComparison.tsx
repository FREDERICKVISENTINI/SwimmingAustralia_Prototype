import { Link } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import { getParentFreeVsPremiumDiffRows } from '../../data/plansTierComparison'
import { ROUTES } from '../../routes'

function Cell({ on }: { on: boolean }) {
  return on ? (
    <Check className="mx-auto h-5 w-5 text-success" aria-label="Included" />
  ) : (
    <X className="mx-auto h-5 w-5 text-text-muted/50" aria-label="Not included" />
  )
}

type Props = {
  /** When false, only the “how money is made” card is shown (e.g. checklist already above). */
  showComparisonTable?: boolean
}

/**
 * Parent/family only: revenue context + optional Free vs Family Premium diff table.
 * Club Pro is omitted — see Plans & billing for club tiers.
 */
export function InsightsFamilyPlanComparison({ showComparisonTable = true }: Props) {
  const diffRows = showComparisonTable ? getParentFreeVsPremiumDiffRows() : []

  return (
    <div className={`space-y-8 ${showComparisonTable ? 'border-t border-border/60 pt-8' : ''}`}>
      <div className="rounded-[var(--radius-card)] border border-border/80 bg-card p-5 shadow-[var(--shadow-card)] md:p-6">
        <h3 className="font-display text-base font-semibold text-text-primary">How money is made on the platform</h3>
        <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm text-text-secondary">
          <li>
            <strong className="text-text-primary">Subscriptions</strong> — parent/family access to insights, benchmarking,
            and expert outputs.
          </li>
          <li>
            <strong className="text-text-primary">Club &amp; platform fees</strong> — squad tools, premium analytics, and
            HP integrations (see{' '}
            <Link to={ROUTES.app.plans} className="font-medium text-accent hover:underline">
              Plans &amp; billing
            </Link>
            ).
          </li>
          <li>
            <strong className="text-text-primary">Events &amp; competitions</strong> — registration and service fees
            (Calendar → Events and Payments).
          </li>
        </ul>
      </div>

      {showComparisonTable ? (
      <div>
        <h3 className="font-display text-base font-semibold text-text-primary">Free vs Family Premium</h3>
        <p className="mt-1 text-sm text-text-muted">
          Where the family subscription adds capability — same features as the Plans page, without club-only tiers.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-elevated/50">
                <th className="px-4 py-3 text-left font-display font-semibold text-text-primary">Capability</th>
                <th className="px-4 py-3 text-center font-semibold text-text-secondary">Free</th>
                <th className="px-4 py-3 text-center font-semibold text-premium">Family Premium</th>
              </tr>
            </thead>
            <tbody>
              {diffRows.map((row) => (
                <tr key={row.label} className="border-b border-border/60">
                  <td className="px-4 py-3 text-text-secondary">{row.label}</td>
                  <td className="px-4 py-3 text-center">
                    <Cell on={row.free} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Cell on={row.premium} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-text-muted">
          <strong className="font-medium text-text-primary">Club Pro</strong> (rosters, advanced club analytics) applies
          to club accounts only — not part of a family subscription.
        </p>
        <p className="mt-2 text-xs text-text-muted">
          <Link to={ROUTES.app.plans} className="font-medium text-accent hover:underline">
            Plans &amp; billing
          </Link>{' '}
          has the full tier matrix including club tools.
        </p>
      </div>
      ) : null}
    </div>
  )
}
