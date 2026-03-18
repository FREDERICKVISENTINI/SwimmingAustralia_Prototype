import { useEffect, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import type { StagePromoContent } from '../../data/pathwayStagePromo'

type Props = {
  content: StagePromoContent | null
  onBack: () => void
}

export function StageDetailPanel({ content, onBack }: Props) {
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    if (content) {
      document.body.style.overflow = 'hidden'
      const t = requestAnimationFrame(() => setEntered(true))
      return () => {
        cancelAnimationFrame(t)
        document.body.style.overflow = ''
      }
    } else {
      setEntered(false)
    }
  }, [content])

  if (!content) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-bg/80 backdrop-blur-sm"
        aria-hidden
        onClick={onBack}
      />
      <aside
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-bg-elevated shadow-2xl transition-transform duration-300 ease-out"
        style={{ transform: entered ? 'translateX(0)' : 'translateX(100%)' }}
        role="dialog"
        aria-label={`${content.title} – stage detail`}
      >
        <div className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-card hover:text-text-primary"
          >
            <ChevronLeft className="h-5 w-5" />
            Back
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-accent">
            {content.tagline}
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-text-primary">
            {content.title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            {content.description}
          </p>
          <div className="mt-6">
            <h3 className="font-display text-sm font-semibold text-text-primary">
              Why this stage matters
            </h3>
            <ul className="mt-3 space-y-2">
              {content.benefits.map((benefit, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-sm text-text-secondary"
                >
                  <span className="text-success" aria-hidden>
                    ✓
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8">
            <button
              type="button"
              className="w-full rounded-[var(--radius-button)] bg-accent px-4 py-3 text-sm font-medium text-bg transition-colors hover:bg-accent-bright"
            >
              {content.ctaLabel}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
