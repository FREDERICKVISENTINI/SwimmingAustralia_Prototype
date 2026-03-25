/** Single source for federation dashboard section ids and labels. Used by Sidebar, FederationDashboard, and FederationSectionPage. */
/** Order matches federation sidebar (routes are interleaved in Sidebar). */
export const FEDERATION_SECTIONS = [
  { id: 'player-database', label: 'Player database' },
  { id: 'club-database', label: 'Club database' },
  { id: 'system-health', label: 'System Health' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'performance', label: 'Leverage AI' },
] as const

/** Maps old section IDs (used in routes, insight categories, etc.) to their new equivalents. */
export const LEGACY_SECTION_ID_MAP: Record<string, FederationSectionId> = {
  'participation-growth': 'player-database',
  retention: 'player-database',
  'talent-identification': 'performance',
  'performance-pipeline': 'system-health',
  'club-performance': 'club-database',
  'national-event-analytics': 'performance',
  'commercial-sponsorship': 'commercial',
}

export type FederationSectionId = (typeof FEDERATION_SECTIONS)[number]['id']

export const FEDERATION_SECTION_IDS: FederationSectionId[] = FEDERATION_SECTIONS.map((s) => s.id)

export function isFederationSectionId(id: string): id is FederationSectionId {
  return FEDERATION_SECTION_IDS.includes(id as FederationSectionId)
}
