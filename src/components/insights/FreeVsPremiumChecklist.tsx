import { Check, X } from 'lucide-react'
import { getParentFamilyTierComparison } from '../../data/plansTierComparison'

function Cell({ on }: { on: boolean }) {
  return on ? (
    <Check className="mx-auto h-5 w-5 text-success" aria-label="Included" />
  ) : (
    <X className="mx-auto h-5 w-5 text-text-muted/50" aria-label="Not included" />
  )
}

/** Parent Pro Plan tab: Free vs Family Premium capability checklist (same source as Plans page, without Club Pro). */
export function FreeVsPremiumChecklist() {
  const rows = getParentFamilyTierComparison()

  return (
    <section className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <h3 className="font-display text-base font-semibold text-text-primary border-b border-accent/30 pb-2">
        Free vs Family Premium
      </h3>
      <p className="mt-3 text-sm text-text-secondary">
        What your account can access today — Family Premium adds benchmarking, deeper insights, and expert outputs.{' '}
        <span className="text-text-muted">
          Club-only tools (rosters, advanced squad analytics) are not part of this family checklist.
        </span>
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-elevated/50">
              <th className="px-3 py-3 text-left font-display font-semibold text-text-primary">Capability</th>
              <th className="px-3 py-3 text-center font-semibold text-text-secondary">Free</th>
              <th className="px-3 py-3 text-center font-semibold text-premium">Family Premium</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-border/60 last:border-0">
                <td className="px-3 py-3 text-text-secondary">{row.label}</td>
                <td className="px-3 py-3 text-center">
                  <Cell on={row.free} />
                </td>
                <td className="px-3 py-3 text-center">
                  <Cell on={row.premium} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-text-muted">
        Rows where both tiers show “not included” are <strong className="font-medium text-text-primary">club programme</strong>{' '}
        features (Club Pro), not sold as part of a parent subscription.
      </p>
    </section>
  )
}
