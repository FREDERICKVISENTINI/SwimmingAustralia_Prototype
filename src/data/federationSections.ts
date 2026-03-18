/** Single source for federation dashboard section ids and labels. Used by Sidebar, FederationDashboard, and FederationSectionPage. */
export const FEDERATION_SECTIONS = [
  { id: 'participation-growth', label: 'Participation & Growth' },
  { id: 'talent-identification', label: 'Talent Identification' },
  { id: 'performance-pipeline', label: 'Performance Pipeline' },
  { id: 'club-performance', label: 'Club Performance' },
  { id: 'national-event-analytics', label: 'National Event Analytics' },
  { id: 'commercial-sponsorship', label: 'Commercial & Sponsorship Insights' },
] as const

export type FederationSectionId = (typeof FEDERATION_SECTIONS)[number]['id']

export const FEDERATION_SECTION_IDS: FederationSectionId[] = FEDERATION_SECTIONS.map((s) => s.id)

export function isFederationSectionId(id: string): id is FederationSectionId {
  return FEDERATION_SECTION_IDS.includes(id as FederationSectionId)
}
