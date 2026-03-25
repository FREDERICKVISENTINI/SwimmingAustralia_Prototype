import { Download, FileJson } from 'lucide-react'
import type { InsightAssistantResult } from '../../../data/federationInsightsAssistantMock'
import type { RecommendationAthlete } from '../../../types/insightsAssistant'

type Props = {
  result: InsightAssistantResult
  variant?: 'primary' | 'secondary'
}

function downloadBlob(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function flattenRecommendationAthletes(result: Extract<InsightAssistantResult, { kind: 'recommendation' }>): RecommendationAthlete[] {
  if (result.athleteLists?.length) {
    return result.athleteLists.flatMap((s) => s.athletes)
  }
  return result.athletes
}

function resultToCsv(result: InsightAssistantResult): string {
  if (result.kind === 'chart') {
    return `title,summary\n"${result.title.replace(/"/g, '""')}","${result.summary.replace(/"/g, '""')}"`
  }
  const athletes = flattenRecommendationAthletes(result)
  const header = 'rank,name,age,club,state,pathwayStage,signalBasis,performanceNote,rationale,signals'
  const rows = athletes.map((a, i) =>
    [
      i + 1,
      a.name,
      a.age,
      a.club,
      a.state,
      a.pathwayStage,
      a.signalBasis ?? '',
      a.performanceNote,
      a.rationale,
      a.signalTags.join('; '),
    ]
      .map((c) => `"${String(c).replace(/"/g, '""')}"`)
      .join(',')
  )
  return [header, ...rows].join('\n')
}

export function ExportResultButton({ result, variant = 'primary' }: Props) {
  const base =
    variant === 'primary'
      ? 'rounded-[var(--radius-button)] bg-accent px-4 py-2.5 text-sm font-semibold text-bg hover:bg-accent-bright'
      : 'rounded-[var(--radius-button)] border border-border bg-card px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-bg-elevated'

  const exportJson = () => {
    downloadBlob(
      `insight-${result.id}.json`,
      JSON.stringify(result, null, 2),
      'application/json'
    )
  }

  const exportCsv = () => {
    downloadBlob(`insight-${result.id}.csv`, resultToCsv(result), 'text/csv;charset=utf-8')
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={exportJson} className={`inline-flex items-center gap-2 ${base}`}>
        <FileJson className="h-4 w-4" aria-hidden />
        Export JSON
      </button>
      <button type="button" onClick={exportCsv} className={`inline-flex items-center gap-2 ${base}`}>
        <Download className="h-4 w-4" aria-hidden />
        Download CSV
      </button>
    </div>
  )
}
