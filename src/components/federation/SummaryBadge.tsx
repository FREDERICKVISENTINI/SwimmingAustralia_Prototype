import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  variant?: 'default' | 'accent' | 'success' | 'premium'
  className?: string
}

const variants = {
  default: 'bg-border/50 text-text-secondary',
  accent: 'bg-accent/15 text-accent',
  success: 'bg-success/15 text-success',
  premium: 'bg-premium/15 text-premium',
}

export function SummaryBadge({ children, variant = 'default', className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
