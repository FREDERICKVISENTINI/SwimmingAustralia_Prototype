import type { InsightRecommendationAssistantResult } from '../../../data/federationInsightsAssistantMock'
import { DynamicChartRenderer } from './DynamicChartRenderer'
import { AthleteRecommendationCard } from './AthleteRecommendationCard'
import { AssistantAthleteListTable } from './AssistantAthleteListTable'
import { ExportResultButton } from './ExportResultButton'

type Props = { result: InsightRecommendationAssistantResult }

export function AssistantRecommendationResult({ result }: Props) {
  const hasSplitLists = Boolean(result.athleteLists?.length)

  return (
    <div className="space-y-6">
      <div className="rounded-[var(--radius-card)] border border-border/80 bg-card p-5 shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-3xl">
            <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-premium">Recommendation</p>
            <h2 className="mt-1 font-display text-xl font-semibold text-text-primary">{result.title}</h2>
            {result.matchHint && (
              <p className="mt-2 border-l-2 border-accent/40 pl-2 text-xs text-text-muted">{result.matchHint}</p>
            )}
            <p className="mt-2 text-sm text-text-secondary">{result.summary}</p>
            <p className="mt-3 rounded-lg border border-border/60 bg-bg-elevated/50 px-3 py-2 text-xs leading-relaxed text-text-muted">
              {result.methodologyLine}
            </p>
            {result.athleteListPreset === 'retention' && (
              <p className="mt-2 text-xs italic text-text-muted">
                Two columns on purpose: risk/engagement signals vs recent results. In a live system the same athletes would appear on both sides, joined by id — the mock uses separate generated rows for volume.
              </p>
            )}
          </div>
          <ExportResultButton result={result} variant="secondary" />
        </div>
      </div>

      {hasSplitLists ? (
        <div className="space-y-8">
          {result.athleteLists!.map((section) => (
            <section key={section.id} className="space-y-3">
              <div>
                <h3 className="font-display text-sm font-semibold text-text-primary">{section.label}</h3>
                <p className="text-xs text-text-muted">
                  {section.description ??
                    (section.basis === 'hp'
                      ? 'Screening and HP programme signals — distinct from raw meet timings.'
                      : section.basis === 'meet'
                        ? 'Unified meet results and ranking movement — distinct from SPARTA / HP screening.'
                        : '')}
                </p>
              </div>
              <AssistantAthleteListTable athletes={section.athletes} startRank={1} />
            </section>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {result.athletes.map((a, i) => (
            <AthleteRecommendationCard key={a.id} athlete={a} rank={i + 1} />
          ))}
        </div>
      )}

      {result.supportChart ? (
        <div className="rounded-[var(--radius-card)] border border-border/80 bg-card p-5 shadow-[var(--shadow-card)]">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Supporting view</p>
          <DynamicChartRenderer payload={result.supportChart} />
        </div>
      ) : null}
    </div>
  )
}
