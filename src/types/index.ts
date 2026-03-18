/**
 * Shared types for the Swimming Australia prototype.
 * Keeps account and profile data shapes in one place.
 */
import type { AccountType } from '../theme/tokens'

export type { AccountType }

export type User = {
  name: string
  email: string
}

export type SwimmerProfile = {
  /** Unique id for this swimmer (used for family list and selection). */
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  program: string
  state: string
  notes: string
  pathwayStage: string
  /** Member / registration ID (e.g. from Swimming Australia or club). */
  memberId?: string
}

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
}

export type CoachProfile = {
  fullName: string
  organisation: string
  roleTitle: string
  state: string
  accreditationLevel: string
  pathwayFocus: string[]
}
