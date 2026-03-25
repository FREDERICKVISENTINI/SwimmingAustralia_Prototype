import type { RecommendationAthlete } from '../types/insightsAssistant'

const FIRST = [
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Mia', 'Lucas', 'Zara', 'Jack',
  'Sophie', 'Henry', 'Isla', 'Oscar', 'Chloe', 'George', 'Evie', 'Archie', 'Florence', 'Arthur',
  'Ruby', 'Alfie', 'Daisy', 'Theo', 'Millie', 'James', 'Grace', 'Leo', 'Hannah', 'Felix',
  'Sienna', 'Riley', 'Matilda', 'Caleb', 'Layla', 'Hugo', 'Poppy', 'Jasper', 'Nina', 'Marcus',
]
const LAST = [
  'Chen', "O'Brien", 'Williams', 'Taylor', 'Singh', 'Kumar', 'Nguyen', 'Patel', 'Brown', 'Wilson',
  'Lee', 'Martin', 'Thompson', 'Garcia', 'Clark', 'Lewis', 'Walker', 'Hall', 'Allen', 'Young',
  'King', 'Wright', 'Scott', 'Green', 'Smith', 'Baker', 'Adams', 'Nelson', 'Hill', 'Campbell',
  'Murphy', 'Kelly', 'Reid', 'Walsh', 'Dunn', 'Hayes', 'Ford', 'West', 'Lane', 'Brooks',
]
const CLUBS = [
  'SOPAC', 'Melbourne Vicentre', 'Chandler', 'Nunawading', 'West Coast', 'St Peters', 'Rackley',
  'Brisbane Grammar', 'Carlile', 'USC Spartans', 'Miami', 'TSS', 'CBC', 'Norwood', 'Leichhardt',
  'Trinity Grammar', 'Kareela', 'Manly', 'Scarborough', 'Tasman',
]
const STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'] as const
const STAGES = [
  'Learn-to-swim', 'Junior squad', 'Competitive club', 'State pathway', 'National age',
]

/** Column type for split-list demos: talent (HP vs meet) or retention (risk vs results). */
export type GeneratorColumn = 'hp' | 'meet' | 'risk' | 'results'

function prng(seed: string): () => number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    return (h >>> 0) / 0xffffffff
  }
}

function pick<T>(arr: readonly T[], rnd: () => number): T {
  return arr[Math.floor(rnd() * arr.length)]!
}

/**
 * Deterministic mock athletes for assistant shortlist demos.
 * `column`: HP screening vs meet feed for talent lists; risk vs results for retention-risk.
 */
export function generateAssistantAthleteList(
  count: number,
  column: GeneratorColumn,
  seedSlug: string,
): RecommendationAthlete[] {
  const out: RecommendationAthlete[] = []
  for (let i = 0; i < count; i++) {
    const rnd = prng(`${seedSlug}-${column}-${i}`)
    const first = pick(FIRST, rnd)
    const last = pick(LAST, rnd)
    const state = pick(STATES, rnd)
    const club = pick(CLUBS, rnd)
    const pathwayStage = pick(STAGES, rnd)
    const age = 10 + Math.floor(rnd() * 8)

    const id = `${seedSlug}-${column}-${i}`

    if (column === 'hp') {
      const composite = (60 + rnd() * 40).toFixed(1)
      const q = 1 + Math.floor(rnd() * 4)
      const note = `SPARTA II / HP screen: composite ${composite} · coach flag Q${q} · screening ${rnd() > 0.35 ? 'pass+' : 'review'}`
      const rationale =
        'HP pipeline: screening composite + coach observation flags vs national benchmarks (prototype aggregate).'
      const tags = [
        rnd() > 0.5 ? 'SPARTA signal' : 'HP coach flag',
        rnd() > 0.6 ? 'Benchmark proximity' : 'Screening cohort',
        state,
      ]
      out.push({
        id,
        name: `${first} ${last}`,
        age,
        club,
        state,
        pathwayStage,
        performanceNote: note,
        rationale,
        signalTags: tags,
        signalBasis: 'hp',
      })
    } else if (column === 'meet') {
      const dist = 50 + Math.floor(rnd() * 450)
      const evt = rnd() > 0.5 ? 'free' : 'back'
      const time = (22 + rnd() * 40).toFixed(2)
      const meet = rnd() > 0.5 ? 'state' : 'national'
      const note = `${dist}m ${evt} ${time}s · ${meet} meet · rank move ${rnd() > 0.4 ? '+' : ''}${Math.floor(rnd() * 12)} vs last season`
      const rationale =
        'Meet results feed: unified timing database + meet tier weighting — independent from HP screening (prototype).'
      const tags = [
        rnd() > 0.55 ? 'PB trend' : 'Meet depth',
        'Results',
        meet === 'national' ? 'National tier' : 'State tier',
      ]
      out.push({
        id,
        name: `${first} ${last}`,
        age,
        club,
        state,
        pathwayStage,
        performanceNote: note,
        rationale,
        signalTags: tags,
        signalBasis: 'meet',
      })
    } else if (column === 'risk') {
      const patterns = [
        () => `Squad attendance ${(78 + rnd() * 18).toFixed(0)}% of 90d avg · downward 8w trend`,
        () => `Parent payment stress flag (platform) · ${rnd() > 0.5 ? 'partial' : 'late'} · medal form still`,
        () => `Engagement index ↓ vs cohort · squad session skips ${2 + Math.floor(rnd() * 5)}`,
        () => `Coach note: “consider check-in” · operational load ${rnd() > 0.6 ? 'high' : 'elevated'}`,
        () => `Club travel / logistics friction flagged · still competing`,
      ]
      const note = pick(patterns, rnd)()
      const rationale =
        'Risk layer: engagement, attendance, payments, or ops signals — prototype rows are illustrative, not matched 1:1 to the results column.'
      const tags = [
        rnd() > 0.45 ? 'Attendance' : 'Engagement',
        rnd() > 0.6 ? 'Payment signal' : 'Ops flag',
        'Retention risk',
      ]
      out.push({
        id,
        name: `${first} ${last}`,
        age,
        club,
        state,
        pathwayStage,
        performanceNote: note,
        rationale,
        signalTags: tags,
        signalBasis: 'risk',
      })
    } else {
      const dist = 50 + Math.floor(rnd() * 400)
      const evt = rnd() > 0.5 ? 'free' : 'IM'
      const time = (22 + rnd() * 35).toFixed(2)
      const tier = rnd() > 0.55 ? 'Top-quartile' : 'Top-half'
      const note = `${dist}m ${evt} ${time}s · ${tier} vs age cohort · medals / finals in last ${2 + Math.floor(rnd() * 3)} meets`
      const rationale =
        'Results layer: same “strong performance” arm used in the intersection model — contrast with risk signals (prototype).'
      const tags = [
        tier,
        rnd() > 0.5 ? 'PB stack' : 'Finals depth',
        'Results',
      ]
      out.push({
        id,
        name: `${first} ${last}`,
        age,
        club,
        state,
        pathwayStage,
        performanceNote: note,
        rationale,
        signalTags: tags,
        signalBasis: 'results',
      })
    }
  }
  return out
}
