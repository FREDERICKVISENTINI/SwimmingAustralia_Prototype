/**
 * Shared tier matrix for Plans page and Insights (parent: Free vs Family Premium only).
 */

export type TierFeatureRow = {
  label: string
  free: boolean
  premium: boolean
  clubPro: boolean
}

export const TIER_FEATURES: TierFeatureRow[] = [
  { label: 'National benchmarking (pathway cohorts)', free: false, premium: true, clubPro: true },
  { label: 'Performance & pathway insights', free: false, premium: true, clubPro: true },
  { label: 'Advanced analytics & attendance risk', free: false, premium: false, clubPro: true },
  { label: 'Expert outputs & HP-style assessments', free: false, premium: true, clubPro: true },
  { label: 'Event registration & meet payments (in-app)', free: true, premium: true, clubPro: true },
  { label: 'Club roster & squad management', free: false, premium: false, clubPro: true },
]

/** All family-tier rows (Free vs Family Premium columns only; Club Pro ignored). */
export function getParentFamilyTierComparison(): { label: string; free: boolean; premium: boolean }[] {
  return TIER_FEATURES.map(({ label, free, premium }) => ({ label, free, premium }))
}

/** Rows where Free and Family Premium differ — compact diff-only view. */
export function getParentFreeVsPremiumDiffRows(): { label: string; free: boolean; premium: boolean }[] {
  return TIER_FEATURES.filter((r) => r.free !== r.premium).map(({ label, free, premium }) => ({
    label,
    free,
    premium,
  }))
}
