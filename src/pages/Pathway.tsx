import { useMemo, useState } from 'react'
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

export function Pathway() {
  const { accountType, swimmerProfile, setPathwayStage } = useApp()
  const initialStageId =
    accountType === 'parent' && swimmerProfile?.pathwayStage
      ? swimmerProfile.pathwayStage
      : PATHWAY_STAGES[0].id

  const [selectedStageId, setSelectedStageId] = useState<string>(initialStageId)
  const [openStagePanelId, setOpenStagePanelId] = useState<string | null>(null)

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
        <div className="mt-8 space-y-10">
          {/* A. Programs Near You */}
          <section>
            <h2 className="font-display text-lg font-semibold text-text-primary md:text-xl">
              Programs near you
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              Relevant programs, clubs, and squads for this stage.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {content.programsNearYou.map((program) => (
                <NearbyProgramCard key={program.id} program={program} />
              ))}
            </div>
          </section>

          {/* B. Upcoming Opportunities */}
          <section>
            <h2 className="font-display text-lg font-semibold text-text-primary md:text-xl">
              Upcoming opportunities
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              Trials, meets, camps, and events relevant to this stage.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {content.upcomingOpportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                />
              ))}
            </div>
          </section>

          {/* C. Recommended High-Performance Services (hidden for Recreation) */}
          {selectedStageId !== 'recreation' && (
            <section>
              <h2 className="font-display text-lg font-semibold text-text-primary md:text-xl">
                Recommended high-performance services
              </h2>
              <p className="mt-1 text-sm text-text-muted">
                Development support that grows with your stage in the pathway.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {content.recommendedServices.map((service) => (
                  <ServiceRecommendationCard
                    key={service.id}
                    service={service}
                  />
                ))}
              </div>
            </section>
          )}

          {/* D. Next Step in Pathway (hidden for Recreation) */}
          {selectedStageId !== 'recreation' && (
            <section>
              <NextStepCard
                nextStep={content.nextStep}
                onCtaClick={() => setOpenStagePanelId(content.nextStep.stageId)}
              />
            </section>
          )}

          {/* Elite: Partnerships & sponsorship */}
          {content.sponsorshipSection && (
            <section>
              <SponsorshipCard
                title={content.sponsorshipSection.title}
                items={content.sponsorshipSection.items}
              />
            </section>
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
