/**
 * Fake data "sheets" for each insight category – 100 rows of sample member-style data.
 * Obviously placeholder; column headings match the subheading themes.
 */

const REGIONS = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']
const AGE_GROUPS = ['8 & under', '9–10', '11–12', '13–14', '15+']
const STAGES = ['Recreation', 'Learn-to-Swim', 'Junior Squad', 'Competitive Club', 'State Pathway', 'Elite']
const POSTCODES = ['2000', '3000', '4000', '5000', '6000', '7000', '2600', '0800']
const CLUBS = ['City Dolphins', 'Bay Swim Club', 'Metro Squad', 'Regional Academy', 'State Development']
const STROKES = ['Freestyle', 'Backstroke', 'Breaststroke', 'Butterfly', 'IM']
const PROGRAMS = ['Squad', 'Learn-to-Swim', 'Competition', 'Development', 'Elite']
const MEETS = ['Club night', 'Regional qualifier', 'State champs', 'Nationals', 'Development meet']

function pick<T>(arr: readonly T[], i: number): T {
  return arr[i % arr.length]
}

function memberId(i: number): string {
  return `AUS-2024-${String(i).padStart(5, '0')}`
}

export type SheetConfig = {
  columns: string[]
  rows: Record<string, string>[]
}

function generateParticipation(): Record<string, string>[] {
  return Array.from({ length: 100 }, (_, i) => ({
    'Member ID': memberId(i + 1),
    'Region': pick(REGIONS, i),
    'Age group': pick(AGE_GROUPS, i * 3),
    'Joined': `202${(i % 4)}-${String((i % 12) + 1).padStart(2, '0')}-01`,
    'Status': i % 10 === 0 ? 'Lapsed' : 'Active',
    'Demographic': i % 3 === 0 ? 'M' : 'F',
  }))
}

function generateAthleteDevelopment(): Record<string, string>[] {
  return Array.from({ length: 100 }, (_, i) => ({
    'Member ID': memberId(i + 1),
    'Pathway stage': pick(STAGES, i),
    'Progression rate': `${(65 + (i % 25))}%`,
    'Sessions (90d)': String(12 + (i % 40)),
    'Improvement curve': i % 5 === 0 ? 'Above avg' : 'On track',
    'Benchmark': i % 4 === 0 ? 'Met' : 'In progress',
  }))
}

function generateTalentSignals(): Record<string, string>[] {
  return Array.from({ length: 100 }, (_, i) => ({
    'Member ID': memberId(i + 1),
    'Rank': String(i + 1),
    'Improvement velocity': `+${(5 + (i % 12))}.${i % 10}%`,
    'Technique index': (70 + (i % 25)).toFixed(1),
    'Flag': i % 8 === 0 ? 'High potential' : '—',
    'Stroke focus': pick(STROKES, i),
  }))
}

function generateConsumerBehaviour(): Record<string, string>[] {
  return Array.from({ length: 100 }, (_, i) => ({
    'Member ID': memberId(i + 1),
    'Program': pick(PROGRAMS, i),
    'Equipment spend': `$${(50 + (i % 450))}`,
    'Training freq': `${2 + (i % 5)}x/week`,
    'Participation pattern': i % 3 === 0 ? 'Regular' : 'Variable',
  }))
}

function generateCompetitionEvent(): Record<string, string>[] {
  return Array.from({ length: 100 }, (_, i) => ({
    'Member ID': memberId(i + 1),
    'Meet': pick(MEETS, i),
    'Event': `${50 + (i % 4) * 50}m ${pick(STROKES, i).slice(0, 4)}`,
    'Time': `${1 + (i % 2)}:${String(i % 60).padStart(2, '0')}.${(i % 100)}`,
    'Place': String((i % 20) + 1),
    'Qualified': i % 3 === 0 ? 'Yes' : 'No',
  }))
}

function generateGeographic(): Record<string, string>[] {
  return Array.from({ length: 100 }, (_, i) => ({
    'Member ID': memberId(i + 1),
    'Postcode': pick(POSTCODES, i),
    'Region': pick(REGIONS, i),
    'Club': pick(CLUBS, i),
    'Density band': i % 4 === 0 ? 'High' : i % 4 === 1 ? 'Medium' : 'Low',
    'Facility': `Centre ${(i % 12) + 1}`,
  }))
}

function generateCommercialSponsorship(): Record<string, string>[] {
  return Array.from({ length: 100 }, (_, i) => ({
    'Member ID': memberId(i + 1),
    'Engagement score': String(60 + (i % 35)),
    'Reach': i % 5 === 0 ? 'National' : 'Regional',
    'Demographic': AGE_GROUPS[i % AGE_GROUPS.length],
    'Exposure': `${(i % 100)}%`,
  }))
}

function generateHighPerformance(): Record<string, string>[] {
  return Array.from({ length: 100 }, (_, i) => ({
    'Member ID': memberId(i + 1),
    'Stroke': pick(STROKES, i),
    'Efficiency index': (75 + (i % 20)).toFixed(1),
    'vs National std': i % 4 === 0 ? 'Above' : 'At',
    'Development indicator': (60 + (i % 35)).toFixed(0),
    'Benchmark': (90 + (i % 10)).toFixed(1) + '%',
  }))
}

const SHEET_GENERATORS: Record<string, () => Record<string, string>[]> = {
  'participation': generateParticipation,
  'athlete-development': generateAthleteDevelopment,
  'talent-signals': generateTalentSignals,
  'consumer-behaviour': generateConsumerBehaviour,
  'competition-event': generateCompetitionEvent,
  'geographic': generateGeographic,
  'commercial-sponsorship': generateCommercialSponsorship,
  'high-performance': generateHighPerformance,
}

const SHEET_COLUMNS: Record<string, string[]> = {
  'participation': ['Member ID', 'Region', 'Age group', 'Joined', 'Status', 'Demographic'],
  'athlete-development': ['Member ID', 'Pathway stage', 'Progression rate', 'Sessions (90d)', 'Improvement curve', 'Benchmark'],
  'talent-signals': ['Member ID', 'Rank', 'Improvement velocity', 'Technique index', 'Flag', 'Stroke focus'],
  'consumer-behaviour': ['Member ID', 'Program', 'Equipment spend', 'Training freq', 'Participation pattern'],
  'competition-event': ['Member ID', 'Meet', 'Event', 'Time', 'Place', 'Qualified'],
  'geographic': ['Member ID', 'Postcode', 'Region', 'Club', 'Density band', 'Facility'],
  'commercial-sponsorship': ['Member ID', 'Engagement score', 'Reach', 'Demographic', 'Exposure'],
  'high-performance': ['Member ID', 'Stroke', 'Efficiency index', 'vs National std', 'Development indicator', 'Benchmark'],
}

export function getSheetForCategory(categoryId: string): SheetConfig | null {
  const columns = SHEET_COLUMNS[categoryId]
  const generator = SHEET_GENERATORS[categoryId]
  if (!columns || !generator) return null
  const rows = generator()
  return { columns, rows }
}
