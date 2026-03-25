import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { ROUTES, isFederationLightThemeRoute } from '../../routes'

export function Header() {
  const { user, signOut, accountType, isPremiumTier } = useApp()
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
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-text-muted">
            Welcome back{user?.name ? `, ${user.name}` : ''}
          </span>
          {(accountType === 'parent' || accountType === 'club') && (
            <Link
              to={ROUTES.app.plans}
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition ${
                isPremiumTier
                  ? 'bg-premium/20 text-premium ring-1 ring-premium/35'
                  : 'bg-bg-elevated text-text-muted ring-1 ring-border'
              }`}
            >
              {isPremiumTier ? 'Premium' : 'Free'}
            </Link>
          )}
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
