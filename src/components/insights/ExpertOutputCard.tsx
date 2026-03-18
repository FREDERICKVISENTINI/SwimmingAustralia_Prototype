import type { ExpertOutputItem } from '../../types/insights'

type Props = { item: ExpertOutputItem }

const TYPE_LABELS: Record<ExpertOutputItem['type'], string> = {
  assessment: 'Assessment',
  technique: 'Technique',
  biomechanics: 'Biomechanics',
  'race-analysis': 'Race analysis',
}

const IS_PREMIUM = (t: ExpertOutputItem['type']) =>
  t === 'biomechanics' || t === 'race-analysis'

export function ExpertOutputCard({ item }: Props) {
  const premium = IS_PREMIUM(item.type)

  return (
    <article
      className={`rounded-[var(--radius-card)] border p-4 shadow-[var(--shadow-card)] ${
        premium ? 'border-premium/40 ring-1 ring-premium/10' : 'border-border'
      } bg-card`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h4 className="font-display font-semibold text-text-primary">{item.title}</h4>
        <span
          className={`rounded-md px-2 py-0.5 text-xs ${
            premium ? 'bg-premium/20 text-premium' : 'bg-bg-elevated text-text-muted'
          }`}
        >
          {TYPE_LABELS[item.type]}
        </span>
      </div>
      <p className="mt-2 text-sm text-text-secondary">{item.summary}</p>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted">
        <span>{item.date}</span>
        <span>{item.source}</span>
      </div>
    </article>
  )
}
