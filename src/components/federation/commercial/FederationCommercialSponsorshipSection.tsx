import { useMemo } from 'react'
import { deriveCommercialInsights } from '../../../data/federationCommercialInsights'
import type { FederationFilters } from '../../../data/federationDashboardData'
import { CommercialAudienceOverview } from './CommercialAudienceOverview'
import { SponsorableCohortsPanel } from './SponsorableCohortsPanel'
import { CommercialOpportunityStack } from './CommercialOpportunityStack'

type Props = { filters: FederationFilters }

export function FederationCommercialSponsorshipSection({ filters }: Props) {
  const data = useMemo(() => deriveCommercialInsights(filters), [filters])

  return (
    <div className="space-y-6">
      <p className="max-w-3xl text-sm leading-relaxed text-text-secondary">
        Unified federation data turned into addressable audiences, sponsor targeting, and revenue packaging — built for
        partnership and commercial teams, not generic admin KPIs.
      </p>

      <div className="rounded-[var(--radius-card)] border border-premium/20 bg-premium/[0.04] px-4 py-3 text-sm text-text-secondary">
        <p className="font-medium text-text-primary">Why this view exists</p>
        <p className="mt-1 leading-relaxed">{data.intro}</p>
        {data.isFiltered && (
          <p className="mt-2 text-xs text-text-muted">
            Filtered context: cohort figures scale with your sidebar filters (~{data.filteredTotalHint.toLocaleString()}{' '}
            participants in current slice).
          </p>
        )}
      </div>

      <div className="space-y-12">
        <CommercialAudienceOverview kpis={data.kpis} />
        <SponsorableCohortsPanel cohorts={data.cohorts} />
        <CommercialOpportunityStack opportunities={data.opportunities} />
      </div>
    </div>
  )
}
