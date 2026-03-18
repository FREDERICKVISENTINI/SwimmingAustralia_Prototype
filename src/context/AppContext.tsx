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
import type { User, SwimmerProfile, TeamProfile, CoachProfile } from '../types'
import type { SwimClass, ClubSwimmer, PaymentRecord, StatUpload, ClubInstructor } from '../types/club'
import { DEMO_CLASSES, DEMO_CLUB_SWIMMERS, DEMO_PAYMENTS, DEMO_STAT_UPLOADS, DEMO_INSTRUCTORS } from '../data/clubSeedData'

export type { SwimmerProfile, TeamProfile, CoachProfile }

type AppState = {
  user: User | null
  accountType: AccountType | null
  swimmers: SwimmerProfile[]
  activeSwimmerId: string | null
  teamProfile: TeamProfile | null
  coachProfile: CoachProfile | null
  parentOnboardingComplete: boolean
  clubCoachOnboardingComplete: boolean
  clubClasses: SwimClass[]
  clubSwimmers: ClubSwimmer[]
  clubPayments: PaymentRecord[]
  clubStatUploads: StatUpload[]
  clubInstructors: ClubInstructor[]
}

type AppContextValue = AppState & {
  /** Currently selected swimmer (derived from swimmers + activeSwimmerId). */
  swimmerProfile: SwimmerProfile | null
  signIn: (email: string, password: string) => void
  /** Sign in as club/team admin demo (redirects to team dashboard). */
  signInAsClubDemo: () => void
  /** Sign in as federation demo (redirects to federation dashboard). */
  signInAsFederationDemo: () => void
  signUp: (name: string, email: string, password: string) => void
  signOut: () => void
  setAccountType: (type: AccountType) => void
  setSwimmerProfile: (profile: SwimmerProfile) => void
  /** Update pathway stage for the active swimmer. */
  setPathwayStage: (stageId: string) => void
  addSwimmer: (profile: Omit<SwimmerProfile, 'id'>) => void
  setActiveSwimmerId: (id: string | null) => void
  removeSwimmer: (id: string) => void
  setTeamProfile: (profile: TeamProfile) => void
  setCoachProfile: (profile: CoachProfile) => void
  completeParentOnboarding: () => void
  completeClubCoachOnboarding: () => void
  setClubClasses: (classes: SwimClass[]) => void
  addClubClass: (c: Omit<SwimClass, 'id'>) => void
  updateClubClass: (id: string, c: Partial<SwimClass>) => void
  setClubSwimmers: (swimmers: ClubSwimmer[]) => void
  addClubSwimmer: (s: Omit<ClubSwimmer, 'id'>) => void
  updateClubSwimmer: (id: string, s: Partial<ClubSwimmer>) => void
  setClubPayments: (payments: PaymentRecord[]) => void
  addClubPayment: (p: Omit<PaymentRecord, 'id'>) => void
  setClubStatUploads: (uploads: StatUpload[]) => void
  addClubStatUpload: (u: Omit<StatUpload, 'id'>) => void
  /** Prototype only: club Premium tier toggle (no backend). */
  isPremiumTier: boolean
  setIsPremiumTier: (value: boolean) => void
}

const AppContext = createContext<AppContextValue | null>(null)

const SESSION_KEY = 'ausswim_demo_session'

