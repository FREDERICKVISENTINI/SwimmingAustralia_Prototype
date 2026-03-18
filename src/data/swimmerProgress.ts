/**
 * Progression timeline and milestone badges for swimmer profile.
 * Demo data keyed by swimmer id; in a real app this would come from the backend.
 */
import type { SwimmerProfile } from '../types'
import type { ProgressionEvent, MilestoneBadge } from '../types/progress'
import { PATHWAY_STAGES } from '../theme/tokens'

/** Demo progression events per swimmer (newest first for display). */
const DEMO_TIMELINE: Record<string, ProgressionEvent[]> = {
  'demo-fred': [
    { date: '2026-03-07', label: 'PB in 50m Free at Club Night', type: 'pb' },
    { date: '2026-03-07', label: 'City Dolphins Club Night — 50m Free & 100m Back', type: 'first-race' },
    { date: '2024-06-01', label: 'Moved to Junior Squad', type: 'stage', stageId: 'junior-squad' },
    { date: '2024-02-15', label: 'First club time trial', type: 'assessment' },
    { date: '2022-09-01', label: 'Joined Learn-to-Swim at City Dolphins', type: 'joined' },
  ],
  'demo-emma': [
    { date: '2026-03-18', label: 'Water Confidence & Stage Assessment', type: 'assessment' },
    { date: '2024-08-01', label: 'Started Learn-to-Swim', type: 'joined' },
  ],
}

/** Demo milestone badges per swimmer. */
const DEMO_BADGES: Record<string, MilestoneBadge[]> = {
  'demo-fred': [
    { id: 'first-race', label: 'First race', description: 'First competition', earnedAt: '2026-03-07' },
    { id: 'pb-season', label: 'PB this season', description: 'Personal best in 50m Free', earnedAt: '2026-03-07' },
    { id: 'stage-junior', label: 'Junior Squad', description: 'Advanced to squad', earnedAt: '2024-06-01' },
    { id: 'stage-lts', label: 'Learn-to-Swim', description: 'Completed foundation', earnedAt: '2022-09-01' },
  ],
  'demo-emma': [
    { id: 'stage-lts', label: 'Learn-to-Swim', description: 'Building water confidence', earnedAt: '2024-08-01' },
    { id: 'assessment', label: 'First assessment', description: 'Stage assessment booked', earnedAt: '2026-03-18' },
  ],
}

/**
 * Returns progression timeline for the given swimmer (newest first).
 * Uses demo data when available; otherwise builds a minimal timeline from profile.
 */
export function getProgressionTimeline(profile: SwimmerProfile | null): ProgressionEvent[] {
  if (!profile) return []
  const demo = DEMO_TIMELINE[profile.id]
  if (demo?.length) return [...demo].sort((a, b) => b.date.localeCompare(a.date))

  const events: ProgressionEvent[] = []
  const stage = PATHWAY_STAGES.find((s) => s.id === profile.pathwayStage)
  if (profile.program) {
    events.push({
      date: profile.dateOfBirth ? profile.dateOfBirth.slice(0, 4) + '-01-01' : new Date().toISOString().slice(0, 10),
      label: `Joined ${profile.program}`,
      type: 'joined',
    })
  }
  if (stage) {
    events.push({
      date: new Date().toISOString().slice(0, 10),
      label: `Current stage: ${stage.label}`,
      type: 'stage',
      stageId: stage.id,
    })
  }
  return events.sort((a, b) => b.date.localeCompare(a.date))
}

/**
 * Returns milestone badges for the given swimmer.
 */
export function getMilestoneBadges(profile: SwimmerProfile | null): MilestoneBadge[] {
  if (!profile) return []
  const demo = DEMO_BADGES[profile.id]
  if (demo?.length) return demo

  const stage = PATHWAY_STAGES.find((s) => s.id === profile.pathwayStage)
  if (!stage) return []
  return [
    {
      id: 'current-stage',
      label: stage.label,
      description: 'Current pathway stage',
    },
  ]
}
