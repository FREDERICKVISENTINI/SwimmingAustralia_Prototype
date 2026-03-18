import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { ROUTES, isFederationLightThemeRoute } from '../../routes'

export function Header() {
  const { user, signOut, accountType } = useApp()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const federationNationalView =
    accountType === 'federation' && isFederationLightThemeRoute(pathname)

  const handleSignOut = () => {
    signOut()
    navigate(ROUTES.signIn, { replace: true })
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-bg-elevated px-6">
      {federationNationalView ? (
        <div className="font-display text-base font-semibold tracking-tight text-text-primary">
          Swimming Aus
        </div>
      ) : (
        <div className="text-sm text-text-muted">
          Welcome back{user?.name ? `, ${user.name}` : ''}
        </div>
      )}
      <button
        type="button"
        onClick={handleSignOut}
        className="rounded-lg px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-card hover:text-text-primary"
      >
        Sign out
      </button>
    </header>
  )
}
