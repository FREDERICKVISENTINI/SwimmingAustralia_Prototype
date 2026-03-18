import type { ReactNode } from 'react'

type Props = {
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
}

export function DashboardSection({ title, subtitle, children, className = '' }: Props) {
  return (
    <section className={`space-y-4 ${className}`}>
      <header className="space-y-1">
        <h2 className="font-display text-lg font-semibold tracking-tight text-text-primary border-b border-accent/30 pb-2">
          {title}
        </h2>
        {subtitle && <p className="text-sm text-text-muted">{subtitle}</p>}
      </header>
      {children}
    </section>
  )
}
