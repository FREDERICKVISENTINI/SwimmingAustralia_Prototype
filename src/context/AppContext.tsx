import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AccountType } from '../theme/tokens'
import type { User, UnifiedSwimmer, TeamProfile, CoachProfile } from '../types'
import type { SwimClass, PaymentRecord, StatUpload, ClubInstructor, ClubEvent, EventRegistration, OutgoingPayment, AttendanceRecord } from '../types/club'
import { DEMO_CLASSES, DEMO_CLUB_SWIMMERS, DEMO_PAYMENTS, DEMO_STAT_UPLOADS, DEMO_INSTRUCTORS, DEMO_EVENTS, DEMO_REGISTRATIONS, DEMO_OUTGOING_PAYMENTS } from '../data/clubSeedData'

export type { UnifiedSwimmer, TeamProfile, CoachProfile }
/** @deprecated Use UnifiedSwimmer instead */
export type SwimmerProfile = UnifiedSwimmer

type AppState = {
  user: User | null
  accountType: AccountType | null
  swimmers: UnifiedSwimmer[]
  activeSwimmerId: string | null
  teamProfile: TeamProfile | null
  coachProfile: CoachProfile | null
  parentOnboardingComplete: boolean
  clubCoachOnboardingComplete: boolean
  clubClasses: SwimClass[]
  clubPayments: PaymentRecord[]
  clubStatUploads: StatUpload[]
  clubInstructors: ClubInstructor[]
  clubEvents: ClubEvent[]
  eventRegistrations: EventRegistration[]
  outgoingPayments: OutgoingPayment[]
  attendanceRecords: AttendanceRecord[]
  isPremiumTier: boolean
}

type AppContextValue = AppState & {
  swimmerProfile: UnifiedSwimmer | null
  /** Backward-compat alias: all swimmers visible to club admin */
  clubSwimmers: UnifiedSwimmer[]
  signIn: (email: string, password: string) => void
  signInAsClubDemo: () => void
  signInAsFederationDemo: () => void
  signUp: (name: string, email: string, password: string) => void
  signOut: () => void
  setAccountType: (type: AccountType) => void
  setSwimmerProfile: (profile: UnifiedSwimmer) => void
  setPathwayStage: (stageId: string) => void
  addSwimmer: (profile: Omit<UnifiedSwimmer, 'id'>) => void
  setActiveSwimmerId: (id: string | null) => void
  removeSwimmer: (id: string) => void
  setTeamProfile: (profile: TeamProfile) => void
  setCoachProfile: (profile: CoachProfile) => void
  completeParentOnboarding: () => void
  completeClubCoachOnboarding: () => void
  setClubClasses: (classes: SwimClass[]) => void
  addClubClass: (c: Omit<SwimClass, 'id'>) => void
  updateClubClass: (id: string, c: Partial<SwimClass>) => void
  setClubSwimmers: (swimmers: UnifiedSwimmer[]) => void
  addClubSwimmer: (s: Omit<UnifiedSwimmer, 'id'>) => void
  updateClubSwimmer: (id: string, s: Partial<UnifiedSwimmer>) => void
  setClubPayments: (payments: PaymentRecord[]) => void
  addClubPayment: (p: Omit<PaymentRecord, 'id'>) => void
  setClubStatUploads: (uploads: StatUpload[]) => void
  addClubStatUpload: (u: Omit<StatUpload, 'id'>) => void
  addClubEvent: (e: Omit<ClubEvent, 'id' | 'createdAt'>) => void
  updateClubEvent: (id: string, e: Partial<ClubEvent>) => void
  deleteClubEvent: (id: string) => void
  addEventRegistration: (r: Omit<EventRegistration, 'id' | 'registeredAt'>) => void
  removeEventRegistration: (id: string) => void
  addOutgoingPayment: (p: Omit<OutgoingPayment, 'id'>) => void
  addAttendanceRecord: (r: Omit<AttendanceRecord, 'id' | 'markedAt'>) => void
  isPremiumTier: boolean
  setIsPremiumTier: (value: boolean) => void
  /** Parent login with 2+ swimmers — household / family account (derived; persisted via swimmers list). */
  isFamilyAccount: boolean
}

