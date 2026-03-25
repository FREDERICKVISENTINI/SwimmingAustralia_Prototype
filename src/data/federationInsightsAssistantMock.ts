/**
 * Mock responses for the Federation Insights Assistant (prototype).
 * Supports analytics (charts) and recommendation (shortlists).
 * Query routing uses deterministic intent scoring (see utils/assistant).
 */

import { resolveAssistantIntent } from '../utils/assistant/assistantResultResolver'
import { generateAssistantAthleteList } from './assistantGenerateAthletes'
import type { RecommendationAthlete } from '../types/insightsAssistant'

export type { RecommendationAthlete } from '../types/insightsAssistant'

export type InsightChartKind =
  | 'line'
  | 'groupedBar'
  | 'dotPlot'
  | 'funnel'
  | 'heatmap'

export type InsightChartPayload =
  | {
      kind: 'line'
      xKey: string
      series: { key: string; label: string; color?: string }[]
      rows: Record<string, string | number>[]
    }
  | {
      kind: 'groupedBar'
      categoryKey: string
      series: { key: string; label: string }[]
      rows: Record<string, string | number>[]
    }
  | {
      kind: 'dotPlot'
      labelKey: string
      valueKey: string
      rows: { label: string; value: number }[]
    }
  | {
      kind: 'funnel'
      rows: { stage: string; count: number; pct: number }[]
    }
  | {
      kind: 'heatmap'
      rowLabels: string[]
      colLabels: string[]
      values: number[][]
    }

/** Scatter: performance trend index vs visibility / engagement index (0–100). */
export type InsightScatterPayload = {
  kind: 'scatter'
  rows: { name: string; trend: number; visibility: number }[]
}

export type InsightChartAssistantResult = {
  kind: 'chart'
  id: string
  title: string
  summary: string
  chart: InsightChartPayload
  /** Subtle demo line — how the query was interpreted. */
  matchHint?: string
}

export type AthleteListBasis = 'hp' | 'meet' | 'risk' | 'results'

export type InsightAthleteListSection = {
  id: string
  label: string
  basis: AthleteListBasis
  athletes: RecommendationAthlete[]
  /** Section explainer (retention vs talent presets). */
  description?: string
}

export type InsightRecommendationAssistantResult = {
  kind: 'recommendation'
  id: string
  title: string
  summary: string
  /** How candidates were identified (signals referenced). */
  methodologyLine: string
  /** Legacy card grid — used when athleteLists is absent. */
  athletes: RecommendationAthlete[]
  /** Split HP vs meet results (large list demos). */
  athleteLists?: InsightAthleteListSection[]
  /** How to label split lists in the UI. */
  athleteListPreset?: 'talent' | 'retention'
  supportChart?: InsightChartPayload | InsightScatterPayload
  matchHint?: string
}

export type InsightAssistantResult = InsightChartAssistantResult | InsightRecommendationAssistantResult

export const INSIGHT_ASSISTANT_PROMPTS: { id: string; label: string }[] = [
  { id: 'registrations-yoy', label: 'Compare registrations year on year' },
  { id: 'state-changes', label: 'Show state-by-state changes' },
  { id: 'pathway-dropoff-state', label: 'Show pathway drop-off by state' },
  { id: 'hp-uptake-trend', label: 'Compare HP uptake over time' },
  { id: 'revenue-changes', label: 'Explain revenue changes' },
  { id: 'age-retention-yoy', label: 'Compare age-group retention year on year' },
  { id: 'participation-heatmap', label: 'Participation intensity (state × quarter)' },
  { id: 'sponsorship-candidates', label: 'Give me athletes worthy of a sponsorship' },
  { id: 'trending-upward', label: 'Show swimmers trending upward' },
  { id: 'junior-prospects', label: 'High-potential junior prospects (11–14)' },
  { id: 'commercial-potential', label: 'Show athletes with commercial potential' },
  { id: 'pathway-acceleration', label: 'Who should be monitored for pathway acceleration?' },
  { id: 'retention-risk-strong', label: 'Show athletes at retention risk' },
]

