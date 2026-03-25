import type { InsightChartAssistantResult } from '../../../data/federationInsightsAssistantMock'
import { DynamicChartRenderer } from './DynamicChartRenderer'
import { InsightSummary } from './InsightSummary'
import { ExportResultButton } from './ExportResultButton'

type Props = { result: InsightChartAssistantResult }

export function InsightResultCard({ result }: Props) {
  return (
    <div className="rounded-[var(--radius-card)] border border-border/80 bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-accent">Analytics</p>
          <h2 className="mt-1 font-display text-lg font-semibold text-text-primary">{result.title}</h2>
          {result.matchHint && (
            <p className="mt-2 border-l-2 border-accent/40 pl-2 text-xs text-text-muted">{result.matchHint}</p>
          )}
        </div>
        <ExportResultButton result={result} variant="secondary" />
      </div>
      <div className="mb-4">
        <DynamicChartRenderer payload={result.chart} />
      </div>
      <InsightSummary>{result.summary}</InsightSummary>
    </div>
  )
}
