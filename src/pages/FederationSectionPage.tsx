import { useParams, Navigate, Link } from 'react-router-dom'
import { PageSection } from '../components/layout/PageSection'
import { SystemHealthPathwayPanel } from '../components/federation/SystemHealthPathwayPanel'
import { FederationPlayerDatabasePanel } from '../components/federation/FederationPlayerDatabasePanel'
import { FederationClubDatabasePanel } from '../components/federation/FederationClubDatabasePanel'
import { FederationCommercialOverview } from '../components/federation/commercial'
import { FederationAiLeveragePage } from '../components/federation/FederationAiLeveragePage'
import { FEDERATION_SECTIONS, isFederationSectionId } from '../data/federationSections'
import { ROUTES } from '../routes'

const LEVERAGE_AI_SUBTITLE =
  'AI-enabled use cases to improve pathway visibility, retention, performance, and commercial value.'

export function FederationSectionPage() {
  const { sectionId } = useParams<{ sectionId: string }>()

  if (sectionId === 'retention') {
    return <Navigate to={ROUTES.app.federationDashboardSection('player-database')} replace />
  }

  const validSectionId =
    sectionId && isFederationSectionId(sectionId) ? sectionId : null

  if (!validSectionId) {
    return <Navigate to={ROUTES.app.federationDashboard} replace />
  }

  const section = FEDERATION_SECTIONS.find((s) => s.id === validSectionId)!

  const isLeverageAi = validSectionId === 'performance'

  return (
    <PageSection
      title={isLeverageAi ? 'Leverage AI' : section.label}
      subtitle={isLeverageAi ? LEVERAGE_AI_SUBTITLE : undefined}
    >
      <p className="text-sm text-text-muted -mt-2 mb-4">
        <Link to={ROUTES.app.federationDashboard} className="text-accent hover:underline">
          ← Federation dashboard
        </Link>
      </p>

      <div className="mt-2">
        {validSectionId === 'system-health' && <SystemHealthPathwayPanel />}

        {validSectionId === 'commercial' && <FederationCommercialOverview />}

        {validSectionId === 'player-database' && <FederationPlayerDatabasePanel />}

        {validSectionId === 'club-database' && <FederationClubDatabasePanel />}

        {validSectionId === 'performance' && <FederationAiLeveragePage />}
      </div>
    </PageSection>
  )
}
