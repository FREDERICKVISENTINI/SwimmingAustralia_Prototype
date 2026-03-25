import { DATA_INFRASTRUCTURE_FLOWS } from './dataInfrastructureFlows'
import type { DataInfrastructureFlow } from './dataInfrastructureFlows'

/**
 * Maps each data-flow block to related data category ids for cross-highlighting on the Data Infrastructure page.
 */
export const FLOW_TO_CATEGORY_IDS: Record<string, readonly string[]> = {
  'core-athlete': [
    'identity-registration',
    'pathway-progression',
    'family-account',
    'aggregated-derived',
    'coach-club',
  ],
  performance: ['competition-results', 'technique-hp', 'competition-infra'],
  'engagement-risk': ['attendance-engagement', 'dropout', 'aggregated-derived'],
  commercial: [
    'pathway-progression',
    'attendance-engagement',
    'commercial-transaction',
    'aggregated-derived',
    'coach-club',
  ],
  geography: ['facility-geo', 'identity-registration', 'aggregated-derived'],
} as const

/** Flow ids that reference a given category (for modals / reverse lookup). */
export function getFlowIdsForCategory(categoryId: string): string[] {
  const ids: string[] = []
  for (const [flowId, cats] of Object.entries(FLOW_TO_CATEGORY_IDS)) {
    if ((cats as readonly string[]).includes(categoryId)) {
      ids.push(flowId)
    }
  }
  return ids
}

/** Full flow definitions for a category, in canonical flow order. */
export function getFlowsForCategory(categoryId: string): DataInfrastructureFlow[] {
  const wanted = new Set(getFlowIdsForCategory(categoryId))
  return DATA_INFRASTRUCTURE_FLOWS.filter((f) => wanted.has(f.id))
}
