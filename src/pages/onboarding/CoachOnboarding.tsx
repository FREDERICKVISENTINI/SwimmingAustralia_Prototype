import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { getDestinationAfterOnboarding } from '../../routes'
import { OnboardingProgress } from '../../components/onboarding/OnboardingProgress'
import { CoachDetails } from './CoachDetails'
import { CoachPathwayFocus } from './CoachPathwayFocus'
import { CoachConfirmation } from './CoachConfirmation'
import type { CoachProfile } from '../../context/AppContext'

const STEPS = 3

const DEMO_COACH: Partial<CoachProfile> = {
  fullName: 'Demo Coach',
  organisation: 'Demo Club',
  roleTitle: 'Squad Coach',
  state: 'NSW',
  accreditationLevel: 'Development',
  pathwayFocus: ['learn-to-swim', 'junior-squad'],
}

export function CoachOnboarding() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<Partial<CoachProfile>>(DEMO_COACH)
  const { accountType, setCoachProfile, completeClubCoachOnboarding } = useApp()
  const navigate = useNavigate()

  const handleTogglePathway = (stageId: string) => {
    setFormData((prev) => {
      const current = prev.pathwayFocus ?? []
      const next = current.includes(stageId)
        ? current.filter((id) => id !== stageId)
        : [...current, stageId]
      return { ...prev, pathwayFocus: next }
    })
  }

  const handleCreateCoachAccount = () => {
    const profile: CoachProfile = {
      fullName: formData.fullName ?? DEMO_COACH.fullName ?? 'Demo Coach',
      organisation: formData.organisation ?? DEMO_COACH.organisation ?? 'Demo Club',
      roleTitle: formData.roleTitle ?? DEMO_COACH.roleTitle ?? 'Coach',
      state: formData.state ?? DEMO_COACH.state ?? 'NSW',
      accreditationLevel: formData.accreditationLevel ?? DEMO_COACH.accreditationLevel ?? 'Development',
      pathwayFocus: (formData.pathwayFocus?.length ? formData.pathwayFocus : DEMO_COACH.pathwayFocus) ?? ['learn-to-swim'],
    }
    setCoachProfile(profile)
    completeClubCoachOnboarding()
    navigate(getDestinationAfterOnboarding(accountType ?? 'federation'))
  }

  return (
    <div className="mx-auto max-w-2xl bg-bg px-4 py-6 sm:py-8 md:px-6">
      <OnboardingProgress step={step} totalSteps={STEPS} />

      {step === 1 && (
        <CoachDetails
          data={formData}
          onChange={setFormData}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <CoachPathwayFocus
          selected={formData.pathwayFocus ?? []}
          onToggle={handleTogglePathway}
          onNext={() => setStep(3)}
        />
      )}
      {step === 3 && (
        <CoachConfirmation
          profile={formData}
          onCreateCoachAccount={handleCreateCoachAccount}
          onBack={() => setStep(2)}
        />
      )}
    </div>
  )
}