const AppContext = createContext<AppContextValue | null>(null)

const SESSION_KEY = 'ausswim_demo_session'

type SavedSession = Partial<AppState> & {
  swimmerProfile?: UnifiedSwimmer | null
  clubSwimmers?: UnifiedSwimmer[]
}

function loadSession(): SavedSession | null {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(SESSION_KEY) : null
    if (!raw) return null
    return JSON.parse(raw) as SavedSession
  } catch {
    return null
  }
}

function migrateSession(saved: SavedSession | null): { swimmers: UnifiedSwimmer[]; activeSwimmerId: string | null } {
  if (saved?.swimmers?.length) {
    const migrated = saved.swimmers.map((s) => ({
      ...s,
      pathwayStageId: (s as any).pathwayStageId ?? (s as any).pathwayStage ?? 'recreation',
      classId: (s as any).classId ?? null,
      className: (s as any).className ?? null,
      attendanceStatus: (s as any).attendanceStatus ?? ('active' as const),
      latestStatDate: (s as any).latestStatDate ?? null,
      paymentStatus: (s as any).paymentStatus ?? null,
    }))
    const active = saved.activeSwimmerId ?? migrated[0]?.id ?? null
    return { swimmers: migrated, activeSwimmerId: active }
  }
  const legacy = saved?.swimmerProfile
  if (legacy) {
    const withId: UnifiedSwimmer = {
      ...legacy,
      id: (legacy as any).id ?? 'swimmer-1',
      pathwayStageId: (legacy as any).pathwayStageId ?? (legacy as any).pathwayStage ?? 'recreation',
      classId: null,
      className: null,
      attendanceStatus: 'active',
      latestStatDate: null,
      paymentStatus: null,
    }
    return { swimmers: [withId], activeSwimmerId: withId.id }
  }
  return { swimmers: [], activeSwimmerId: null }
}

function saveSession(state: AppState) {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_KEY, JSON.stringify(state))
    }
  } catch {
    // ignore
  }
}

const DEMO_PARENT_SWIMMERS: UnifiedSwimmer[] = [
  {
    id: 'demo-fred',
    firstName: 'Fred',
    lastName: 'Visentini',
    dateOfBirth: '2014-03-15',
    gender: 'Male',
    ageGroup: '11',
    state: 'NSW',
    memberId: 'AUS-2025-DEMO',
    classId: 'cls-2',
    className: 'Junior Squad A',
    coachId: 'coach-1',
    coachName: 'Mike Torres',
    pathwayStageId: 'junior-squad',
    attendanceStatus: 'active',
    latestStatDate: '2025-03-08',
    paymentStatus: 'paid',
    notes: '',
    parentAccountId: 'parent-demo',
    parentGuardianName: 'Fred Visentini Sr.',
    contactEmail: 'demo@ausswim.com',
    contactPhone: '0400 000 001',
  },
  {
    id: 'demo-emma',
    firstName: 'Emma',
    lastName: 'Visentini',
    dateOfBirth: '2017-08-22',
    gender: 'Female',
    ageGroup: '7',
    state: 'NSW',
    memberId: 'AUS-2025-DEMO-2',
    classId: 'cls-1',
    className: 'LTS Stage 3',
    coachId: 'coach-1',
    coachName: 'Mike Torres',
    pathwayStageId: 'learn-to-swim',
    attendanceStatus: 'active',
    latestStatDate: null,
    paymentStatus: 'paid',
    notes: '',
    parentAccountId: 'parent-demo',
    parentGuardianName: 'Fred Visentini Sr.',
    contactEmail: 'demo@ausswim.com',
    contactPhone: '0400 000 001',
  },
]

const DEMO_TEAM_PROFILE: TeamProfile = {
  organisationName: 'City Dolphins Swim Club',
  organisationType: 'club',
  state: 'NSW',
  mainContactName: 'Sarah Chen',
  contactEmail: 'clubdemo@ausswim.com',
  primaryAgeGroupFocus: '8–14 years',
  numberOfSwimmers: '120',
  primaryPathwayStageServed: 'Junior Squad & Competitive Club',
  description: 'Demo club profile for team admin. City Dolphins runs learn-to-swim through to competitive squad programs.',
  homePool: 'City Dolphins Pool, Lane 3–6',
}

