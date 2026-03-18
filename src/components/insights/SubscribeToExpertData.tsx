import { useApp } from '../../context/AppContext'

export function SubscribeToExpertData() {
  const { accountType } = useApp()
  const isFederation = accountType === 'federation'

  if (isFederation) {
    return (
      <div className="rounded-[var(--radius-card)] border border-premium/40 bg-card p-5 shadow-[var(--shadow-card)] ring-1 ring-premium/10">
        <p className="text-xs font-medium uppercase tracking-wider text-premium">
          Federation high-performance data
        </p>
        <h3 className="mt-2 font-display text-lg font-semibold text-text-primary">
          Insights from federation high-performance data
        </h3>
        <p className="mt-2 text-sm text-text-secondary">
          Assessments, technique analysis, and high-performance outputs sourced from the federation’s high-performance systems. Data appears here as it is made available from national and state systems.
        </p>
        <button
          type="button"
          className="mt-4 rounded-[var(--radius-button)] bg-premium/20 px-4 py-2.5 text-sm font-medium text-premium transition-colors hover:bg-premium/30"
        >
          View federation high-performance insights
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-premium/40 bg-card p-5 shadow-[var(--shadow-card)] ring-1 ring-premium/10">
      <p className="text-xs font-medium uppercase tracking-wider text-premium">
        Expert data
      </p>
      <h3 className="mt-2 font-display text-lg font-semibold text-text-primary">
        Subscribe to expert data
      </h3>
      <p className="mt-2 text-sm text-text-secondary">
        Get assessments, technique analysis, and high-performance outputs from accredited providers. Data is retrieved from high-performance systems and appears in this tab once you subscribe.
      </p>
      <button
        type="button"
        className="mt-4 rounded-[var(--radius-button)] bg-premium/20 px-4 py-2.5 text-sm font-medium text-premium transition-colors hover:bg-premium/30"
      >
        Subscribe to expert data
      </button>
    </div>
  )
}
