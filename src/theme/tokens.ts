export const colors = {
  bg: '#031B34',
  bgElevated: '#06294A',
  card: '#0D3558',
  border: '#1D4C73',

  textPrimary: '#F4F8FC',
  textSecondary: '#D7E6F2',
  textMuted: '#8FB2C9',

  accent: '#35C7F3',
  accentBright: '#55D6FF',
  success: '#43E0D0',
  successSoft: '#7CE9DE',

  premium: '#D89A3D',
  premiumBright: '#E7AE52',
} as const

export type AccountType = 'parent' | 'club' | 'federation'

export const PATHWAY_STAGES = [
  {
    id: 'recreation',
    label: 'Recreation',
    description: 'Casual swimming, fitness, and water-based activity without competition focus.',
  },
  {
    id: 'learn-to-swim',
    label: 'Learn-to-Swim',
    description: 'Building water confidence and foundational skills.',
  },
  {
    id: 'junior-squad',
    label: 'Junior Squad',
    description: 'Developing technique and stamina in a squad environment.',
  },
  {
    id: 'competitive-club',
    label: 'Competitive Club',
    description: 'Racing at club level and building competitive experience.',
  },
  {
    id: 'state-pathway',
    label: 'State Pathway',
    description: 'State representation and pathway programs.',
  },
  {
    id: 'elite',
    label: 'Elite',
    description: 'National representation and high-performance.',
  },
] as const
