import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  BarChart3,
  Lightbulb,
  GraduationCap,
  Settings,
  Map,
} from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { ROUTES, isFederationLightThemeRoute } from '../../routes'

import { FEDERATION_SECTIONS } from '../../data/federationSections'

const parentNavItems = [
  { to: ROUTES.app.dashboard, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.app.calendar, label: 'Calendar', icon: Calendar },
  { to: ROUTES.app.pathway, label: 'Pathway', icon: Map },
  { to: ROUTES.app.profile, label: 'Profile', icon: Users },
  { to: ROUTES.app.profileSettings, label: 'Settings', icon: Settings },
  { to: ROUTES.app.payments, label: 'Payments', icon: CreditCard },
  { to: ROUTES.app.insights, label: 'Premium data', icon: Lightbulb },
] as const

const clubNavItems = [
  { to: ROUTES.app.teamDashboard, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.app.classes, label: 'Class management', icon: GraduationCap },
  { to: ROUTES.app.swimmers, label: 'Swimmers', icon: Users },
  { to: ROUTES.app.calendar, label: 'Calendar', icon: Calendar },
  { to: ROUTES.app.payments, label: 'Payments', icon: CreditCard },
  { to: ROUTES.app.stats, label: 'Meets & Uploads', icon: BarChart3 },
  { to: ROUTES.app.insights, label: 'Premium data', icon: Lightbulb },
  { to: ROUTES.app.profile, label: 'Profile', icon: Users },
  { to: ROUTES.app.profileSettings, label: 'Settings', icon: Settings },
] as const

export function Sidebar() {
  const { accountType } = useApp()
  const { pathname } = useLocation()
  const isFederation = accountType === 'federation'
  const federationLightSidebar =
    isFederation && isFederationLightThemeRoute(pathname)
  const appLightSidebar = accountType != null && !isFederation

  const items =
    accountType === 'club'
      ? clubNavItems
      : accountType === 'federation'
        ? [
            { to: ROUTES.app.federationDashboard, label: 'Federation dashboard', icon: LayoutDashboard },
            ...parentNavItems.filter(
              (item) =>
                item.to !== ROUTES.app.dashboard &&
                item.to !== ROUTES.app.pathway &&
                item.to !== ROUTES.app.calendar &&
                item.to !== ROUTES.app.profile &&
                item.to !== ROUTES.app.payments &&
                item.to !== ROUTES.app.insights
            ),
          ]
        : parentNavItems

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

  return (
    <aside className={asideClass}>
      <div className="flex h-14 items-center border-b border-border/80 px-4">
        <span className="font-display text-lg font-semibold text-text-primary tracking-tight">
          Swimming Australia
        </span>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === ROUTES.app.federationDashboard || to === ROUTES.app.profile}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                federationLightSidebar || appLightSidebar ? navActive(isActive) : navActiveDark(isActive)
              }`
            }
          >
            {Icon ? <Icon className="h-4 w-4 shrink-0" /> : null}
            {label}
          </NavLink>
        ))}

        {accountType === 'federation' && (
          <div className="mt-2 border-t border-border/80 pt-2">
            <ul className="space-y-0.5">
              {FEDERATION_SECTIONS.map(({ id, label }) => (
                <li key={id}>
                  <NavLink
                    to={ROUTES.app.federationDashboardSection(id)}
                    end
                    className={({ isActive }) =>
                      `flex rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 border-l-2 -ml-[2px] pl-[14px] ${
                        federationLightSidebar ? subNavActive(isActive) : subNavActiveDark(isActive)
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </aside>
  )
}
