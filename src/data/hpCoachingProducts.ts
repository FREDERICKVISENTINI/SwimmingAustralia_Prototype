/**
 * High-performance products & services a club can surface to coaching staff.
 * “Push to coaching services” makes these visible in coach workflows (prototype).
 */
export type HpCoachingProduct = {
  id: string
  title: string
  shortLabel: string
  description: string
  category: 'analysis' | 'development' | 'wellbeing' | 'pathway'
}

export const HP_COACHING_PRODUCTS: HpCoachingProduct[] = [
  {
    id: 'hp-1',
    title: 'Underwater video & biomechanics review',
    shortLabel: 'Video analysis',
    description:
      'Session capture with stroke-by-stroke feedback. Coaches receive a structured report aligned to national technical benchmarks.',
    category: 'analysis',
  },
  {
    id: 'hp-2',
    title: 'Race-pace & lactate profiling',
    shortLabel: 'Physiology testing',
    description:
      'Scheduled testing blocks with interpretation notes for squad coaches to plug into weekly programming.',
    category: 'analysis',
  },
  {
    id: 'hp-3',
    title: 'Talent identification workshop (club)',
    shortLabel: 'Talent ID',
    description:
      'Half-day workshop: observation frameworks, flagging athletes for pathway conversations, and documentation templates.',
    category: 'pathway',
  },
  {
    id: 'hp-4',
    title: 'Mental performance coaching (group)',
    shortLabel: 'Mental skills',
    description:
      'Four-week block for competitive squads: pre-race routines, focus under pressure, and recovery habits.',
    category: 'wellbeing',
  },
  {
    id: 'hp-6',
    title: 'Starts, turns & underwater speed clinic',
    shortLabel: 'Technical clinic',
    description:
      'Delivered with HP-accredited coaches; video checkpoints and drill progressions shared to your squad leads.',
    category: 'development',
  },
]

/** Demo: a couple of products pre-pushed for club demo account */
export const DEMO_HP_COACHING_PUSHED_IDS = ['hp-1', 'hp-3'] as const

const validHpProductIds = new Set(HP_COACHING_PRODUCTS.map((p) => p.id))

/** Drops IDs that are no longer in the catalog (e.g. retired products). */
export function filterValidHpCoachingPushedIds(ids: string[] | undefined): string[] {
  if (!ids?.length) return []
  return ids.filter((id) => validHpProductIds.has(id))
}
