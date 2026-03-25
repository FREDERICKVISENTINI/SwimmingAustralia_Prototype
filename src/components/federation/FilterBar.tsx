import type { FederationFilters } from '../../data/federationDashboardData'
import { FEDERATION_FILTER_OPTIONS } from '../../data/federationDashboardData'

type Props = {
  filters: FederationFilters
  onFilterChange: (key: keyof FederationFilters, value: string) => void
}

export function FilterBar({ filters, onFilterChange }: Props) {
  const selectClass =
    'rounded-lg border border-border bg-bg-elevated px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent min-w-0'

  return (
    <div className="rounded-[var(--radius-card)] border border-border/80 border-l-4 border-l-accent bg-card/60 p-4 shadow-[var(--shadow-card)]">
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-accent/90">
        Global filters
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={filters.ageGroup}
          onChange={(e) => onFilterChange('ageGroup', e.target.value)}
          className={selectClass}
          aria-label="Age group"
        >
          {FEDERATION_FILTER_OPTIONS.ageGroup.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={filters.gender}
          onChange={(e) => onFilterChange('gender', e.target.value)}
          className={selectClass}
          aria-label="Gender"
        >
          {FEDERATION_FILTER_OPTIONS.gender.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={filters.state}
          onChange={(e) => onFilterChange('state', e.target.value)}
          className={selectClass}
          aria-label="State / region"
        >
          {FEDERATION_FILTER_OPTIONS.state.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={filters.club}
          onChange={(e) => onFilterChange('club', e.target.value)}
          className={selectClass}
          aria-label="Club"
        >
          <option value="all">All clubs</option>
          <option value="melbourne-vicentre">Melbourne Vicentre</option>
          <option value="sopac">SOPAC</option>
          <option value="chandler">Chandler</option>
          <option value="other">Other clubs</option>
        </select>
        <select
          value={filters.pathwayStage}
          onChange={(e) => onFilterChange('pathwayStage', e.target.value)}
          className={selectClass}
          aria-label="Pathway stage"
        >
          {FEDERATION_FILTER_OPTIONS.pathwayStage.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={filters.programType}
          onChange={(e) => onFilterChange('programType', e.target.value)}
          className={selectClass}
          aria-label="Program type"
        >
          {FEDERATION_FILTER_OPTIONS.programType.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={filters.stroke}
          onChange={(e) => onFilterChange('stroke', e.target.value)}
          className={selectClass}
          aria-label="Stroke"
        >
          {FEDERATION_FILTER_OPTIONS.stroke.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={filters.distance}
          onChange={(e) => onFilterChange('distance', e.target.value)}
          className={selectClass}
          aria-label="Distance"
        >
          {FEDERATION_FILTER_OPTIONS.distance.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={filters.meetLevel}
          onChange={(e) => onFilterChange('meetLevel', e.target.value)}
          className={selectClass}
          aria-label="Meet level"
        >
          {FEDERATION_FILTER_OPTIONS.meetLevel.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
