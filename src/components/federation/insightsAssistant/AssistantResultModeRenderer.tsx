import type { InsightAssistantResult } from '../../../data/federationInsightsAssistantMock'
import { InsightResultCard } from './InsightResultCard'
import { AssistantRecommendationResult } from './AssistantRecommendationResult'

type Props = { result: InsightAssistantResult }

export function AssistantResultModeRenderer({ result }: Props) {
  if (result.kind === 'chart') {
    return <InsightResultCard result={result} />
  }
  return <AssistantRecommendationResult result={result} />
}
