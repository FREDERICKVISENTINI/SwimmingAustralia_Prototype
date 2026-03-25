import { useId, useMemo } from 'react'
import australiaSvgRaw from '../../../assets/australia-map.svg?raw'
import { NATIONAL_PARTICIPATION_BY_STATE } from '../../../data/federationNationalDashboard'

type PathItem = { id: string; d: string }

/** Map SVG path id → state/territory code (islands inherit parent jurisdiction). */
const PATH_ID_TO_STATE: Record<string, string> = {
  act: 'ACT',
  nsw: 'NSW',
  'nt-groote-eylandt': 'NT',
  'nt-mainland': 'NT',
  'nt-melville-island': 'NT',
  'qld-fraser-island': 'QLD',
  'qld-mainland': 'QLD',
  'qld-mornington-island': 'QLD',
  'sa-kangaroo-island': 'SA',
  'sa-mainland': 'SA',
  'tas-cape-barren': 'TAS',
  'tas-flinders-island': 'TAS',
  'tas-king-currie-island': 'TAS',
  'tas-mainland': 'TAS',
  vic: 'VIC',
  wa: 'WA',
}

/** One label per jurisdiction at approximate geographic centre (source map viewBox). */
const LABEL: Record<
  string,
  { x: number; y: number; fontSize?: number; anchor?: 'start' | 'middle' | 'end' }
> = {
  wa: { x: 62, y: 102, fontSize: 10, anchor: 'middle' },
  'nt-mainland': { x: 142, y: 78, fontSize: 9, anchor: 'middle' },
  'qld-mainland': { x: 238, y: 72, fontSize: 10, anchor: 'middle' },
  'sa-mainland': { x: 168, y: 158, fontSize: 9, anchor: 'middle' },
  nsw: { x: 232, y: 168, fontSize: 10, anchor: 'middle' },
  act: { x: 246, y: 188, fontSize: 6, anchor: 'middle' },
  vic: { x: 248, y: 208, fontSize: 9, anchor: 'middle' },
  'tas-mainland': { x: 228, y: 244, fontSize: 9, anchor: 'middle' },
}

function parsePathElements(raw: string): PathItem[] {
  const doc = new DOMParser().parseFromString(raw.trim(), 'image/svg+xml')
  const err = doc.querySelector('parsererror')
  if (err) return []
  return [...doc.querySelectorAll('path[id]')].map((el) => ({
    id: el.id,
    d: el.getAttribute('d') ?? '',
  }))
}

function lerp(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t)
}

/** Higher national share → darker fill (normalized to max state share). */
function fillForShare(sharePct: number, maxShare: number): string {
  const t = maxShare > 0 ? Math.min(1, Math.max(0, sharePct / maxShare)) : 0
  const r = lerp(232, 8, t)
  const g = lerp(244, 72, t)
  const b = lerp(252, 112, t)
  return `rgb(${r} ${g} ${b})`
}

function strokeForFill(t: number): string {
  return t > 0.55 ? 'rgba(255,255,255,0.45)' : 'rgba(20,60,90,0.35)'
}

function labelTextFill(t: number): string {
  return t > 0.42 ? 'rgba(255,255,255,0.96)' : 'rgba(12,45,68,0.92)'
}

export function AustraliaShareChoroplethMap({ className }: { className?: string }) {
  const filterId = useId().replace(/:/g, '')
  const paths = useMemo(() => parsePathElements(australiaSvgRaw), [])

  const shareByState = useMemo(
    () => Object.fromEntries(NATIONAL_PARTICIPATION_BY_STATE.map((r) => [r.state, r.sharePct])) as Record<
      string,
      number
    >,
    []
  )
  const maxShare = useMemo(
    () => Math.max(...NATIONAL_PARTICIPATION_BY_STATE.map((r) => r.sharePct)),
    []
  )

  const labelShown = useMemo(() => new Set(Object.keys(LABEL)), [])

  return (
    <svg
      viewBox="6.5 4.8 273 252.8"
      className={className}
      aria-label="Australia map coloured by national swimmer share by state"
    >
      <defs>
        <filter id={`au-sh-${filterId}`} x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodOpacity="0.14" />
        </filter>
      </defs>
      <g filter={`url(#au-sh-${filterId})`}>
        {paths.map((p) => {
          const code = PATH_ID_TO_STATE[p.id]
          const share = code ? shareByState[code] ?? 0 : 0
          const t = maxShare > 0 ? share / maxShare : 0
          const fill = code ? fillForShare(share, maxShare) : 'rgb(236 242 248)'
          return (
            <path
              key={p.id}
              id={p.id}
              d={p.d}
              fill={fill}
              stroke={strokeForFill(t)}
              strokeWidth={0.35}
              vectorEffect="non-scaling-stroke"
            >
              {code && (
                <title>
                  {code}: {share.toFixed(1)}% national share
                </title>
              )}
            </path>
          )
        })}
      </g>
      {paths.map((p) => {
        if (!labelShown.has(p.id)) return null
        const code = PATH_ID_TO_STATE[p.id]
        const share = code ? shareByState[code] ?? 0 : 0
        const t = maxShare > 0 ? share / maxShare : 0
        const cfg = LABEL[p.id]
        if (!cfg || !code) return null
        const text = `${share.toFixed(1)}%`
        return (
          <text
            key={`label-${p.id}`}
            x={cfg.x}
            y={cfg.y}
            textAnchor={cfg.anchor ?? 'middle'}
            className="pointer-events-none select-none font-semibold"
            style={{
              fontSize: cfg.fontSize ?? 9,
              fill: labelTextFill(t),
            }}
          >
            {text}
          </text>
        )
      })}
    </svg>
  )
}
