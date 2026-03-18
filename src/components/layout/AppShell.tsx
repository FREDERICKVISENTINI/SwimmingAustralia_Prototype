import { Outlet, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { FederationLightPageContext } from '../../context/FederationLightPageContext'
import { isFederationLightThemeRoute } from '../../routes'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function AppShell() {
  const { accountType } = useApp()
  const { pathname } = useLocation()
  const isFederation = accountType === 'federation'
  const isMemberOrClub = accountType === 'parent' || accountType === 'club'
  const federationLightPage =
    isFederation && isFederationLightThemeRoute(pathname)

  return (
    <div
      className="flex min-h-screen"
      data-theme={isFederation ? 'federation' : isMemberOrClub ? 'member-club' : undefined}
    >
      <Sidebar />
      <FederationLightPageContext.Provider value={federationLightPage}>
        <div
          className={`flex flex-1 flex-col min-w-0 ml-52 md:ml-56 ${
            federationLightPage ? 'federation-page-light' : ''
          }`}
        >
          <Header />
          <main className="flex-1 p-4 sm:p-6 md:p-8 relative">
            {!federationLightPage && (
              <div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg/30 pointer-events-none"
                aria-hidden
              />
            )}
            <div className="relative">
              <Outlet />
            </div>
          </main>
        </div>
      </FederationLightPageContext.Provider>
    </div>
  )
}
