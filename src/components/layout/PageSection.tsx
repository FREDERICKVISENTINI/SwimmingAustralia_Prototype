import { type ReactNode } from 'react'

type PageSectionProps = {
  children: ReactNode
  title?: string
  /** Plain text or structured intro (e.g. multiple paragraphs). */
  subtitle?: ReactNode
  /** Optional element rendered in the top-right of the title row (e.g. an action button). */
  headerAction?: ReactNode
  className?: string
}

export function PageSection({ children, title, subtitle, headerAction, className = '' }: PageSectionProps) {
  return (
    <section className={`space-y-6 md:space-y-8 ${className}`}>
      {(title || subtitle || headerAction) && (
        <header className="space-y-2">
          {(title || headerAction) && (
            <div className="flex items-center justify-between gap-4">
              {title && (
                <h1 className="font-display text-2xl font-semibold tracking-tight text-text-primary md:text-3xl border-l-4 border-accent pl-4 -ml-4">
                  {title}
                </h1>
              )}
              {headerAction && <div className="shrink-0">{headerAction}</div>}
            </div>
          )}
          {subtitle != null && subtitle !== '' && (
            <div className="text-text-secondary text-[0.95rem] max-w-3xl space-y-3 [&_ul]:text-[0.9rem] [&_li]:marker:text-accent/60">
              {typeof subtitle === 'string' ? <p>{subtitle}</p> : subtitle}
            </div>
          )}
        </header>
      )}
      {children}
    </section>
  )
}
