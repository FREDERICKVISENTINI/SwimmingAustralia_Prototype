import { CONCEPT_GROUPS, type ConceptGroupId } from './assistantIntentDictionary'

export type ActiveConceptMap = Record<ConceptGroupId, boolean>

/** Returns which concept groups fire for the normalised query string. */
export function detectActiveConcepts(normalized: string): ActiveConceptMap {
  const padded = ` ${normalized} `
  const out = {} as ActiveConceptMap
  ;(Object.keys(CONCEPT_GROUPS) as ConceptGroupId[]).forEach((gid) => {
    const phrases = CONCEPT_GROUPS[gid]
    out[gid] = phrases.some((p) => phraseMatches(padded, normalized, p))
  })
  return out
}

function phraseMatches(padded: string, normalized: string, phrase: string): boolean {
  const t = phrase.trim().toLowerCase()
  if (!t) return false
  if (t.length <= 2 && /^[a-z0-9]+$/i.test(t)) {
    return new RegExp(`(^|[^a-z0-9])${escapeRe(t)}([^a-z0-9]|$)`, 'i').test(normalized)
  }
  if (t.includes(' ')) {
    return padded.includes(` ${t.replace(/\s+/g, ' ')} `)
  }
  return padded.includes(` ${t} `) || normalized === t
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
