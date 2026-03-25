import type { UnifiedSwimmer } from './index'

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

/** Talent / HP signals for coach view. */
export type TalentFlagType =
  | 'technique'
  | 'rapid-improvement'
  | 'coach-observation'
  | 'hp-signal'

/** @deprecated Use UnifiedSwimmer from types/index instead. Kept as alias for backward compat. */
export type ClubSwimmer = UnifiedSwimmer

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

export type ClubInstructor = {
  id: string
  fullName: string
  memberNumber: string
  email: string
  classIds: string[]
  bankDetailsComplete: boolean
  workingWithChildrenComplete: boolean
  phone?: string
  accreditationLevel?: string
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

/** Individual attendance record for a single event. */
export type AttendanceRecord = {
  id: string
  eventId: string
  swimmerId: string
  swimmerName: string
  date: string
  status: 'present' | 'absent'
  markedAt: string
}

// --- Outgoing payments ---

export type OutgoingCategory = 'staff' | 'hp-product' | 'other'

export type OutgoingPayment = {
  id: string
  category: OutgoingCategory
  recipient: string
  description: string
  amount: number
  date: string
  status: 'paid' | 'pending' | 'scheduled'
  reference?: string
}

// --- Event management ---

export type EventType = 'training-session' | 'meet' | 'clinic' | 'testing-day'
export type EventStatus = 'draft' | 'published' | 'cancelled'

export type ClubEvent = {
  id: string
  title: string
  eventType: EventType
  description: string
  date: string
  startTime: string
  endTime: string
  location: string
  squadId: string | null
  squadName: string | null
  capacity: number
  registrationCutoff: string
  status: EventStatus
  coachName: string
  createdAt: string
}

export type EventRegistration = {
  id: string
  eventId: string
  swimmerId: string
  swimmerName: string
  registeredBy: 'parent' | 'self' | 'coach'
  registeredAt: string
  notes?: string
}
