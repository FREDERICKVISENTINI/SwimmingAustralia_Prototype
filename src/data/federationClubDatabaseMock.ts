/**
 * Demo record for federation Club database — national club registry prototype (no live API).
 */

export type ClubGeography = {
  postcode: string
  locality: string
  sa4Label: string
  regionType: string
  catchmentNote: string
}

export type ClubProgramRow = {
  programName: string
  pathwayFocus: string
  athletes: number
  leadCoach: string
}

export type ClubRecord = {
  tradingName: string
  clubId: string
  state: string
  regionAffiliation: string
  incorporated: string
  abnDisplay: string
  president: string
  headCoach: string
  primaryContactEmail: string
  activeMembers: number
  squadsOffered: number
  meetsHostedYtd: number
  platformSpendAnnual: string
  retentionVsNational: string
  progressionIndex: string
  complianceStatus: 'Green' | 'Amber' | 'Red'
  accreditationTier: string
  poolVenue: string
  geography: ClubGeography
  programs: ClubProgramRow[]
  stateBodyNotes: string[]
  governanceNotes: string[]
}

/** Demo: only this search label loads the seeded club (testing). */
export const CLUB_DATABASE_DEMO_SEARCH_NAME = 'Melbourne Dolphins'

export const DEMO_CLUB_RECORD: ClubRecord = {
  tradingName: 'Melbourne Dolphins Swimming Club',
  clubId: 'SA-CLUB-VIC-00412',
  state: 'Victoria',
  regionAffiliation: 'Swimming Victoria · Metro East cluster',
  incorporated: 'Incorporated association · est. 1987',
  abnDisplay: '12 345 678 901',
  president: 'Alex Morgan',
  headCoach: 'Sarah Nguyen',
  primaryContactEmail: 'admin@melbournedolphins.org.au',
  activeMembers: 428,
  squadsOffered: 11,
  meetsHostedYtd: 6,
  platformSpendAnnual: '$48,200 annual platform & services',
  retentionVsNational: '+4.2 pts vs state cohort',
  progressionIndex: 'Top quartile pathway velocity',
  complianceStatus: 'Green',
  accreditationTier: 'Gold · National safety & coaching standards (demo)',
  poolVenue: 'Aquatic Centre — Camberwell (50m)',
  geography: {
    postcode: '3124',
    locality: 'Camberwell',
    sa4Label: 'Melbourne — East',
    regionType: 'Metropolitan',
    catchmentNote: 'Inner-east metro; draw from 12 affiliated schools',
  },
  programs: [
    { programName: 'Learn to Swim', pathwayFocus: 'Foundation', athletes: 96, leadCoach: 'Jamie Cole' },
    { programName: 'Junior development', pathwayFocus: 'Junior Squad', athletes: 78, leadCoach: 'Priya Shah' },
    { programName: 'Performance', pathwayFocus: 'State Pathway', athletes: 54, leadCoach: 'Sarah Nguyen' },
    { programName: 'Masters', pathwayFocus: 'Fitness / open', athletes: 62, leadCoach: 'Chris O’Neill' },
  ],
  stateBodyNotes: [
    'Hosting package approved for 2026 regional qualifier (conditional on lane booking).',
    'Safeguarding attestation current; working-with-children renewals on file.',
  ],
  governanceNotes: [
    'Board diversity target met for junior pathway sub-committee.',
    'Financial health: operating surplus within SV guidelines (demo).',
  ],
}
