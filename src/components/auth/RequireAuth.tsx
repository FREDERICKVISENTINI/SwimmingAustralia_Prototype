import { Navigate, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { ROUTES, getOnboardingRouteForAccountType } from '../../routes'

type Props = {
  children: React.ReactNode
}

/**
 * Redirects to sign-in if no user; then account-type; then the correct onboarding flow; then app.
 */
export function RequireAuth({ children }: Props) {
  const { user, accountType, parentOnboardingComplete, clubCoachOnboardingComplete } = useApp()
  const location = useLocation()

  if (!user) {
    return <Navigate to={ROUTES.signIn} state={{ from: location }} replace />
  }

  if (!accountType) {
    return <Navigate to={ROUTES.accountType} replace />
  }

  if (accountType === 'parent' && !parentOnboardingComplete) {
    return <Navigate to={ROUTES.onboarding.parent} replace />
  }

  if ((accountType === 'club' || accountType === 'federation') && !clubCoachOnboardingComplete) {
    return <Navigate to={getOnboardingRouteForAccountType(accountType)} replace />
  }

  return <>{children}</>
}
