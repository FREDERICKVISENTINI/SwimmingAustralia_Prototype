export type ClassType =
  | 'learn-to-swim'
  | 'junior-squad'
  | 'competitive-squad'
  | 'state-prep'
  | 'elite-program'

export type SwimClass = {
  id: string
  name: string
  classType: ClassType
  coachId: string
  coachName: string
  ageGroup: string
  swimmerCount: number
  trainingDays: string
  trainingTimes: string
  capacity: number
  status: 'active' | 'full' | 'archived'
  pathwayStageId: string
}

/** Talent / HP signals for coach view. Not only race results—technique, improvement, observation. */
export type TalentFlagType =
  | 'technique'
  | 'rapid-improvement'
  | 'coach-observation'
  | 'hp-signal'

export type ClubSwimmer = {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  ageGroup: string
  classId: string | null
  className: string | null
  pathwayStageId: string
  attendanceStatus: 'active' | 'inactive' | 'on-hold'
  latestStatDate: string | null
  paymentStatus: 'paid' | 'due' | 'overdue' | 'partial' | null
  /** Coach / HP talent flags: technique assessment, improvement trend, observation (not only times). */
  talentFlags?: TalentFlagType[]
  /** Club history for profile view (current club first; to null = current). */
  pastClubs?: { clubName: string; from: string; to: string | null }[]
  /** Contact (parent/guardian) for club use. */
  contactEmail?: string
  contactPhone?: string
  parentGuardianName?: string
  /** Coach notes / event notes for this swimmer. */
  notes?: string
}

export type FeeType = 'term' | 'assessment' | 'camp' | 'competition' | 'squad' | 'other'

export type PaymentRecord = {
  id: string
  swimmerId: string
  swimmerName: string
  classId: string | null
  className: string | null
  feeType: FeeType
  amount: number
  dueDate: string
  paidDate: string | null
  status: 'paid' | 'due' | 'overdue' | 'partial'
  amountPaid?: number
}

export type StatUploadSource = 'meet-result' | 'training-observation' | 'assessment' | 'manual-entry'

export type StatUpload = {
  id: string
  swimmerId: string
  swimmerName: string
  date: string
  eventMetric: string
  value: string
  stroke?: string
  distance?: string
  coachNotes?: string
  source: StatUploadSource
  uploadedAt: string
}

export type ClubCoach = {
  id: string
  fullName: string
  role: string
  classIds: string[]
}

/** Instructor linked via personal AusSwim account; used for classes. */
export type ClubInstructor = {
  id: string
  fullName: string
  /** AusSwim member number from their personal account. */
  memberNumber: string
  email: string
  /** Class IDs this instructor is assigned to. */
  classIds: string[]
  /** Set when instructor has completed bank details in their account. */
  bankDetailsComplete: boolean
  /** Working with Children Check / accreditation verified. */
  workingWithChildrenComplete: boolean
  /** Contact phone (instructor profile). */
  phone?: string
  /** Accreditation level e.g. Learn-to-Swim, Junior Squad, Competitive. */
  accreditationLevel?: string
  /** Club notes about this instructor. */
  notes?: string
}

export type AttendanceSummary = {
  swimmerId: string
  classId: string
  periodStart: string
  periodEnd: string
  present: number
  total: number
}
