/**
 * Normalises free-text assistant queries for deterministic intent matching.
 * Not NLP — pattern cleanup + canonical tokens for synonym clustering.
 */

/** Collapse runs of whitespace. */
function collapseSpaces(s: string): string {
  return s.replace(/\s+/g, ' ').trim()
}

/**
 * Replace common variants with canonical tokens so downstream matching is consistent.
 * Order matters: longer / more specific patterns first.
 */
const CANONICAL_REPLACEMENTS: [RegExp, string][] = [
  [/year[\s-]*on[\s-]*year|yearly[\s-]*comparison|annual[\s-]*comparison|compare[\s-]*years|this[\s-]*year[\s-]*vs[\s-]*last[\s-]*year/gi, ' yoy '],
  [/\byoy\b/gi, ' yoy '],
  [/over[\s-]*time|across[\s-]*years|over[\s-]*years|by[\s-]*year|fiscal[\s-]*year|fy\d{2}/gi, ' time_trend '],
  [/drop[\s-]*off|dropoff|drop[\s-]*outs?|losing[\s-]*swimmers|losing[\s-]*athletes|attrition|churn/gi, ' dropout '],
  [/learn[\s-]*to[\s-]*swim|lts/gi, ' lts '],
  [/high[\s-]*performance|\bhp\b(?!tools)/gi, ' hp '],
  [/sparta[\s-]*ii|sparta2/gi, ' sparta '],
  [/self[\s-]*fund(?:ing)?|moneti[sz]ation|moneti[sz]e/gi, ' revenue '],
  [/sign[\s-]*ups?|signups?|registration|registrations/gi, ' registrations '],
  [/swimmers?|athletes?|kids?/gi, ' athletes '],
  [/trending[\s-]*up|upward|improv(?:ing|ement)?|coming[\s-]*through|doing[\s-]*best|swimming[\s-]*well/gi, ' emerging '],
  [/worthy|worth[\s-]*sponsor|shortlist|candidates?|prospects?|commercial[\s-]*athlete|partner[\s-]*review/gi, ' sponsor_pick '],
  [/queensland|\bqld\b/gi, ' qld '],
  [/\bnsw\b|new[\s-]*south[\s-]*wales/gi, ' nsw '],
  [/\bvic\b|victoria/gi, ' vic '],
  [/\bwa\b|western[\s-]*australia/gi, ' wa '],
  [/\bsa\b|south[\s-]*australia/gi, ' sa '],
  [/\btas\b|tasmania/gi, ' tas '],
  [/\bnt\b|northern[\s-]*territory/gi, ' nt '],
  [/\bact\b|australian[\s-]*capital/gi, ' act '],
]

/** Strip punctuation that rarely carries intent; keep word boundaries. */
function stripNoise(s: string): string {
  return s.replace(/["""''`,.;:!?()[\]{}]/g, ' ')
}

/**
 * Returns a lowercase, whitespace-normalised string with canonical tokens inserted.
 */
export function normalizeAssistantQuery(raw: string): string {
  let s = raw.trim().toLowerCase()
  if (!s) return ''
  s = stripNoise(s)
  s = s.replace(/-/g, ' ')
  s = collapseSpaces(s)
  for (const [re, token] of CANONICAL_REPLACEMENTS) {
    s = s.replace(re, token)
  }
  s = collapseSpaces(s)
  return s
}

/** Plural/singular light normalisation for trailing s on common roots. */
export function tokenizeForMatch(normalized: string): string[] {
  return normalized.split(/\s+/).filter(Boolean)
}
