import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { getDestinationAfterOnboarding } from '../../routes'
import { OnboardingProgress } from '../../components/onboarding/OnboardingProgress'
import { ClubOrgDetails } from './ClubOrgDetails'
import { ClubTeamSetup } from './ClubTeamSetup'
import { ClubConfirmation } from './ClubConfirmation'
import type { TeamProfile } from '../../context/AppContext'

const STEPS = 3

const DEMO_TEAM: Partial<TeamProfile> = {
  organisationName: 'Demo Swimming Club',
  organisationType: 'club',
  state: 'NSW',
  mainContactName: 'Demo Contact',
  contactEmail: 'demo@club.example.com',
  primaryAgeGroupFocus: 'All ages',
  numberOfSwimmers: '51-100',
  primaryPathwayStageServed: 'junior-squad',
  description: '',
}

export function ClubAdminOnboarding() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<Partial<TeamProfile>>(DEMO_TEAM)
  const { setTeamProfile, completeClubCoachOnboarding } = useApp()
  const navigate = useNavigate()

  const handleCreateTeamAccount = () => {
    const profile: TeamProfile = {
      organisationName: formData.organisationName ?? DEMO_TEAM.organisationName ?? 'Demo Club',
      organisationType: formData.organisationType ?? 'club',
      state: formData.state ?? DEMO_TEAM.state ?? 'NSW',
      mainContactName: formData.mainContactName ?? DEMO_TEAM.mainContactName ?? 'Demo',
      contactEmail: formData.contactEmail ?? DEMO_TEAM.contactEmail ?? 'demo@example.com',
      primaryAgeGroupFocus: formData.primaryAgeGroupFocus ?? DEMO_TEAM.primaryAgeGroupFocus ?? 'All ages',
      numberOfSwimmers: formData.numberOfSwimmers ?? DEMO_TEAM.numberOfSwimmers ?? '51-100',
      primaryPathwayStageServed: formData.primaryPathwayStageServed ?? DEMO_TEAM.primaryPathwayStageServed ?? 'junior-squad',
      description: formData.description ?? '',
    }
    setTeamProfile(profile)
    completeClubCoachOnboarding()
    navigate(getDestinationAfterOnboarding('club'))
  }

  return (
    <div className="mx-auto max-w-2xl bg-bg px-4 py-6 sm:py-8 md:px-6">
      <OnboardingProgress step={step} totalSteps={STEPS} />

      {step === 1 && (
        <ClubOrgDetails
          data={formData}
          onChange={setFormData}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <ClubTeamSetup
          data={formData}
          onChange={setFormData}
          onNext={() => setStep(3)}
        />
      )}
      {step === 3 && (
        <ClubConfirmation
          profile={formData}
          onCreateTeamAccount={handleCreateTeamAccount}
          onBack={() => setStep(2)}
        />
      )}
    </div>
  )
}