const CHART_RESULTS: Record<string, InsightChartAssistantResult> = {
  'registrations-yoy': {
    kind: 'chart',
    id: 'registrations-yoy',
    title: 'National registrations — year on year',
    summary:
      'Registrations grew 4.2% YoY in the latest full year. Growth is strongest in QLD and WA; NSW remains the largest single state by volume. The pattern is consistent with returning participation post-program expansion.',
    chart: {
      kind: 'groupedBar',
      categoryKey: 'fy',
      series: [{ key: 'total', label: 'Total registrations (000s)' }],
      rows: [
        { fy: 'FY22', total: 1480 },
        { fy: 'FY23', total: 1515 },
        { fy: 'FY24', total: 1579 },
      ],
    },
  },
  'state-changes': {
    kind: 'chart',
    id: 'state-changes',
    title: 'State-by-state registration change (YoY %)',
    summary:
      'Queensland and Western Australia show the largest relative gains; NSW and VIC remain the volume anchors. Smaller states exhibit higher volatility due to base size — use rolling averages for operational planning.',
    chart: {
      kind: 'dotPlot',
      labelKey: 'label',
      valueKey: 'value',
      rows: [
        { label: 'NSW', value: 3.1 },
        { label: 'VIC', value: 2.8 },
        { label: 'QLD', value: 5.4 },
        { label: 'WA', value: 4.9 },
        { label: 'SA', value: 2.2 },
        { label: 'TAS', value: 1.6 },
        { label: 'ACT', value: 3.0 },
        { label: 'NT', value: 1.1 },
      ],
    },
  },
  'pathway-dropoff-state': {
    kind: 'chart',
    id: 'pathway-dropoff-state',
    title: 'Pathway retention — LTS → junior squad (by state)',
    summary:
      'Retention from learn-to-swim into junior squad varies by state between 61% and 74%. States with stronger club density and coach capacity cluster at the top; intervention programs correlate with the lower band.',
    chart: {
      kind: 'groupedBar',
      categoryKey: 'state',
      series: [{ key: 'retention', label: 'Retention %' }],
      rows: [
        { state: 'NSW', retention: 71 },
        { state: 'VIC', retention: 74 },
        { state: 'QLD', retention: 68 },
        { state: 'WA', retention: 66 },
        { state: 'SA', retention: 63 },
        { state: 'TAS', retention: 61 },
        { state: 'ACT', retention: 72 },
        { state: 'NT', retention: 64 },
      ],
    },
  },
  'hp-uptake-trend': {
    kind: 'chart',
    id: 'hp-uptake-trend',
    title: 'HP signal uptake (indexed, rolling 4 quarters)',
    summary:
      'HP tool usage and recorded signals rose steadily across the last four quarters. Acceleration in Q3 aligns with national camp windows and club onboarding to premium analytics — cohort-level only.',
    chart: {
      kind: 'line',
      xKey: 'q',
      series: [
        { key: 'signals', label: 'HP signals (index)', color: '#0099cc' },
        { key: 'clubs', label: 'Active clubs contributing', color: '#0d9488' },
      ],
      rows: [
        { q: 'Q1', signals: 100, clubs: 240 },
        { q: 'Q2', signals: 108, clubs: 255 },
        { q: 'Q3', signals: 118, clubs: 268 },
        { q: 'Q4', signals: 124, clubs: 281 },
      ],
    },
  },
  'revenue-changes': {
    kind: 'chart',
    id: 'revenue-changes',
    title: 'Platform revenue by stream — FY25 YTD vs prior YTD',
    summary:
      'YTD revenue is ahead of prior year across member payments and club platform fees. Premium analytics grew fastest in percentage terms; events revenue is seasonal and typically peaks in Q3–Q4.',
    chart: {
      kind: 'groupedBar',
      categoryKey: 'stream',
      series: [
        { key: 'prior', label: 'Prior YTD ($M)' },
        { key: 'current', label: 'Current YTD ($M)' },
      ],
      rows: [
        { stream: 'Members', prior: 3.6, current: 4.2 },
        { stream: 'Clubs', prior: 3.2, current: 3.8 },
        { stream: 'Premium', prior: 1.7, current: 2.1 },
        { stream: 'Events', prior: 1.4, current: 1.6 },
        { stream: 'HP tools', prior: 0.6, current: 0.7 },
      ],
    },
  },
  'participation-heatmap': {
    kind: 'chart',
    id: 'participation-heatmap',
    title: 'Participation intensity — state × quarter (normalised index)',
    summary:
      'Higher intensity in NSW, VIC, and QLD aligns with population and club density. Seasonal lift in Q2–Q3 reflects school-term learn-to-swim peaks — aggregated only; use for resource planning, not individual targeting.',
    chart: {
      kind: 'heatmap',
      rowLabels: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'],
      colLabels: ['Q1', 'Q2', 'Q3', 'Q4'],
      values: [
        [0.92, 0.88, 0.95, 0.9],
        [0.85, 0.82, 0.88, 0.84],
        [0.78, 0.8, 0.86, 0.81],
        [0.55, 0.52, 0.58, 0.54],
        [0.42, 0.4, 0.45, 0.41],
        [0.28, 0.26, 0.3, 0.27],
        [0.35, 0.33, 0.38, 0.34],
        [0.22, 0.2, 0.24, 0.21],
      ],
    },
  },
  'age-retention-yoy': {
    kind: 'chart',
    id: 'age-retention-yoy',
    title: 'Age-group retention YoY (12-month rolling)',
    summary:
      'Retention improved slightly in 11–12 and 13–14 age bands year on year; 8 & under remains stable. Older age groups show expected pressure from multi-sport competition — monitor state-level programs for variance.',
    chart: {
      kind: 'groupedBar',
      categoryKey: 'band',
      series: [
        { key: 'fy23', label: 'FY23 %' },
        { key: 'fy24', label: 'FY24 %' },
      ],
      rows: [
        { band: '8 & u', fy23: 82, fy24: 82 },
        { band: '9–10', fy23: 79, fy24: 80 },
        { band: '11–12', fy23: 76, fy24: 78 },
        { band: '13–14', fy23: 74, fy24: 76 },
        { band: '15+', fy23: 71, fy24: 72 },
      ],
    },
  },
}

