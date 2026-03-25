import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { ScrollToTop } from './components/auth/ScrollToTop'
import { AppShell } from './components/layout/AppShell'
import { ROUTES } from './routes'
import { SignIn } from './pages/SignIn'
import { SignUp } from './pages/SignUp'
import { AccountTypePage } from './pages/AccountType'
import { ParentOnboarding } from './pages/onboarding/ParentOnboarding'
import { ClubCoachOnboarding } from './pages/onboarding/ClubCoachOnboarding'
import { Dashboard } from './pages/Dashboard'
import { ClubDashboard } from './pages/ClubDashboard'
import { FederationDashboard } from './pages/FederationDashboard'
import { FederationSectionPage } from './pages/FederationSectionPage'
import { DataInfrastructurePage } from './pages/DataInfrastructurePage'
import { SwimmerProfile } from './pages/SwimmerProfile'
import {
  PathwayHighPerformancePage,
  PathwayLayout,
  PathwayOverviewPage,
} from './pages/Pathway'
import { Insights } from './pages/Insights'
import { HpProductsPage } from './pages/HpProductsPage'
import { CalendarEventsPage, CalendarLayout, CalendarSchedulePage } from './pages/Calendar'
import { Classes } from './pages/Classes'
import { ClassDetail } from './pages/ClassDetail'
import { ClubSwimmerDetail } from './pages/ClubSwimmerDetail'
import { InstructorDetail } from './pages/InstructorDetail'
import { PaymentsPage } from './pages/PaymentsPage'
import { ClubStats } from './pages/ClubStats'
import { ProfileSettings } from './pages/ProfileSettings'
import { CreateEventPage } from './pages/CreateEventPage'
import { EditEventPage } from './pages/EditEventPage'
import { EventDetailPage } from './pages/EventDetailPage'
import { PlansPage } from './pages/PlansPage'
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppProvider>
        <Routes>
          <Route path={ROUTES.signIn} element={<SignIn />} />
          <Route path={ROUTES.signUp} element={<SignUp />} />
          <Route path={ROUTES.accountType} element={<AccountTypePage />} />
          <Route path={ROUTES.onboarding.parent} element={<ParentOnboarding />} />
          <Route path={ROUTES.onboarding.team} element={<ClubCoachOnboarding />} />
          <Route path={ROUTES.onboarding.coach} element={<ClubCoachOnboarding />} />
          <Route path={ROUTES.onboarding.federation} element={<ClubCoachOnboarding />} />
          <Route path={ROUTES.app.index} element={<AppShell />}>
            <Route path={ROUTES.app.dashboard.slice(1)} element={<Dashboard />} />
            <Route path={ROUTES.app.teamDashboard.slice(1)} element={<ClubDashboard />} />
            <Route path={ROUTES.app.federationDashboard.slice(1)} element={<FederationDashboard />} />
            <Route
              path="federation-dashboard/revenue"
              element={<Navigate to={ROUTES.app.federationDashboard} replace />}
            />
            <Route path="federation-dashboard/data-infrastructure" element={<DataInfrastructurePage />} />
            <Route path="federation-dashboard/section/:sectionId" element={<FederationSectionPage />} />
            <Route path={ROUTES.app.profile.slice(1)} element={<SwimmerProfile />} />
            <Route path="profile/settings" element={<ProfileSettings />} />
            <Route path="pathway" element={<PathwayLayout />}>
              <Route index element={<PathwayOverviewPage />} />
              <Route path="high-performance" element={<PathwayHighPerformancePage />} />
            </Route>
            <Route path={ROUTES.app.insights.slice(1)} element={<Insights />} />
            <Route path={ROUTES.app.hpProducts.slice(1)} element={<HpProductsPage />} />
            <Route path={ROUTES.app.plans.slice(1)} element={<PlansPage />} />
            <Route path="calendar" element={<CalendarLayout />}>
              <Route index element={<CalendarSchedulePage />} />
              <Route path="events" element={<CalendarEventsPage />} />
            </Route>
            <Route path={ROUTES.app.classes.slice(1)} element={<Classes />} />
            <Route path="classes/:id" element={<ClassDetail />} />
            <Route path={ROUTES.app.swimmers.slice(1)} element={<Navigate to={ROUTES.app.classes} replace />} />
            <Route path="swimmers/:id" element={<ClubSwimmerDetail />} />
            <Route path="instructors/:id" element={<InstructorDetail />} />
            <Route path={ROUTES.app.payments.slice(1)} element={<PaymentsPage />} />
            <Route path={ROUTES.app.stats.slice(1)} element={<ClubStats />} />
            <Route path={ROUTES.app.eventCreate.slice(1)} element={<CreateEventPage />} />
            <Route path="events/:id/edit" element={<EditEventPage />} />
            <Route path="events/:id" element={<EventDetailPage />} />
            <Route path="events" element={<Navigate to={ROUTES.app.calendarEvents} replace />} />
          </Route>
          <Route path="*" element={<Navigate to={ROUTES.signIn} replace />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}

export default App
