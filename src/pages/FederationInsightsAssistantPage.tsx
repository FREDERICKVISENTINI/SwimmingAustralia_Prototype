import { PageSection } from '../components/layout/PageSection'
import { InsightsAssistantPanel } from '../components/federation/insightsAssistant'

export function FederationInsightsAssistantPage() {
  return (
    <PageSection
      title="Insights Assistant"
      subtitle={
        <p>
          Query unified federation data in natural language. Receive analytics views or evidence-based
          shortlists for sponsorship, development, and commercial decisions — prototype responses only.
        </p>
      }
    >
      <InsightsAssistantPanel />
    </PageSection>
  )
}
