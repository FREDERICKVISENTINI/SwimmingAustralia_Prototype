import {
  INTENT_DEFINITIONS,
  RESULT_INTENT_LABELS,
  type AssistantResultId,
} from './assistantIntentDictionary'
import { detectActiveConcepts } from './assistantIntentMatcher'
import { normalizeAssistantQuery } from './assistantQueryNormalizer'

export type AssistantQueryResolution = {
  resultId: AssistantResultId
  intentLabel: string
  normalizedQuery: string
  score: number
  /** Winner tie-priority (lower is better). */
  tiePriority: number
  /** For debugging / future UI. */
  scoreBreakdown: { resultId: AssistantResultId; score: number; tiePriority: number }[]
}

function scoreIntent(
  active: ReturnType<typeof detectActiveConcepts>,
  def: (typeof INTENT_DEFINITIONS)[number],
): number {
  let score = 0
  for (const [gid, w] of Object.entries(def.weights)) {
    if (!w) continue
    if (active[gid as keyof typeof active]) score += w
  }
  if (def.comboBonuses) {
    for (const combo of def.comboBonuses) {
      if (combo.groups.every((g) => active[g])) score += combo.bonus
    }
  }
  return score
}

const FALLBACK_ID: AssistantResultId = 'registrations-yoy'

/**
 * Maps free text to the best predefined assistant result id using weighted concept scoring.
 */
export function resolveAssistantIntent(raw: string): AssistantQueryResolution | null {
  const normalizedQuery = normalizeAssistantQuery(raw)
  if (!normalizedQuery) return null

  const active = detectActiveConcepts(normalizedQuery)
  const breakdown: AssistantQueryResolution['scoreBreakdown'] = []

  let best: AssistantResultId = FALLBACK_ID
  let bestScore = -1
  let bestTie = 999

  for (const def of INTENT_DEFINITIONS) {
    const s = scoreIntent(active, def)
    breakdown.push({ resultId: def.resultId, score: s, tiePriority: def.tiePriority })
    if (s > bestScore || (s === bestScore && s >= 0 && def.tiePriority < bestTie)) {
      bestScore = s
      best = def.resultId
      bestTie = def.tiePriority
    }
  }

  if (bestScore < 8) {
    best = FALLBACK_ID
  }

  return {
    resultId: best,
    intentLabel: RESULT_INTENT_LABELS[best],
    normalizedQuery,
    score: bestScore,
    tiePriority: bestTie,
    scoreBreakdown: breakdown.sort((a, b) => b.score - a.score),
  }
}
