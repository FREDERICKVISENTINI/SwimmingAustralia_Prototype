import { useLocation, Navigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { ROUTES } from '../../routes'
import { ClubAdminOnboarding } from './ClubAdminOnboarding'
import { CoachOnboarding } from './CoachOnboarding'

export function ClubCoachOnboarding() {
  const { accountType } = useApp()
  const { pathname } = useLocation()
  const isTeamPath = pathname === ROUTES.onboarding.team

  if (accountType === 'club' && !isTeamPath) {
    return <Navigate to={ROUTES.onboarding.team} replace />
  }
  if (accountType === 'federation' && isTeamPath) {
    return <Navigate to={ROUTES.onboarding.federation} replace />
  }
  if (accountType === 'club') return <ClubAdminOnboarding />
  if (accountType === 'federation') return <CoachOnboarding />
  return null
}
