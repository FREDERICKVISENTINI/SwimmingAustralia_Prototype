import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { ROUTES } from '../../routes'
import { OnboardingProgress } from '../../components/onboarding/OnboardingProgress'
import { ParentWelcome } from './ParentWelcome'
import { ParentSwimmerDetails } from './ParentSwimmerDetails'
import { ParentPathwayStage } from './ParentPathwayStage'
import { ParentConfirmation } from './ParentConfirmation'
import type { SwimmerProfile } from '../../context/AppContext'

const STEPS = 4

const DEMO_SWIMMER: Partial<SwimmerProfile> = {
  firstName: 'Demo',
  lastName: 'Swimmer',
  dateOfBirth: '2015-06-01',
  gender: 'Other',
  program: 'Demo Club',
  state: 'NSW',
  notes: '',
  pathwayStage: 'learn-to-swim',
  memberId: 'AUS-2025-001',
}

const pageStyle = {
  backgroundColor: '#031B34',
  minHeight: '100vh',
  padding: '1.5rem',
  margin: '0 auto',
  maxWidth: '42rem',
  boxSizing: 'border-box' as const,
}

export function ParentOnboarding() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<Partial<SwimmerProfile>>(DEMO_SWIMMER)
  const { user, accountType, addSwimmer, completeParentOnboarding } = useApp()
  const navigate = useNavigate()

  if (!user) {
    return (
      <div style={pageStyle}>
        <div style={{ textAlign: 'center', color: '#F4F8FC' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Sign in first</h1>
          <p style={{ color: '#D7E6F2', marginBottom: '1.5rem' }}>You need to sign in before creating a swimmer profile.</p>
          <Link to={ROUTES.signIn} style={{ color: '#35C7F3', fontWeight: 600 }}>Go to Sign in</Link>
        </div>
      </div>
    )
  }
  if (accountType !== 'parent') {
    return (
      <div style={pageStyle}>
        <div style={{ textAlign: 'center', color: '#F4F8FC' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Wrong account type</h1>
          <p style={{ color: '#D7E6F2', marginBottom: '1.5rem' }}>This flow is for members. Choose your account type first.</p>
          <Link to={ROUTES.accountType} style={{ color: '#35C7F3', fontWeight: 600 }}>Choose account type</Link>
        </div>
      </div>
    )
  }

  const handleCreateProfile = () => {
    const profile: Omit<SwimmerProfile, 'id'> = {
      firstName: formData.firstName ?? DEMO_SWIMMER.firstName ?? 'Demo',
      lastName: formData.lastName ?? DEMO_SWIMMER.lastName ?? 'Swimmer',
      dateOfBirth: formData.dateOfBirth ?? DEMO_SWIMMER.dateOfBirth ?? '2015-06-01',
      gender: formData.gender ?? DEMO_SWIMMER.gender ?? 'Other',
      program: formData.program ?? DEMO_SWIMMER.program ?? 'Demo Club',
      state: formData.state ?? DEMO_SWIMMER.state ?? 'NSW',
      notes: formData.notes ?? '',
      pathwayStage: formData.pathwayStage ?? DEMO_SWIMMER.pathwayStage ?? 'learn-to-swim',
      memberId: formData.memberId ?? DEMO_SWIMMER.memberId ?? 'AUS-2025-001',
    }
    addSwimmer(profile)
    completeParentOnboarding()
    navigate(ROUTES.app.profile)
  }

  return (
    <div style={pageStyle}>
      <OnboardingProgress step={step} totalSteps={STEPS} />
      {step === 1 && <ParentWelcome onNext={() => setStep(2)} />}
      {step === 2 && (
        <ParentSwimmerDetails data={formData} onChange={setFormData} onNext={() => setStep(3)} />
      )}
      {step === 3 && (
        <ParentPathwayStage
          selected={formData.pathwayStage ?? ''}
          onSelect={(pathwayStage) => setFormData((p) => ({ ...p, pathwayStage }))}
          onNext={() => setStep(4)}
        />
      )}
      {step === 4 && (
        <ParentConfirmation
          profile={formData as SwimmerProfile}
          onCreateProfile={handleCreateProfile}
          onBack={() => setStep(3)}
        />
      )}
    </div>
  )
}
