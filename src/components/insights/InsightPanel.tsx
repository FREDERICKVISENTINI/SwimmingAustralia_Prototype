import type { ReactNode } from 'react'

type Props = {
  id: string
  children: ReactNode
  className?: string
}

export function InsightPanel({ id, children, className = '' }: Props) {
  return (
    <div
      id={id}
      role="tabpanel"
      aria-labelledby={`tab-${id}`}
      className={`pt-6 ${className}`}
    >
      {children}
    </div>
  )
}
