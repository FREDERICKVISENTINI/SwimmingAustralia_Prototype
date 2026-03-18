import type { ReactNode } from 'react'

export type BadgeVariant = 'accent' | 'success' | 'muted' | 'premium'

type BadgeProps = {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  accent: 'bg-accent/15 text-accent',
  success: 'bg-success/15 text-success',
  muted: 'bg-border/50 text-text-muted',
  premium: 'bg-premium/15 text-premium',
}

export function Badge({ children, variant = 'accent', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
