import { type ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
  variant?: 'default' | 'premium' | 'dashed'
}

export function Card({ children, className = '', variant = 'default' }: CardProps) {
  const base =
    'rounded-[var(--radius-card)] border bg-card p-5 md:p-6 text-text-primary shadow-[var(--shadow-card)] border-border/80 transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)]'
  const premium = variant === 'premium' ? 'border-premium/50 ring-1 ring-premium/20' : ''
  const dashed = variant === 'dashed' ? 'border-dashed opacity-90 hover:shadow-[var(--shadow-card)]' : ''
  return <div className={`${base} ${premium} ${dashed} ${className}`}>{children}</div>
}
