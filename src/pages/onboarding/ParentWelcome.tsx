type Props = {
  onNext: () => void
}

const cardStyle = {
  backgroundColor: '#0D3558',
  border: '1px solid #1D4C73',
  borderRadius: '0.75rem',
  padding: '1.5rem',
  color: '#F4F8FC',
}

export function ParentWelcome({ onNext }: Props) {
  return (
    <div style={cardStyle}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', color: '#F4F8FC' }}>
        Create your swimmer&apos;s pathway profile
      </h2>
      <p style={{ color: '#D7E6F2', marginBottom: '1.5rem', lineHeight: 1.5 }}>
        The platform helps you understand your child&apos;s development and progression through swimming—from learn-to-swim through to the national pathway.
      </p>
      <button
        type="button"
        onClick={onNext}
        style={{
          backgroundColor: '#35C7F3',
          color: '#031B34',
          border: 'none',
          borderRadius: '0.5rem',
          padding: '0.625rem 1rem',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Get started
      </button>
    </div>
  )
}
