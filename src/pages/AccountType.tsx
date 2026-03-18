import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import type { AccountType } from '../theme/tokens'
import { getOnboardingRouteForAccountType } from '../routes'
import { ROUTES } from '../routes'

const ACCOUNT_OPTIONS: {
  type: AccountType
  title: string
  description: string
  icon: string
}[] = [
  {
    type: 'parent',
    title: 'Member',
    description:
      'Create and manage swimmer profiles for you or your family progressing through the pathway.',
    icon: '👨‍👩‍👧',
  },
  {
    type: 'club',
    title: 'Club / Team Admin',
    description:
      'Manage swimmers, squads, and pathway progression at team level.',
    icon: '🏊',
  },
  {
    type: 'federation',
    title: 'Federation',
    description:
      'Govern and support the pathway at state and national level.',
    icon: '🏛️',
  },
]

const pageBg = {
  backgroundColor: '#031B34',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1.5rem',
  boxSizing: 'border-box' as const,
}

export function AccountTypePage() {
  const { user, setAccountType } = useApp()
  const navigate = useNavigate()

  const handleSelect = (type: AccountType) => {
    setAccountType(type)
    navigate(getOnboardingRouteForAccountType(type))
  }

  // If no user, show sign-in prompt so the page is never blank
  if (!user) {
    return (
      <div style={pageBg}>
        <div style={{ textAlign: 'center', color: '#F4F8FC', maxWidth: '24rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            Sign in first
          </h1>
          <p style={{ color: '#D7E6F2', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
            You need to sign in before choosing your account type.
          </p>
          <Link
            to={ROUTES.signIn}
            style={{
              display: 'inline-block',
              backgroundColor: '#35C7F3',
              color: '#031B34',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Go to Sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={pageBg}>
      <div style={{ width: '100%', maxWidth: '42rem', color: '#F4F8FC' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 600, color: '#F4F8FC', marginBottom: '0.5rem', textAlign: 'center' }}>
          What best describes you?
        </h1>
        <p style={{ marginBottom: '2rem', color: '#D7E6F2', textAlign: 'center' }}>
          Choose your account type to get started.
        </p>
        {ACCOUNT_OPTIONS.map(({ type, title, description, icon }) => (
          <button
            key={type}
            type="button"
            onClick={() => handleSelect(type)}
            style={{
              backgroundColor: '#0D3558',
              border: '1px solid #1D4C73',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              marginBottom: '1rem',
              textAlign: 'left',
              cursor: 'pointer',
              width: '100%',
              color: '#F4F8FC',
              display: 'block',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#35C7F3'
              e.currentTarget.style.backgroundColor = '#0F4E73'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#1D4C73'
              e.currentTarget.style.backgroundColor = '#0D3558'
            }}
          >
            <span style={{ fontSize: '1.875rem', marginRight: '1rem' }}>{icon}</span>
            <strong style={{ display: 'block', marginBottom: '0.25rem' }}>{title}</strong>
            <span style={{ fontSize: '0.875rem', color: '#D7E6F2' }}>{description}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
