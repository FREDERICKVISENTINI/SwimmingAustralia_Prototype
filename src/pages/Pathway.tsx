import { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useOutletContext } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { PageSection } from '../components/layout/PageSection'
import { NearbyProgramCard } from '../components/pathway/NearbyProgramCard'
import { ServiceRecommendationCard } from '../components/pathway/ServiceRecommendationCard'
import { NextStepCard } from '../components/pathway/NextStepCard'
import { PathwayFunnel } from '../components/pathway/PathwayFunnel'
import { SponsorshipCard } from '../components/pathway/SponsorshipCard'
import { StageDetailPanel } from '../components/pathway/StageDetailPanel'
import { PATHWAY_STAGES } from '../theme/tokens'
import { getPathwayStageContent } from '../data/pathwayStageContent'
import { getStagePromo } from '../data/pathwayStagePromo'
import { ROUTES } from '../routes'
import type { PathwayStageContent } from '../types/pathwayRecommendations'

export type PathwayOutletContext = {
  content: PathwayStageContent | null
  selectedStageId: string
  isRecreation: boolean
  openStagePanelId: string | null
  setOpenStagePanelId: (id: string | null) => void
}

function resolveParentPathwayStageId(swimmer: {
  pathwayStageId?: string | null
  pathwayStage?: string | null
}): string | null {
  const raw = swimmer.pathwayStageId ?? swimmer.pathwayStage ?? null
  if (!raw) return null
  return PATHWAY_STAGES.some((s) => s.id === raw) ? raw : null
}

/** Shell: funnel, Overview | High performance nav, outlet, stage panel. */
export function PathwayLayout() {
  const {
    accountType,
    swimmerProfile,
    setPathwayStage,
    swimmers,
    activeSwimmerId,
    setActiveSwimmerId,
  } = useApp()

  const parentStageId =
    accountType === 'parent' && swimmerProfile
      ? resolveParentPathwayStageId(swimmerProfile)
      : null
  const initialStageId = parentStageId ?? PATHWAY_STAGES[0].id

  const [selectedStageId, setSelectedStageId] = useState<string>(initialStageId)
  const [openStagePanelId, setOpenStagePanelId] = useState<string | null>(null)

  useEffect(() => {
    if (accountType !== 'parent' || !swimmerProfile) return
    const id = resolveParentPathwayStageId(swimmerProfile)
    if (id) setSelectedStageId(id)
  }, [accountType, swimmerProfile?.id, swimmerProfile?.pathwayStageId])

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

  const isRecreation = selectedStageId === 'recreation'

  const outletContext: PathwayOutletContext = useMemo(
    () => ({
      content,
      selectedStageId,
      isRecreation,
      openStagePanelId,
      setOpenStagePanelId,
    }),
    [content, selectedStageId, isRecreation, openStagePanelId]
  )

  const showFamilySwimmerSwitcher = accountType === 'parent' && swimmers.length > 1

  return (
    <PageSection
      title="Pathway"
      subtitle={
        <>
          <p>From first strokes to high performance.</p>
          {showFamilySwimmerSwitcher && (
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <label htmlFor="pathway-family-swimmer" className="text-sm font-medium text-text-muted">
                Swimmer
              </label>
              <select
                id="pathway-family-swimmer"
                value={activeSwimmerId ?? ''}
                onChange={(e) => setActiveSwimmerId(e.target.value || null)}
                className="min-w-[12rem] rounded-[var(--radius-button)] border border-border bg-bg-elevated px-3 py-2 text-sm text-text-primary"
              >
                {swimmers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName}
                  </option>
                ))}
              </select>
              <span className="text-xs text-text-muted">
                Pathway funnel and content below follow the selected swimmer.
              </span>
            </div>
          )}
        </>
      }
    >
      {showFunnel && (
        <div className="mt-6">
          <PathwayFunnel
            currentStageId={swimmerProfile!.pathwayStageId}
            swimmerName={fullName}
            onStageSelect={handleStageChange}
          />
        </div>
      )}

      {content && (
        <div className="mt-8">
          <div
            className="border-b border-border bg-bg-elevated/50"
            role="tablist"
            aria-label="Pathway sections"
          >
            <div className="flex gap-0 overflow-x-auto">
              <NavLink
                to={ROUTES.app.pathway}
                end
                role="tab"
                className={({ isActive }) =>
                  `shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-accent text-accent'
                      : 'border-transparent text-text-muted hover:border-border hover:text-text-secondary'
                  }`
                }
              >
                Overview
              </NavLink>
              <NavLink
                to={ROUTES.app.pathwayHighPerformance}
                role="tab"
                className={({ isActive }) =>
                  `shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-accent text-accent'
                      : 'border-transparent text-text-muted hover:border-border hover:text-text-secondary'
                  }`
                }
              >
                High performance
              </NavLink>
            </div>
          </div>

          <div className="mt-6">
            <Outlet context={outletContext} />
          </div>
        </div>
      )}

      {!content && (
        <p className="mt-8 text-sm text-text-muted">No pathway content for this selection.</p>
      )}

      <StageDetailPanel
        content={stagePromoContent}
        onBack={() => setOpenStagePanelId(null)}
      />
    </PageSection>
  )
}

function usePathwayOutlet(): PathwayOutletContext {
  return useOutletContext<PathwayOutletContext>()
}

/** Programs, next step, sponsorship (`/pathway`). */
export function PathwayOverviewPage() {
  const { content, isRecreation, setOpenStagePanelId } = usePathwayOutlet()
  if (!content) return null

  return (
    <>
      <p className="text-sm text-text-muted">
        Relevant programs, clubs, and squads for this stage.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {content.programsNearYou.map((program) => (
          <NearbyProgramCard key={program.id} program={program} />
        ))}
      </div>

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
    </>
  )
}

/** HP services grid (`/pathway/high-performance`). */
export function PathwayHighPerformancePage() {
  const { content, isRecreation } = usePathwayOutlet()
  if (!content) return null

  if (isRecreation) {
    return (
      <div className="rounded-[var(--radius-card)] border border-border/60 bg-card px-6 py-10 text-center">
        <p className="text-sm text-text-secondary">
          High performance programs and services are available once your swimmer moves beyond the recreation stage.
        </p>
        <p className="mt-2 text-xs text-text-muted">
          Update pathway stage in{' '}
          <NavLink to={ROUTES.app.profile} className="font-medium text-accent hover:underline">
            My Swimmers
          </NavLink>{' '}
          to explore development support.
        </p>
      </div>
    )
  }

  return (
    <>
      <p className="text-sm text-text-muted">
        Development support that grows with your stage in the pathway.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {content.recommendedServices.map((service) => (
          <ServiceRecommendationCard key={service.id} service={service} />
        ))}
      </div>
    </>
  )
}

