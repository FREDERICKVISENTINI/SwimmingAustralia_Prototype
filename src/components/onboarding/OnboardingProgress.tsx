type OnboardingProgressProps = {
  step: number
  totalSteps: number
  className?: string
}

export function OnboardingProgress({
  step,
  totalSteps,
  className = '',
}: OnboardingProgressProps) {
  return (
    <div style={{ marginBottom: '2rem' }} className={className}>
      <div
        style={{
          display: 'flex',
          gap: '0.25rem',
          borderRadius: '9999px',
          backgroundColor: '#06294A',
          padding: '0.375rem',
        }}
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`Step ${step} of ${totalSteps}`}
      >
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            style={{
              height: '0.5rem',
              flex: 1,
              borderRadius: '9999px',
              backgroundColor: i + 1 <= step ? '#35C7F3' : '#0D3558',
            }}
          />
        ))}
      </div>
      <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#8FB2C9' }}>
        Step {step} of {totalSteps}
      </p>
    </div>
  )
}
