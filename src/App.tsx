import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { RedirectToDashboard } from './components/auth/RedirectToDashboard'
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
import { CoachDashboard } from './pages/CoachDashboard'
import { FederationDashboard } from './pages/FederationDashboard'
import { FederationSectionPage } from './pages/FederationSectionPage'
import { SwimmerProfile } from './pages/SwimmerProfile'
import { Pathway } from './pages/Pathway'
import { Calendar } from './pages/Calendar'
import { Insights } from './pages/Insights'
import { InsightCategoryPage } from './pages/InsightCategoryPage'
import { Classes } from './pages/Classes'
import { ClassDetail } from './pages/ClassDetail'
import { ClubSwimmers } from './pages/ClubSwimmers'
import { ClubSwimmerDetail } from './pages/ClubSwimmerDetail'
import { InstructorDetail } from './pages/InstructorDetail'
import { PaymentsPage } from './pages/PaymentsPage'
import { ClubStats } from './pages/ClubStats'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { ProfileSettings } from './pages/ProfileSettings'

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
            <Route index element={<RedirectToDashboard />} />
            <Route path={ROUTES.app.dashboard.slice(1)} element={<Dashboard />} />
            <Route path={ROUTES.app.teamDashboard.slice(1)} element={<ClubDashboard />} />
            <Route path={ROUTES.app.coachDashboard.slice(1)} element={<CoachDashboard />} />
            <Route path={ROUTES.app.federationDashboard.slice(1)} element={<FederationDashboard />} />
            <Route path="federation-dashboard/section/:sectionId" element={<FederationSectionPage />} />
            <Route path={ROUTES.app.profile.slice(1)} element={<SwimmerProfile />} />
            <Route path="profile/settings" element={<ProfileSettings />} />
            <Route path={ROUTES.app.pathway.slice(1)} element={<Pathway />} />
            <Route path={ROUTES.app.calendar.slice(1)} element={<Calendar />} />
            <Route path={ROUTES.app.assessments.slice(1)} element={<PlaceholderPage name="Assessments" />} />
            <Route path={ROUTES.app.insights.slice(1)} element={<Insights />} />
            <Route path="insights/category/:categoryId" element={<InsightCategoryPage />} />
            <Route path={ROUTES.app.services.slice(1)} element={<PlaceholderPage name="Services" />} />
            <Route path={ROUTES.app.classes.slice(1)} element={<Classes />} />
            <Route path="classes/:id" element={<ClassDetail />} />
            <Route path={ROUTES.app.swimmers.slice(1)} element={<ClubSwimmers />} />
            <Route path="swimmers/:id" element={<ClubSwimmerDetail />} />
            <Route path="instructors/:id" element={<InstructorDetail />} />
            <Route path={ROUTES.app.payments.slice(1)} element={<PaymentsPage />} />
            <Route path={ROUTES.app.stats.slice(1)} element={<ClubStats />} />
          </Route>
          <Route path="*" element={<Navigate to={ROUTES.signIn} replace />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}

export default App
