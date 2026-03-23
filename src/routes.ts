/**
 * Central route paths for the Swimming Australia prototype.
 * Keeps navigation and redirects consistent.
 */
export const ROUTES = {
  signIn: '/sign-in',
  signUp: '/sign-up',
  accountType: '/account-type',
  onboarding: {
    parent: '/onboarding/parent',
    team: '/onboarding/team',
    coach: '/onboarding/coach',
    federation: '/onboarding/federation',
  },
  app: {
    index: '/',
    dashboard: '/dashboard',
    teamDashboard: '/team-dashboard',
    coachDashboard: '/coach-dashboard',
    federationDashboard: '/federation-dashboard',
    /** Federation insight section (e.g. participation-growth). */
    federationDashboardSection: (sectionId: string) => `/federation-dashboard/section/${sectionId}`,
    profile: '/profile',
    profileSettings: '/profile/settings',
    pathway: '/pathway',
    calendar: '/calendar',
    assessments: '/assessments',
    insights: '/insights',
    /** Deep link to actionable insights (Overview tab + scroll). */
    insightsActionable: '/insights#actionable',
    /** Single insight category page (e.g. participation, talent-signals). */
    insightCategory: (categoryId: string) => `/insights/category/${categoryId}`,
    services: '/services',
    classes: '/classes',
    classDetail: (id: string) => `/classes/${id}`,
    swimmers: '/swimmers',
    swimmerDetail: (id: string) => `/swimmers/${id}`,
    instructors: '/instructors',
    instructorDetail: (id: string) => `/instructors/${id}`,
    payments: '/payments',
    stats: '/stats',
    events: '/events',
    eventCreate: '/events/new',
    eventDetail: (id: string) => `/events/${id}`,
    eventEdit: (id: string) => `/events/${id}/edit`,
    myEvents: '/my-events',
  },
} as const

/**
 * Federation: light shell (dashboard, sections, profile, settings).
 */
export function isFederationLightThemeRoute(pathname: string): boolean {
  return (
    pathname === ROUTES.app.federationDashboard ||
    pathname.startsWith(`${ROUTES.app.federationDashboard}/section/`) ||
    pathname === ROUTES.app.profile ||
    pathname === ROUTES.app.profileSettings
  )
}

export function getOnboardingRouteForAccountType(
  type: 'parent' | 'club' | 'federation'
): string {
  switch (type) {
    case 'parent':
      return ROUTES.onboarding.parent
    case 'club':
      return ROUTES.onboarding.team
    case 'federation':
      return ROUTES.onboarding.federation
    default:
      return ROUTES.accountType
  }
}

export function getDestinationAfterOnboarding(
  type: 'parent' | 'club' | 'federation'
): string {
  switch (type) {
    case 'parent':
      return ROUTES.app.profile
    case 'club':
      return ROUTES.app.teamDashboard
    case 'federation':
      return ROUTES.app.federationDashboard
    default:
      return ROUTES.app.dashboard
  }
}