const RECOMMENDATION_RESULTS: Record<string, InsightRecommendationAssistantResult> = {
  'sponsorship-candidates': {
    kind: 'recommendation',
    id: 'sponsorship-candidates',
    title: 'Recommended athletes for sponsorship review',
    summary:
      'Based on available performance trajectory, pathway stage, competition results, and visibility indicators, the following athletes meet federation sponsorship screening criteria for partner conversations.',
    methodologyLine:
      'Identified using rolling 90-day PB improvement, national benchmark proximity, pathway position (state pathway+), meet level participation, and engagement index derived from meet entries and programme attendance — no arbitrary selection.',
    athletes: [],
    supportChart: {
      kind: 'scatter',
      rows: [
        { name: 'E. Chen', trend: 88, visibility: 82 },
        { name: 'L. O’Brien', trend: 79, visibility: 71 },
        { name: 'Z. Williams', trend: 74, visibility: 68 },
        { name: 'N. Taylor', trend: 81, visibility: 59 },
        { name: 'M. Singh', trend: 70, visibility: 55 },
      ],
    },
  },
  'trending-upward': {
    kind: 'recommendation',
    id: 'trending-upward',
    title: 'Swimmers trending upward (90-day performance index)',
    summary:
      'Athletes ranked by composite improvement index: PB delta, meet frequency, and relative ranking movement. Suitable for talent tracking and development investment discussions.',
    methodologyLine:
      'Ranked from unified results data and 90-day rolling improvement; pathway and age band included for context.',
    athletes: [],
  },
  'junior-prospects': {
    kind: 'recommendation',
    id: 'junior-prospects',
    title: 'High-potential junior prospects (11–14)',
    summary:
      'Candidates in junior age bands showing pathway readiness signals: state benchmark proximity, coach nominations, and progression velocity relative to peers.',
    methodologyLine:
      'Filtered by age band, pathway stage junior–competitive club, and ≥1 selection or HP signal in last 12 months.',
    athletes: [],
  },
  'commercial-potential': {
    kind: 'recommendation',
    id: 'commercial-potential',
    title: 'Athletes with commercial partnership potential',
    summary:
      'Profiles combining strong results with audience and programme visibility — suitable for partner review where brand alignment and reach matter alongside performance.',
    methodologyLine:
      'Scored from performance tier, meet exposure (state+), and engagement index; under-recognised flag when results exceed visibility score.',
    athletes: [],
    supportChart: {
      kind: 'scatter',
      rows: [
        { name: 'N. Taylor', trend: 91, visibility: 52 },
        { name: 'E. Chen', trend: 88, visibility: 84 },
        { name: 'S. Blake', trend: 72, visibility: 61 },
      ],
    },
  },
  'pathway-acceleration': {
    kind: 'recommendation',
    id: 'pathway-acceleration',
    title: 'Pathway acceleration watchlist',
    summary:
      'Athletes showing velocity of progression (stage movement or benchmark jumps) above cohort median — recommend monitoring for selection and resource allocation.',
    methodologyLine:
      'Derived from stage transitions in unified pathway data and benchmark cross-over events within 6 months.',
    athletes: [],
  },
  'retention-risk-strong': {
    kind: 'recommendation',
    id: 'retention-risk-strong',
    title: 'Retention risk despite strong results',
    summary:
      'Athletes flagged by attendance / engagement risk models while maintaining performance quality — intervention may prevent drop-off before next competition window.',
    methodologyLine:
      'Intersection of cohort dropout risk flags (attendance, squad churn signals) with top-quartile recent results — prototype heuristic.',
    athletes: [],
  },
}

