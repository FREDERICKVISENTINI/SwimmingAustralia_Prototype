import { DATA_INFRASTRUCTURE_CATEGORIES } from '../../../data/dataInfrastructureCategories'
import type { DataCategoryMetaKind } from '../../../data/dataInfrastructureCategories'

export type DataCategoriesSectionProps = {
  /** When set, categories in the set stay emphasised; others are dimmed. When null, all categories look equal. */
  highlightedCategoryIds?: ReadonlySet<string> | null
  /** Opens the flow diagram modal for this category. */
  onCategoryClick?: (categoryId: string) => void
  /** Category whose diagram is open (visual ring). */
  selectedCategoryId?: string | null
}

const META_LABEL: Record<DataCategoryMetaKind, string> = {
  derived: 'Derived',
  live: 'Live input',
  system: 'System generated',
}

const META_STYLE: Record<DataCategoryMetaKind, string> = {
  derived: 'border-premium/30 bg-premium/8 text-premium',
  live: 'border-accent/30 bg-accent/10 text-accent',
  system: 'border-border/80 bg-bg-elevated text-text-muted',
}

const CATEGORY_CARD_BASE =
  'flex h-full min-h-[17rem] flex-col rounded-[var(--radius-card)] border bg-card p-5 shadow-[var(--shadow-card)] transition-all duration-300 ease-out xl:min-h-[18rem]'

const CATEGORY_CARD_NEUTRAL =
  'border-border/80 hover:-translate-y-0.5 hover:border-border hover:shadow-md cursor-pointer'

const CATEGORY_CARD_HIGHLIGHT =
  'border-accent/45 shadow-md ring-2 ring-accent/30 hover:-translate-y-0.5 hover:border-accent/55 hover:shadow-md cursor-pointer'

const CATEGORY_CARD_DIM =
  'border-border/50 opacity-[0.42] saturate-[0.85] hover:opacity-55 hover:saturate-100 cursor-pointer'

const CATEGORY_CARD_DIAGRAM_OPEN =
  'ring-2 ring-premium/40 border-premium/35 shadow-md'

export function DataCategoriesSection({
  highlightedCategoryIds = null,
  onCategoryClick,
  selectedCategoryId = null,
}: DataCategoriesSectionProps) {
  const filterActive = highlightedCategoryIds != null && highlightedCategoryIds.size > 0

  return (
    <section className="space-y-6 md:space-y-8">
      <div className="max-w-3xl space-y-2">
        <h2 className="font-display text-xl font-semibold tracking-tight text-text-primary md:text-2xl">Data categories</h2>
        <p className="text-sm leading-relaxed text-text-secondary">
          Structured capture across the federation platform — key fields and upstream sources at a glance.{' '}
          <span className="text-text-muted">Click a category to see how it connects to system flows.</span>
        </p>
      </div>

      <div className="grid auto-rows-fr gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3 xl:gap-6">
        {DATA_INFRASTRUCTURE_CATEGORIES.map((cat) => {
          const isMatch = highlightedCategoryIds?.has(cat.id) ?? false
          const diagramOpen = selectedCategoryId === cat.id
          const cardTone = filterActive
            ? isMatch
              ? CATEGORY_CARD_HIGHLIGHT
              : CATEGORY_CARD_DIM
            : CATEGORY_CARD_NEUTRAL

          return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onCategoryClick?.(cat.id)}
            className={`${CATEGORY_CARD_BASE} ${cardTone} text-left ${diagramOpen ? CATEGORY_CARD_DIAGRAM_OPEN : ''}`}
            data-flow-linked={filterActive && isMatch ? 'true' : undefined}
            aria-label={`${cat.title}. View linked data flows.`}
          >
            <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-2">
              <h3 className="min-w-0 flex-1 font-display text-[0.9375rem] font-semibold leading-snug tracking-tight text-text-primary">
                {cat.title}
              </h3>
              {cat.meta && cat.meta.length > 0 && (
                <div className="flex max-w-full flex-wrap justify-end gap-1.5">
                  {cat.meta.map((m) => (
                    <span
                      key={m}
                      className={`shrink-0 rounded-full border px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide ${META_STYLE[m]}`}
                    >
                      {META_LABEL[m]}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <p className="mt-4 text-[0.65rem] font-semibold uppercase tracking-wider text-text-muted">Key data captured</p>
            <ul className="mt-2.5 flex flex-wrap gap-2">
              {cat.keyDataCaptured.map((field) => (
                <li
                  key={field}
                  className="rounded-md border border-border/60 bg-bg-elevated/80 px-2.5 py-1.5 text-[0.7rem] leading-snug text-text-primary"
                >
                  {field}
                </li>
              ))}
            </ul>

            <div className="mt-auto border-t border-border/40 pt-5">
              <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-text-muted">Source</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {cat.sources.map((src) => (
                  <span
                    key={src}
                    className="inline-flex items-center rounded-full border border-accent/25 bg-accent/5 px-2.5 py-1 text-[0.7rem] font-medium leading-snug text-accent"
                  >
                    {src}
                  </span>
                ))}
              </div>
            </div>
          </button>
          )
        })}
      </div>
    </section>
  )
}
