import { FilterBar } from '../federation/FilterBar'
import { useInsightsFilters } from '../../context/InsightsFiltersContext'
import { Users, Flag, TrendingUp } from 'lucide-react'

/**
 * Global federation-style metrics filters shown on all Insights surfaces.
 */
export function InsightsMetricsFilters() {
  const { filters, onFilterChange, derived } = useInsightsFilters()

  return (
    <div className="mt-6 space-y-4">
      <FilterBar filters={filters} onFilterChange={onFilterChange} />
      <div
        className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-4 rounded-[var(--radius-card)] border p-4 text-sm ${
          derived.isFiltered
            ? 'border-accent/40 bg-accent/5'
            : 'border-border/80 bg-card/40'
        }`}
      >
        <div className="flex items-start gap-2">
          <Users className="h-4 w-4 shrink-0 text-accent mt-0.5" aria-hidden />
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
              Cohort size
            </p>
            <p className="font-semibold text-text-primary">
              {derived.total.toLocaleString()}{' '}
              <span className="font-normal text-text-secondary">swimmers</span>
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Flag className="h-4 w-4 shrink-0 text-accent mt-0.5" aria-hidden />
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
              Talent flags
            </p>
            <p className="font-semibold text-text-primary">
              {derived.talentFlaggedCount.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <TrendingUp className="h-4 w-4 shrink-0 text-accent mt-0.5" aria-hidden />
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
              Retention (stage)
            </p>
            <p className="font-semibold text-text-primary">{derived.retentionRate}%</p>
          </div>
        </div>
        <div className="flex items-center sm:col-span-2 lg:col-span-1">
          <p className="text-xs text-text-secondary leading-relaxed">
            {derived.isFiltered
              ? 'Tables and expert views below reflect this filtered cohort where applicable.'
              : 'National baseline — narrow filters to explore segments.'}
          </p>
        </div>
      </div>
    </div>
  )
}