const ALL_RESULTS: Record<string, InsightAssistantResult> = {
  ...CHART_RESULTS,
  ...RECOMMENDATION_RESULTS,
}

/** Recommendation views that render split HP vs meet tables (~100 rows total in demo). */
const RECOMMENDATION_WITH_SPLIT_LISTS = new Set([
  'sponsorship-candidates',
  'trending-upward',
  'junior-prospects',
  'commercial-potential',
  'pathway-acceleration',
  'retention-risk-strong',
])

const HP_MEET_COUNTS: Record<string, { hp: number; meet: number }> = {
  'retention-risk-strong': { hp: 25, meet: 25 },
}

function finalizeChart(base: InsightChartAssistantResult, matchHint: string): InsightChartAssistantResult {
  return { ...base, matchHint }
}

function finalizeRecommendation(
  base: InsightRecommendationAssistantResult,
  matchHint: string,
): InsightRecommendationAssistantResult {
  if (!RECOMMENDATION_WITH_SPLIT_LISTS.has(base.id)) {
    return { ...base, matchHint }
  }
  const counts = HP_MEET_COUNTS[base.id] ?? { hp: 50, meet: 50 }

  if (base.id === 'retention-risk-strong') {
    return {
      ...base,
      matchHint,
      athletes: [],
      athleteListPreset: 'retention',
      athleteLists: [
        {
          id: 'risk',
          label: 'Risk & engagement signals',
          basis: 'risk',
          description:
            'Why they surface here: attendance, payments, squad engagement, or operational flags — the “something’s wrong” side of the model.',
          athletes: generateAssistantAthleteList(counts.hp, 'risk', base.id),
        },
        {
          id: 'results',
          label: 'Recent results (still competitive)',
          basis: 'results',
          description:
            'Why it matters: recent meet form / rankings are still strong — the “despite” contrast this view is built to find (mock names differ per column).',
          athletes: generateAssistantAthleteList(counts.meet, 'results', base.id),
        },
      ],
    }
  }

  const labels = {
    hp: 'HP & screening signals (SPARTA II, coach flags)',
    meet: 'Meet results & rankings (unified results feed)',
  }
  return {
    ...base,
    matchHint,
    athletes: [],
    athleteListPreset: 'talent',
    athleteLists: [
      {
        id: 'hp',
        label: labels.hp,
        basis: 'hp',
        athletes: generateAssistantAthleteList(counts.hp, 'hp', base.id),
      },
      {
        id: 'meet',
        label: labels.meet,
        basis: 'meet',
        athletes: generateAssistantAthleteList(counts.meet, 'meet', base.id),
      },
    ],
  }
}

/** Map free-text to a predefined result using weighted intent scoring (prototype). */
export function resolveInsightQuery(raw: string): InsightAssistantResult | null {
  const trimmed = raw.trim()
  if (!trimmed) return null

  const resolution = resolveAssistantIntent(trimmed)
  if (!resolution) return null

  const base = ALL_RESULTS[resolution.resultId]
  if (!base) return null

  const hint = `Matched to ${resolution.intentLabel}`
  if (base.kind === 'chart') {
    return finalizeChart(base, hint)
  }
  return finalizeRecommendation(RECOMMENDATION_RESULTS[resolution.resultId]!, hint)
}

export function getInsightResultById(id: string): InsightAssistantResult | null {
  const base = ALL_RESULTS[id]
  if (!base) return null
  const hint = 'Example prompt (predefined view)'
  if (base.kind === 'chart') {
    return finalizeChart(base, hint)
  }
  return finalizeRecommendation(RECOMMENDATION_RESULTS[id]!, hint)
}
