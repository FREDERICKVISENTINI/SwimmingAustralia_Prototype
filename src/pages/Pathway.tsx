import { useEffect, useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { PageSection } from '../components/layout/PageSection'
import { NearbyProgramCard } from '../components/pathway/NearbyProgramCard'
import { OpportunityCard } from '../components/pathway/OpportunityCard'
import { ServiceRecommendationCard } from '../components/pathway/ServiceRecommendationCard'
import { NextStepCard } from '../components/pathway/NextStepCard'
import { PathwayFunnel } from '../components/pathway/PathwayFunnel'
import { SponsorshipCard } from '../components/pathway/SponsorshipCard'
import { StageDetailPanel } from '../components/pathway/StageDetailPanel'
import { PATHWAY_STAGES } from '../theme/tokens'
import { getPathwayStageContent } from '../data/pathwayStageContent'
import { getStagePromo } from '../data/pathwayStagePromo'

type PathwayTabId = 'programs' | 'opportunities' | 'services'

export function Pathway() {
  const { accountType, swimmerProfile, setPathwayStage } = useApp()
  const initialStageId =
    accountType === 'parent' && swimmerProfile?.pathwayStage
      ? swimmerProfile.pathwayStage
      : PATHWAY_STAGES[0].id

  const [selectedStageId, setSelectedStageId] = useState<string>(initialStageId)
  const [openStagePanelId, setOpenStagePanelId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<PathwayTabId>('programs')

  const isRecreation = selectedStageId === 'recreation'

  const tabs: { id: PathwayTabId; label: string; subtitle: string }[] = [
    { id: 'programs', label: 'Programs near you', subtitle: 'Relevant programs, clubs, and squads for this stage.' },
    { id: 'opportunities', label: 'Upcoming opportunities', subtitle: 'Trials, meets, camps, and events relevant to this stage.' },
    ...(!isRecreation
      ? [{ id: 'services' as PathwayTabId, label: 'HP services', subtitle: 'Development support that grows with your stage in the pathway.' }]
      : []),
  ]

  // If the active tab is hidden (recreation hides services), fall back to first tab
  useEffect(() => {
    if (!tabs.some((t) => t.id === activeTab)) {
      setActiveTab('programs')
    }
  }, [isRecreation, activeTab])

  const handleStageChange = (stageId: string) => {
    setSelectedStageId(stageId)
    setPathwayStage(stageId)
  }

  const content = useMemo(
    () => getPathwayStageContent(selectedStageId),
    [selectedStageId]
  )
  const stagePromoContent = useMemo(
    () => (openStagePanelId ? getStagePromo(openStagePanelId) : null),
    [openStagePanelId]
  )

  const showFunnel = accountType === 'parent' && swimmerProfile
  const fullName = swimmerProfile
    ? [swimmerProfile.firstName, swimmerProfile.lastName].filter(Boolean).join(' ') || 'Swimmer'
    : ''

  const activeTabMeta = tabs.find((t) => t.id === activeTab) ?? tabs[0]

  return (
    <PageSection
      title="Pathway"
      subtitle="From first strokes to high performance."
    >
      {showFunnel && (
        <div className="mt-6">
          <PathwayFunnel
            currentStageId={swimmerProfile!.pathwayStage}
            swimmerName={fullName}
            onStageSelect={handleStageChange}
          />
        </div>
      )}

      {content && (
        <div className="mt-8">
          {/* Tab bar */}
          <div
            className="border-b border-border bg-bg-elevated/50"
            role="tablist"
            aria-label="Pathway sections"
          >
            <div className="flex gap-0 overflow-x-auto">
              {tabs.map(({ id, label }) => {
                const isActive = (activeTabMeta?.id ?? 'programs') === id
                return (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(id)}
                    className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'border-accent text-accent'
                        : 'border-transparent text-text-muted hover:border-border hover:text-text-secondary'
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tab subtitle */}
          <p className="mt-4 text-sm text-text-muted">{activeTabMeta?.subtitle}</p>

          {/* Tab content */}
          <div className="mt-4">
            {activeTab === 'programs' && (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {content.programsNearYou.map((program) => (
                  <NearbyProgramCard key={program.id} program={program} />
                ))}
              </div>
            )}

            {activeTab === 'opportunities' && (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {content.upcomingOpportunities.map((opportunity) => (
                  <OpportunityCard key={opportunity.id} opportunity={opportunity} />
                ))}
              </div>
            )}

            {activeTab === 'services' && !isRecreation && (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {content.recommendedServices.map((service) => (
                  <ServiceRecommendationCard key={service.id} service={service} />
                ))}
              </div>
            )}
          </div>

          {/* Next Step & Sponsorship — always below tabs */}
          {!isRecreation && content.nextStep && (
            <div className="mt-10">
              <NextStepCard
                nextStep={content.nextStep}
                onCtaClick={() => setOpenStagePanelId(content.nextStep.stageId)}
              />
            </div>
          )}

          {content.sponsorshipSection && (
            <div className="mt-8">
              <SponsorshipCard
                title={content.sponsorshipSection.title}
                items={content.sponsorshipSection.items}
              />
            </div>
          )}
        </div>
      )}

      <StageDetailPanel
        content={stagePromoContent}
        onBack={() => setOpenStagePanelId(null)}
      />
    </PageSection>
  )
}
