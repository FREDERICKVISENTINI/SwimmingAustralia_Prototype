/** Federation Insights Assistant — shared types (mock + UI). */

export type RecommendationAthlete = {
  id: string
  name: string
  age: number
  club: string
  state: string
  pathwayStage: string
  performanceNote: string
  rationale: string
  signalTags: string[]
  /**
   * List column: talent shortlists use HP vs meet; retention-risk uses risk vs results
   * (same athlete appears on both sides in a real model — mock lists are illustrative).
   */
  signalBasis?: 'hp' | 'meet' | 'risk' | 'results'
}
