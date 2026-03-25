/**
 * Central route paths for the Swimming Australia prototype.
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
    federationDashboard: '/federation-dashboard',
    federationDataInfrastructure: '/federation-dashboard/data-infrastructure',
    federationDashboardSection: (sectionId: string) => `/federation-dashboard/section/${sectionId}`,
    profile: '/profile',
    profileSettings: '/profile/settings',
    pathway: '/pathway',
    pathwayHighPerformance: '/pathway/high-performance',
    insights: '/insights',
    hpProducts: '/hp-products',
    /** Parent & club: monetisation / tiers / premium (commercial demo). */
    plans: '/plans',
    calendar: '/calendar',
    /** Club events list (nested under Calendar in the app shell). */
    calendarEvents: '/calendar/events',
    classes: '/classes',
    classDetail: (id: string) => `/classes/${id}`,
    swimmers: '/swimmers',
    swimmerDetail: (id: string) => `/swimmers/${id}`,
    instructors: '/instructors',
    instructorDetail: (id: string) => `/instructors/${id}`,
    payments: '/payments',
    stats: '/stats',
    /** Events browse/manage — lives under Calendar as the Events sub-view. */
    events: '/calendar/events',
    eventCreate: '/events/new',
    eventDetail: (id: string) => `/events/${id}`,
    eventEdit: (id: string) => `/events/${id}/edit`,
  },
} as const

export function isFederationLightThemeRoute(pathname: string): boolean {
  return (
    pathname === ROUTES.app.federationDashboard ||
    pathname === ROUTES.app.federationDataInfrastructure ||
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