const DEMO_FEDERATION_COACH_PROFILE: CoachProfile = {
  fullName: 'Alex Morrison',
  organisation: 'Swimming Australia',
  roleTitle: 'Pathway Manager',
  state: 'National',
  accreditationLevel: 'Elite',
  pathwayFocus: ['state-pathway', 'elite'],
}

export function AppProvider({ children }: { children: ReactNode }) {
  const saved = loadSession()
  const migrated = useMemo(() => migrateSession(saved), [])

  const [user, setUser] = useState<User | null>(saved?.user ?? null)
  const [accountType, setAccountTypeState] = useState<AccountType | null>(saved?.accountType ?? null)
  const [swimmers, setSwimmers] = useState<UnifiedSwimmer[]>(() => {
    if (saved?.accountType === 'club') {
      const s = saved?.swimmers ?? saved?.clubSwimmers
      if (!s || s.length === 0 || s.length === 5) return DEMO_CLUB_SWIMMERS
      return migrateSession({ swimmers: s, activeSwimmerId: null }).swimmers
    }
    return migrated.swimmers
  })
  const [activeSwimmerId, setActiveSwimmerIdState] = useState<string | null>(migrated.activeSwimmerId)
  const [teamProfile, setTeamProfileState] = useState<TeamProfile | null>(saved?.teamProfile ?? null)
  const [coachProfile, setCoachProfileState] = useState<CoachProfile | null>(saved?.coachProfile ?? null)
  const [parentOnboardingComplete, setParentOnboardingComplete] = useState(saved?.parentOnboardingComplete ?? false)
  const [clubCoachOnboardingComplete, setClubCoachOnboardingComplete] = useState(saved?.clubCoachOnboardingComplete ?? false)
  const clubDemoSeed = useMemo(() => {
    if (saved?.accountType !== 'club') return false
    const s = saved?.swimmers ?? saved?.clubSwimmers
    return !s || s.length === 0 || s.length === 5
  }, [saved?.accountType, saved?.swimmers?.length])

  const [clubClasses, setClubClassesState] = useState<SwimClass[]>(() => {
    const fromSaved = saved?.clubClasses
    if (clubDemoSeed) return DEMO_CLASSES
    return fromSaved ?? []
  })
  // clubSwimmers is now a derived view — same as swimmers for club accounts
  const clubSwimmers = swimmers
  const [clubPayments, setClubPaymentsState] = useState<PaymentRecord[]>(() => {
    const fromSaved = saved?.clubPayments
    if (clubDemoSeed) return DEMO_PAYMENTS
    return fromSaved ?? []
  })
  const [clubStatUploads, setClubStatUploadsState] = useState<StatUpload[]>(() => {
    const fromSaved = saved?.clubStatUploads
    if (clubDemoSeed) return DEMO_STAT_UPLOADS
    return fromSaved ?? []
  })
  const [clubInstructors, setClubInstructorsState] = useState<ClubInstructor[]>(() => {
    const fromSaved = saved?.clubInstructors
    if (clubDemoSeed) return DEMO_INSTRUCTORS
    return fromSaved ?? []
  })
  const [clubEvents, setClubEventsState] = useState<ClubEvent[]>(() => {
    const fromSaved = saved?.clubEvents
    if (clubDemoSeed) return DEMO_EVENTS
    return fromSaved ?? DEMO_EVENTS
  })
  const [eventRegistrations, setEventRegistrationsState] = useState<EventRegistration[]>(() => {
    const fromSaved = saved?.eventRegistrations
    if (clubDemoSeed) return DEMO_REGISTRATIONS
    return fromSaved ?? DEMO_REGISTRATIONS
  })
  const [outgoingPayments, setOutgoingPaymentsState] = useState<OutgoingPayment[]>(() => {
    const fromSaved = (saved as AppState & { outgoingPayments?: OutgoingPayment[] })?.outgoingPayments
    if (clubDemoSeed) return DEMO_OUTGOING_PAYMENTS
    return fromSaved ?? DEMO_OUTGOING_PAYMENTS
  })
  const [attendanceRecords, setAttendanceRecordsState] = useState<AttendanceRecord[]>(() => {
    return (saved as any)?.attendanceRecords ?? []
  })
  const [isPremiumTier, setIsPremiumTier] = useState(() =>
    Boolean((saved as Partial<AppState>)?.isPremiumTier)
  )

  const swimmerProfile = useMemo(
    () => swimmers.find((s) => s.id === activeSwimmerId) ?? swimmers[0] ?? null,
    [swimmers, activeSwimmerId]
  )

  useEffect(() => {
    if (user) {
      saveSession({
        user,
        accountType,
        swimmers,
        activeSwimmerId,
        teamProfile,
        coachProfile,
        parentOnboardingComplete,
        clubCoachOnboardingComplete,
        clubClasses,
        clubPayments,
        clubStatUploads,
        clubInstructors,
        clubEvents,
        eventRegistrations,
        outgoingPayments,
        attendanceRecords,
        isPremiumTier,
      })
    }
  }, [user, accountType, swimmers, activeSwimmerId, teamProfile, coachProfile, parentOnboardingComplete, clubCoachOnboardingComplete, clubClasses, clubPayments, clubStatUploads, clubInstructors, clubEvents, eventRegistrations, outgoingPayments, attendanceRecords, isPremiumTier])

  const signIn = useCallback((email: string, _password: string) => {
    const emailToUse = email || 'demo@ausswim.com'
    setUser({ name: 'Demo User', email: emailToUse })
    setAccountTypeState('parent')
    setSwimmers(DEMO_PARENT_SWIMMERS)
    setActiveSwimmerIdState(DEMO_PARENT_SWIMMERS[0].id)
    setTeamProfileState(null)
    setParentOnboardingComplete(true)
    setClubEventsState(DEMO_EVENTS)
    setEventRegistrationsState(DEMO_REGISTRATIONS)
  }, [])

  const signInAsClubDemo = useCallback(() => {
    setUser({ name: 'Mike Torres', email: 'clubdemo@ausswim.com' })
    setAccountTypeState('club')
    setSwimmers(DEMO_CLUB_SWIMMERS)
    setActiveSwimmerIdState(null)
    setTeamProfileState(DEMO_TEAM_PROFILE)
    setParentOnboardingComplete(false)
    setClubCoachOnboardingComplete(true)
    setClubClassesState(DEMO_CLASSES)
    setClubPaymentsState(DEMO_PAYMENTS)
    setClubStatUploadsState(DEMO_STAT_UPLOADS)
    setClubInstructorsState(DEMO_INSTRUCTORS)
    setClubEventsState(DEMO_EVENTS)
    setEventRegistrationsState(DEMO_REGISTRATIONS)
    setOutgoingPaymentsState(DEMO_OUTGOING_PAYMENTS)
    setAttendanceRecordsState([])
  }, [])

  const signInAsFederationDemo = useCallback(() => {
    setUser({ name: 'Alex Morrison', email: 'federationdemo@ausswim.com' })
    setAccountTypeState('federation')
    setSwimmers([])
    setActiveSwimmerIdState(null)
    setTeamProfileState(null)
    setCoachProfileState(DEMO_FEDERATION_COACH_PROFILE)
    setParentOnboardingComplete(false)
    setClubCoachOnboardingComplete(true)
    setClubClassesState([])
    setClubPaymentsState([])
    setClubStatUploadsState([])
    setClubInstructorsState([])
    setClubEventsState([])
    setEventRegistrationsState([])
    setOutgoingPaymentsState([])
    setAttendanceRecordsState([])
  }, [])

  const signUp = useCallback((name: string, email: string, _password: string) => {
    setUser({ name, email })
  }, [])

  const signOut = useCallback(() => {
    setUser(null)
    setAccountTypeState(null)
    setSwimmers([])
    setActiveSwimmerIdState(null)
    setTeamProfileState(null)
    setCoachProfileState(null)
    setParentOnboardingComplete(false)
    setClubCoachOnboardingComplete(false)
    setClubClassesState([])
    setClubPaymentsState([])
    setClubStatUploadsState([])
    setClubInstructorsState([])
    setClubEventsState([])
    setEventRegistrationsState([])
    setOutgoingPaymentsState([])
    setAttendanceRecordsState([])
    setIsPremiumTier(false)
    try {
      if (typeof window !== 'undefined') localStorage.removeItem(SESSION_KEY)
    } catch {
      // ignore
    }
  }, [])

  const setAccountType = useCallback((type: AccountType) => {
    setAccountTypeState(type)
  }, [])

  const setSwimmerProfile = useCallback((profile: SwimmerProfile) => {
    setSwimmers((prev) =>
      prev.map((s) => (s.id === profile.id ? profile : s))
    )
  }, [])

  const setPathwayStage = useCallback((stageId: string) => {
    if (!activeSwimmerId) return
    setSwimmers((prev) =>
      prev.map((s) => (s.id === activeSwimmerId ? { ...s, pathwayStageId: stageId } : s))
    )
  }, [activeSwimmerId])

  const addSwimmer = useCallback((profile: Omit<UnifiedSwimmer, 'id'>) => {
    const id = `swimmer-${Date.now()}`
    const year = new Date().getFullYear()
    const uniqueSuffix = String(10000 + (Date.now() % 90000))
    const memberId =
      profile.memberId?.trim() || `AUS-${year}-${uniqueSuffix}`
    const newProfile: UnifiedSwimmer = { ...profile, id, memberId }
    setSwimmers((prev) => [...prev, newProfile])
    setActiveSwimmerIdState(id)
  }, [])

  const setActiveSwimmerId = useCallback((id: string | null) => {
    setActiveSwimmerIdState(id)
  }, [])

  const removeSwimmer = useCallback((id: string) => {
    setSwimmers((prev) => prev.filter((s) => s.id !== id))
    setActiveSwimmerIdState((current) => (current === id ? null : current))
  }, [])

  useEffect(() => {
    if (swimmers.length && (!activeSwimmerId || !swimmers.some((s) => s.id === activeSwimmerId))) {
      setActiveSwimmerIdState(swimmers[0]?.id ?? null)
    }
  }, [swimmers, activeSwimmerId])

  const setTeamProfile = useCallback((profile: TeamProfile) => {
    setTeamProfileState(profile)
  }, [])

  const setCoachProfile = useCallback((profile: CoachProfile) => {
    setCoachProfileState(profile)
  }, [])

  const completeParentOnboarding = useCallback(() => {
    setParentOnboardingComplete(true)
  }, [])

  const completeClubCoachOnboarding = useCallback(() => {
    setClubCoachOnboardingComplete(true)
  }, [])

  const setClubClasses = useCallback((classes: SwimClass[]) => setClubClassesState(classes), [])
  const addClubClass = useCallback((c: Omit<SwimClass, 'id'>) => {
    setClubClassesState((prev) => [...prev, { ...c, id: `cls-${Date.now()}` }])
  }, [])
  const updateClubClass = useCallback((id: string, c: Partial<SwimClass>) => {
    setClubClassesState((prev) => prev.map((x) => (x.id === id ? { ...x, ...c } : x)))
  }, [])

  const setClubSwimmers = useCallback((s: UnifiedSwimmer[]) => setSwimmers(s), [])
  const addClubSwimmer = useCallback((s: Omit<UnifiedSwimmer, 'id'>) => {
    setSwimmers((prev) => [...prev, { ...s, id: `cs-${Date.now()}` }])
  }, [])
  const updateClubSwimmer = useCallback((id: string, s: Partial<UnifiedSwimmer>) => {
    setSwimmers((prev) => prev.map((x) => (x.id === id ? { ...x, ...s } : x)))
  }, [])

  const setClubPayments = useCallback((payments: PaymentRecord[]) => setClubPaymentsState(payments), [])
  const addClubPayment = useCallback((p: Omit<PaymentRecord, 'id'>) => {
    setClubPaymentsState((prev) => [...prev, { ...p, id: `pay-${Date.now()}` }])
  }, [])

  const setClubStatUploads = useCallback((uploads: StatUpload[]) => setClubStatUploadsState(uploads), [])
  const addClubStatUpload = useCallback((u: Omit<StatUpload, 'id'>) => {
    setClubStatUploadsState((prev) => [...prev, { ...u, id: `st-${Date.now()}`, uploadedAt: new Date().toISOString() }])
  }, [])

  const addClubEvent = useCallback((e: Omit<ClubEvent, 'id' | 'createdAt'>) => {
    setClubEventsState((prev) => [...prev, { ...e, id: `evt-${Date.now()}`, createdAt: new Date().toISOString() }])
  }, [])
  const updateClubEvent = useCallback((id: string, e: Partial<ClubEvent>) => {
    setClubEventsState((prev) => prev.map((x) => (x.id === id ? { ...x, ...e } : x)))
  }, [])
  const deleteClubEvent = useCallback((id: string) => {
    setClubEventsState((prev) => prev.filter((x) => x.id !== id))
    setEventRegistrationsState((prev) => prev.filter((r) => r.eventId !== id))
  }, [])

  const addEventRegistration = useCallback((r: Omit<EventRegistration, 'id' | 'registeredAt'>) => {
    setEventRegistrationsState((prev) => [...prev, { ...r, id: `reg-${Date.now()}`, registeredAt: new Date().toISOString() }])
  }, [])
  const removeEventRegistration = useCallback((id: string) => {
    setEventRegistrationsState((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const addOutgoingPayment = useCallback((p: Omit<OutgoingPayment, 'id'>) => {
    setOutgoingPaymentsState((prev) => [...prev, { ...p, id: `out-${Date.now()}` }])
  }, [])

  const addAttendanceRecord = useCallback((r: Omit<AttendanceRecord, 'id' | 'markedAt'>) => {
    const record: AttendanceRecord = {
      ...r,
      id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      markedAt: new Date().toISOString(),
    }
    setAttendanceRecordsState((prev) => {
      const existing = prev.findIndex((a) => a.eventId === r.eventId && a.swimmerId === r.swimmerId)
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = record
        return updated
      }
      return [...prev, record]
    })
    if (r.status === 'present') {
      setSwimmers((prev) =>
        prev.map((s) =>
          s.id === r.swimmerId
            ? { ...s, attendanceStatus: 'active' as const, lastAttendanceDate: r.date }
            : s
        )
      )
    }
  }, [])

  const value = useMemo<AppContextValue>(
    () => ({
      user,
      accountType,
      swimmers,
      activeSwimmerId,
      swimmerProfile,
      teamProfile,
      coachProfile,
      parentOnboardingComplete,
      clubCoachOnboardingComplete,
      clubClasses,
      clubSwimmers,
      clubPayments,
      clubStatUploads,
      clubInstructors,
      clubEvents,
      eventRegistrations,
      signIn,
      signInAsClubDemo,
      signInAsFederationDemo,
      signUp,
      signOut,
      setAccountType,
      setSwimmerProfile,
      setPathwayStage,
      addSwimmer,
      setActiveSwimmerId,
      removeSwimmer,
      setTeamProfile,
      setCoachProfile,
      completeParentOnboarding,
      completeClubCoachOnboarding,
      setClubClasses,
      addClubClass,
      updateClubClass,
      setClubSwimmers,
      addClubSwimmer,
      updateClubSwimmer,
      setClubPayments,
      addClubPayment,
      setClubStatUploads,
      addClubStatUpload,
      addClubEvent,
      updateClubEvent,
      deleteClubEvent,
      addEventRegistration,
      removeEventRegistration,
      outgoingPayments,
      addOutgoingPayment,
      attendanceRecords,
      addAttendanceRecord,
      isPremiumTier,
      setIsPremiumTier,
      isFamilyAccount: accountType === 'parent' && swimmers.length > 1,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      user, accountType, swimmers, activeSwimmerId, swimmerProfile,
      teamProfile, coachProfile, parentOnboardingComplete, clubCoachOnboardingComplete,
      clubClasses, clubPayments, clubStatUploads, clubInstructors, clubEvents,
      eventRegistrations, outgoingPayments, attendanceRecords, isPremiumTier,
    ]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
