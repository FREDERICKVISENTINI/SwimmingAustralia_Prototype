import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  Settings,
  Map,
  Database,
  ClipboardList,
  Sparkles,
  FlaskConical,
  Activity,
  Briefcase,
  BarChart3,
  Building2,
} from 'lucide-react'
import { Fragment } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { ROUTES, isFederationLightThemeRoute } from '../../routes'

const parentNavTop = [
  { to: ROUTES.app.dashboard, label: 'Home', icon: LayoutDashboard },
  { to: ROUTES.app.profile, label: 'My Swimmers', icon: Users },
] as const

const parentNavTail = [
  { to: ROUTES.app.payments, label: 'Payments', icon: CreditCard },
  { to: ROUTES.app.profileSettings, label: 'Settings', icon: Settings },
] as const

const clubNavTop = [
  { to: ROUTES.app.teamDashboard, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.app.classes, label: 'Squad details', icon: Users },
] as const

const clubNavTail = [
  { to: ROUTES.app.stats, label: 'Results', icon: ClipboardList },
  { to: ROUTES.app.payments, label: 'Payments', icon: CreditCard },
  { to: ROUTES.app.profileSettings, label: 'Settings', icon: Settings },
] as const

export function Sidebar() {
  const { accountType } = useApp()
  const { pathname } = useLocation()
  const isFederation = accountType === 'federation'
  const federationLightSidebar =
    isFederation && isFederationLightThemeRoute(pathname)
  const appLightSidebar = accountType != null && !isFederation

  const asideClass = federationLightSidebar
    ? 'federation-sidebar-light fixed left-0 top-0 z-30 flex h-screen w-52 flex-col border-r border-border md:w-56'
    : appLightSidebar
      ? 'app-sidebar-light fixed left-0 top-0 z-30 flex h-screen w-52 flex-col border-r border-border md:w-56'
      : 'fixed left-0 top-0 z-30 flex h-screen w-52 flex-col border-r border-border md:w-56 bg-bg-elevated/80 backdrop-blur-sm bg-gradient-to-b from-bg-elevated to-bg'

  const navActive = (isActive: boolean) =>
    isActive
      ? 'bg-accent/15 text-accent border-l-2 border-accent shadow-[inset_0_0_20px_-8px_rgb(0,153,204,0.18)] -ml-[2px] pl-[14px]'
      : 'text-text-secondary hover:bg-card/80 hover:text-text-primary border-l-2 border-transparent'

  const navActiveDark = (isActive: boolean) =>
    isActive
      ? 'bg-accent/15 text-accent border-l-2 border-accent shadow-[inset_0_0_20px_-8px_rgb(53,199,243,0.2)] -ml-[2px] pl-[14px]'
      : 'text-text-secondary hover:bg-card/80 hover:text-text-primary border-l-2 border-transparent'

  const subNavActive = (isActive: boolean) =>
    isActive
      ? 'bg-accent/15 text-accent border-accent shadow-[inset_0_0_20px_-8px_rgb(0,153,204,0.18)]'
      : 'text-text-secondary hover:bg-card/80 hover:text-text-primary border-transparent hover:border-accent'

  const subNavActiveDark = (isActive: boolean) =>
    isActive
      ? 'bg-accent/15 text-accent border-accent shadow-[inset_0_0_20px_-8px_rgb(53,199,243,0.2)]'
      : 'text-text-secondary hover:bg-card/80 hover:text-text-primary border-transparent hover:border-accent'

  const navEndExact = (path: string) =>
    path === ROUTES.app.federationDashboard ||
    path === ROUTES.app.federationDataInfrastructure ||
    path === ROUTES.app.profileSettings ||
    path === ROUTES.app.profile

  const activeStyle = (isActive: boolean) =>
    `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
      appLightSidebar || federationLightSidebar ? navActive(isActive) : navActiveDark(isActive)
    }`

  return (
    <aside className={asideClass}>
      <div className="flex h-14 items-center border-b border-border/80 px-4">
        <span className="font-display text-lg font-semibold text-text-primary tracking-tight">
          Swimming Australia
        </span>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {accountType === 'club' ? (
          <>
            {clubNavTop.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={navEndExact(to)}
                className={({ isActive }) => activeStyle(isActive)}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </NavLink>
            ))}
            <NavLink
              to={ROUTES.app.calendar}
              end
              className={({ isActive }) =>
                activeStyle(
                  isActive ||
                    pathname.startsWith(`${ROUTES.app.calendar}/`) ||
                    pathname === ROUTES.app.calendarEvents
                )
              }
            >
              <Calendar className="h-4 w-4 shrink-0" />
              Calendar
            </NavLink>
            <NavLink
              to={ROUTES.app.hpProducts}
              end
              className={({ isActive }) =>
                activeStyle(isActive || pathname.startsWith(`${ROUTES.app.hpProducts}/`))
              }
            >
              <FlaskConical className="h-4 w-4 shrink-0" />
              High performance
            </NavLink>
            {clubNavTail.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={navEndExact(to)}
                className={({ isActive }) => activeStyle(isActive)}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </NavLink>
            ))}
          </>
        ) : accountType === 'federation' ? (
          <>
            {(
              [
                { to: ROUTES.app.federationDashboard, label: 'Dashboard', icon: LayoutDashboard, dividerAfter: true },
                { to: ROUTES.app.federationDashboardSection('player-database'), label: 'Player database', icon: Users },
                {
                  to: ROUTES.app.federationDashboardSection('club-database'),
                  label: 'Club database',
                  icon: Building2,
                  dividerAfter: true,
                },
                {
                  to: ROUTES.app.federationDataInfrastructure,
                  label: 'Data Infrastructure',
                  icon: Database,
                  dividerAfter: true,
                },
                { to: ROUTES.app.federationDashboardSection('system-health'), label: 'System Health', icon: Activity },
                {
                  to: ROUTES.app.federationDashboardSection('commercial'),
                  label: 'Commercial',
                  icon: Briefcase,
                  dividerAfter: true,
                },
                { to: ROUTES.app.federationDashboardSection('performance'), label: 'Leverage AI', icon: BarChart3 },
                { to: ROUTES.app.profileSettings, label: 'Settings', icon: Settings },
              ] as const
            ).map(({ to, label, icon: Icon, ...rest }) => (
              <Fragment key={to}>
                <NavLink
                  to={to}
                  end={navEndExact(to)}
                  className={({ isActive }) => activeStyle(isActive)}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </NavLink>
                {'dividerAfter' in rest && rest.dividerAfter ? (
                  <div className="my-1.5 border-t border-border/80" role="separator" aria-hidden />
                ) : null}
              </Fragment>
            ))}
          </>
        ) : (
          <>
            {parentNavTop.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={navEndExact(to)}
                className={({ isActive }) => activeStyle(isActive)}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </NavLink>
            ))}
            <div className="mt-2 border-t border-border/80 pt-2">
              <p className="flex items-center gap-2 px-3 pb-1.5 text-xs font-medium uppercase tracking-wider text-text-muted">
                <Map className="h-3.5 w-3.5 shrink-0" aria-hidden />
                Pathway
              </p>
              <ul className="space-y-0.5">
                <li>
                  <NavLink
                    to={ROUTES.app.pathway}
                    end
                    className={({ isActive }) =>
                      `flex rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 border-l-2 -ml-[2px] pl-[14px] ${
                        appLightSidebar ? subNavActive(isActive) : subNavActiveDark(isActive)
                      }`
                    }
                  >
                    Overview
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={ROUTES.app.pathwayHighPerformance}
                    end
                    className={({ isActive }) =>
                      `flex rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 border-l-2 -ml-[2px] pl-[14px] ${
                        appLightSidebar ? subNavActive(isActive) : subNavActiveDark(isActive)
                      }`
                    }
                  >
                    High performance
                  </NavLink>
                </li>
              </ul>
            </div>
            <NavLink
              to={ROUTES.app.calendar}
              end
              className={({ isActive }) =>
                activeStyle(
                  isActive ||
                    pathname.startsWith(`${ROUTES.app.calendar}/`) ||
                    pathname === ROUTES.app.calendarEvents
                )
              }
            >
              <Calendar className="h-4 w-4 shrink-0" />
              Calendar
            </NavLink>
            <NavLink
              to={ROUTES.app.insights}
              end
              className={({ isActive }) =>
                activeStyle(isActive || pathname.startsWith(`${ROUTES.app.insights}/`))
              }
            >
              <Sparkles className="h-4 w-4 shrink-0" />
              Insights
            </NavLink>
            {parentNavTail.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={navEndExact(to)}
                className={({ isActive }) => activeStyle(isActive)}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </NavLink>
            ))}
          </>
        )}
      </nav>
    </aside>
  )
}
