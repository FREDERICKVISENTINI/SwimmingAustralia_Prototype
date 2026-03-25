/**
 * Shared types for the Swimming Australia prototype.
 * Keeps account and profile data shapes in one place.
 */
import type { AccountType } from '../theme/tokens'
import type { TalentFlagType } from './club'

export type { AccountType }

export type User = {
  name: string
  email: string
}

/**
 * Unified swimmer entity — the single source of truth for every swimmer
 * across parent, club, and federation views.
 */
export type UnifiedSwimmer = {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender?: string
  ageGroup?: string
  state?: string
  memberId?: string

  // Club / squad
  classId: string | null
  className: string | null
  /** Parent-facing label for club or program (e.g. City Dolphins). */
  program?: string
  coachId?: string
  coachName?: string

  // Pathway
  pathwayStageId: string

  // Engagement
  attendanceStatus: 'active' | 'inactive' | 'on-hold'
  latestStatDate: string | null
  lastAttendanceDate?: string | null

  // Payment
  paymentStatus: 'paid' | 'due' | 'overdue' | 'partial' | null

  // Talent
  talentFlags?: TalentFlagType[]

  // Contact / family
  contactEmail?: string
  contactPhone?: string
  parentGuardianName?: string

  // History
  pastClubs?: { clubName: string; from: string; to: string | null }[]

  // Notes
  notes?: string

  // HP screening
  spartaII?: {
    testCompleted: boolean
    reportReceived: boolean
    lastTestDate?: string | null
  }
  stateInsightNote?: string

  /** Parent account ID that "owns" this swimmer (for parent view). */
  parentAccountId?: string
}

/** @deprecated Use UnifiedSwimmer instead */
export type SwimmerProfile = UnifiedSwimmer

export type OrganisationType =
  | 'club'
  | 'swim school'
  | 'squad program'
  | 'state program'

export type TeamProfile = {
  organisationName: string
  organisationType: OrganisationType
  state: string
  mainContactName: string
  contactEmail: string
  primaryAgeGroupFocus: string
  numberOfSwimmers: string
  primaryPathwayStageServed: string
  description: string
  homePool?: string
}

export type CoachProfile = {
  fullName: string
  organisation: string
  roleTitle: string
  state: string
  accreditationLevel: string
  pathwayFocus: string[]
}