type SavedSession = Partial<AppState> & {
  swimmerProfile?: SwimmerProfile | null
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

/** Migrate old session (single swimmerProfile) to swimmers + activeSwimmerId. */
function migrateSession(saved: SavedSession | null): { swimmers: SwimmerProfile[]; activeSwimmerId: string | null } {
  if (saved?.swimmers?.length) {
    const active = saved.activeSwimmerId ?? saved.swimmers[0]?.id ?? null
    return { swimmers: saved.swimmers, activeSwimmerId: active }
  }
  const legacy = saved?.swimmerProfile
  if (legacy) {
    const withId: SwimmerProfile = { ...legacy, id: (legacy as SwimmerProfile & { id?: string }).id ?? 'swimmer-1' }
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

const DEMO_SWIMMERS: SwimmerProfile[] = [
  {
    id: 'demo-fred',
    firstName: 'Fred',
    lastName: 'Visentini',
    dateOfBirth: '2014-03-15',
    gender: 'Male',
    program: 'City Dolphins',
    state: 'NSW',
    notes: 'Demo profile for testing.',
    pathwayStage: 'junior-squad',
    memberId: 'AUS-2025-DEMO',
  },
  {
    id: 'demo-emma',
    firstName: 'Emma',
    lastName: 'Visentini',
    dateOfBirth: '2017-08-22',
    gender: 'Female',
    program: 'City Dolphins',
    state: 'NSW',
    notes: '',
    pathwayStage: 'learn-to-swim',
    memberId: 'AUS-2025-DEMO-2',
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
  const [swimmers, setSwimmers] = useState<SwimmerProfile[]>(migrated.swimmers)
  const [activeSwimmerId, setActiveSwimmerIdState] = useState<string | null>(migrated.activeSwimmerId)
  const [teamProfile, setTeamProfileState] = useState<TeamProfile | null>(saved?.teamProfile ?? null)
  const [coachProfile, setCoachProfileState] = useState<CoachProfile | null>(saved?.coachProfile ?? null)
  const [parentOnboardingComplete, setParentOnboardingComplete] = useState(saved?.parentOnboardingComplete ?? false)
  const [clubCoachOnboardingComplete, setClubCoachOnboardingComplete] = useState(saved?.clubCoachOnboardingComplete ?? false)
  const clubDemoSeed = useMemo(() => {
    if (saved?.accountType !== 'club') return false
    const swimmers = saved?.clubSwimmers
    return !swimmers || swimmers.length === 0 || swimmers.length === 5
  }, [saved?.accountType, saved?.clubSwimmers?.length])

  const [clubClasses, setClubClassesState] = useState<SwimClass[]>(() => {
    const fromSaved = saved?.clubClasses
    if (clubDemoSeed) return DEMO_CLASSES
    return fromSaved ?? []
  })
  const [clubSwimmers, setClubSwimmersState] = useState<ClubSwimmer[]>(() => {
    const fromSaved = saved?.clubSwimmers
    if (clubDemoSeed) return DEMO_CLUB_SWIMMERS
    return fromSaved ?? []
  })
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
  const [isPremiumTier, setIsPremiumTier] = useState(false)

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
        clubSwimmers,
        clubPayments,
        clubStatUploads,
        clubInstructors,
      })
    }
  }, [user, accountType, swimmers, activeSwimmerId, teamProfile, coachProfile, parentOnboardingComplete, clubCoachOnboardingComplete, clubClasses, clubSwimmers, clubPayments, clubStatUploads, clubInstructors])

  const signIn = useCallback((email: string, _password: string) => {
    const emailToUse = email || 'demo@ausswim.com'
    setUser({ name: 'Demo User', email: emailToUse })
    setAccountTypeState('parent')
    setSwimmers(DEMO_SWIMMERS)
    setActiveSwimmerIdState(DEMO_SWIMMERS[0].id)
    setTeamProfileState(null)
    setParentOnboardingComplete(true)
  }, [])

  const signInAsClubDemo = useCallback(() => {
    setUser({ name: 'Sarah Chen', email: 'clubdemo@ausswim.com' })
    setAccountTypeState('club')
    setSwimmers([])
    setActiveSwimmerIdState(null)
    setTeamProfileState(DEMO_TEAM_PROFILE)
    setParentOnboardingComplete(false)
    setClubCoachOnboardingComplete(true)
    setClubClassesState(DEMO_CLASSES)
    setClubSwimmersState(DEMO_CLUB_SWIMMERS)
    setClubPaymentsState(DEMO_PAYMENTS)
    setClubStatUploadsState(DEMO_STAT_UPLOADS)
    setClubInstructorsState(DEMO_INSTRUCTORS)
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
    setClubSwimmersState([])
    setClubPaymentsState([])
    setClubStatUploadsState([])
    setClubInstructorsState([])
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
    setClubSwimmersState([])
    setClubPaymentsState([])
    setClubStatUploadsState([])
    setClubInstructorsState([])
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
      prev.map((s) => (s.id === activeSwimmerId ? { ...s, pathwayStage: stageId } : s))
    )
  }, [activeSwimmerId])

  const addSwimmer = useCallback((profile: Omit<SwimmerProfile, 'id'>) => {
    const id = `swimmer-${Date.now()}`
    const year = new Date().getFullYear()
    const uniqueSuffix = String(10000 + (Date.now() % 90000))
    const memberId =
      profile.memberId?.trim() || `AUS-${year}-${uniqueSuffix}`
    const newProfile: SwimmerProfile = { ...profile, id, memberId }
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

  const setClubSwimmers = useCallback((swimmers: ClubSwimmer[]) => setClubSwimmersState(swimmers), [])
  const addClubSwimmer = useCallback((s: Omit<ClubSwimmer, 'id'>) => {
    setClubSwimmersState((prev) => [...prev, { ...s, id: `cs-${Date.now()}` }])
  }, [])
  const updateClubSwimmer = useCallback((id: string, s: Partial<ClubSwimmer>) => {
    setClubSwimmersState((prev) => prev.map((x) => (x.id === id ? { ...x, ...s } : x)))
  }, [])

  const setClubPayments = useCallback((payments: PaymentRecord[]) => setClubPaymentsState(payments), [])
  const addClubPayment = useCallback((p: Omit<PaymentRecord, 'id'>) => {
    setClubPaymentsState((prev) => [...prev, { ...p, id: `pay-${Date.now()}` }])
  }, [])

  const setClubStatUploads = useCallback((uploads: StatUpload[]) => setClubStatUploadsState(uploads), [])
  const addClubStatUpload = useCallback((u: Omit<StatUpload, 'id'>) => {
    setClubStatUploadsState((prev) => [...prev, { ...u, id: `st-${Date.now()}`, uploadedAt: new Date().toISOString() }])
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
      isPremiumTier,
      setIsPremiumTier,
    }),
    [
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
      isPremiumTier,
    ]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
