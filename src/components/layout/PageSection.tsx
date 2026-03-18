import { type ReactNode } from 'react'

type PageSectionProps = {
  children: ReactNode
  title?: string
  /** Plain text or structured intro (e.g. multiple paragraphs). */
  subtitle?: ReactNode
  className?: string
}

export function PageSection({ children, title, subtitle, className = '' }: PageSectionProps) {
  return (
    <section className={`space-y-6 md:space-y-8 ${className}`}>
      {(title || subtitle) && (
        <header className="space-y-2">
          {title && (
            <h1 className="font-display text-2xl font-semibold tracking-tight text-text-primary md:text-3xl border-l-4 border-accent pl-4 -ml-4">
              {title}
            </h1>
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
