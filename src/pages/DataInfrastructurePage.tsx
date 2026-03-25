import { useMemo, useState } from 'react'
import { PageSection } from '../components/layout/PageSection'
import {
  CategoryFlowDiagramModal,
  DataCategoriesSection,
  DataFlowSection,
  FutureDataOpportunitiesSection,
} from '../components/federation/dataInfrastructure'
import { DATA_INFRASTRUCTURE_CATEGORIES } from '../data/dataInfrastructureCategories'
import { FLOW_TO_CATEGORY_IDS, getFlowsForCategory } from '../data/dataInfrastructureFlowCategoryLinks'
import { Link } from 'react-router-dom'
import { ROUTES } from '../routes'

export function DataInfrastructurePage() {
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null)
  const [diagramCategoryId, setDiagramCategoryId] = useState<string | null>(null)

  const diagramCategoryTitle = useMemo(() => {
    if (diagramCategoryId == null) return ''
    return DATA_INFRASTRUCTURE_CATEGORIES.find((c) => c.id === diagramCategoryId)?.title ?? ''
  }, [diagramCategoryId])

  const diagramFlows = useMemo(() => {
    if (diagramCategoryId == null) return []
    return getFlowsForCategory(diagramCategoryId)
  }, [diagramCategoryId])

  const highlightedCategoryIds = useMemo(() => {
    if (selectedFlowId == null) return null
    const ids = FLOW_TO_CATEGORY_IDS[selectedFlowId as keyof typeof FLOW_TO_CATEGORY_IDS]
    if (!ids?.length) return null
    return new Set<string>(ids)
  }, [selectedFlowId])

  const handleFlowSelect = (flowId: string) => {
    setSelectedFlowId((prev) => (prev === flowId ? null : flowId))
  }

  const handleCategoryClick = (categoryId: string) => {
    if (diagramCategoryId === categoryId) {
      setDiagramCategoryId(null)
      setSelectedFlowId(null)
      return
    }
    setDiagramCategoryId(categoryId)
    const flows = getFlowsForCategory(categoryId)
    setSelectedFlowId(flows[0]?.id ?? null)
  }

  return (
    <PageSection
      title="Data Infrastructure"
      subtitle="An overview of the data captured across identity, participation, performance, engagement, and commercial activity."
      headerAction={
        <Link
          to={ROUTES.app.federationDashboard}
          className="text-sm font-medium text-text-secondary hover:text-accent transition-colors"
        >
          ← Federation dashboard
        </Link>
      }
    >
      <CategoryFlowDiagramModal
        open={diagramCategoryId != null}
        onClose={() => setDiagramCategoryId(null)}
        categoryTitle={diagramCategoryTitle}
        flows={diagramFlows}
      />

      <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:gap-16 xl:gap-20 2xl:max-w-7xl">
        <div className="relative">
          <DataFlowSection selectedFlowId={selectedFlowId} onFlowSelect={handleFlowSelect} />
        </div>

        <div className="relative border-t border-border/50 pt-12 lg:pt-16">
          <DataCategoriesSection
            highlightedCategoryIds={highlightedCategoryIds}
            selectedCategoryId={diagramCategoryId}
            onCategoryClick={handleCategoryClick}
          />
        </div>

        <div className="relative border-t border-border/50 pt-12 lg:pt-16">
          <FutureDataOpportunitiesSection />
        </div>
      </div>
    </PageSection>
  )
}
