import type { ClubSwimmer } from '../types/club'

function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

/** Junior + competitive pathway — LTS excluded from SPARTA II recommendations. */
export function isSpartaEligible(s: ClubSwimmer): boolean {
  return s.pathwayStageId !== 'learn-to-swim' && s.attendanceStatus === 'active'
}

/**
 * Primary eligibility line. Where status is unknown (`!spartaII`), vary copy so lists
 * don’t repeat the same line — purchase still applies for all.
 */
export function spartaPrimaryLabel(s: ClubSwimmer): string {
  const sp = s.spartaII
  if (!sp) {
    const v = hashString(s.id) % 3
    if (v === 0) return 'Eligible for SPARTA II screening (as an example)'
    if (v === 1) return 'Eligible for state pathway report'
    return 'Eligible for SPARTA II & state report'
  }
  if (!sp.testCompleted) return 'SPARTA II test outstanding'
  if (!sp.reportReceived) return 'State report pending'
  return 'Up to date'
}

export function needsSpartaRecommendation(s: ClubSwimmer): boolean {
  if (!isSpartaEligible(s)) return false
  const sp = s.spartaII
  if (!sp) return true
  if (!sp.testCompleted) return true
  if (sp.testCompleted && !sp.reportReceived) return true
  return false
}
