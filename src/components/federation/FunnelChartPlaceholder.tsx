import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useFederationLightPage } from '../../context/FederationLightPageContext'

type FunnelStage = { stage: string; count: number; pct: number }

type Props = {
  stages: readonly FunnelStage[]
  title?: string
  className?: string
}

const BAR_COLORS_DARK = [
  'rgba(53,199,243,0.8)',
  'rgba(53,199,243,0.65)',
  'rgba(53,199,243,0.50)',
  'rgba(53,199,243,0.38)',
  'rgba(53,199,243,0.25)',
]
const BAR_COLORS_LIGHT = [
  'rgba(0,153,204,0.85)',
  'rgba(0,153,204,0.7)',
  'rgba(0,153,204,0.55)',
  'rgba(0,153,204,0.42)',
  'rgba(0,153,204,0.3)',
]

export function FunnelChartPlaceholder({ stages, title = 'Pathway funnel', className = '' }: Props) {
  const light = useFederationLightPage()
  const barColors = light ? BAR_COLORS_LIGHT : BAR_COLORS_DARK
  const tickMuted = light ? '#5c6d80' : '#8FB2C9'
  const tickPrimary = light ? '#2d3d52' : '#D7E6F2'
  const tooltip = light
    ? { background: '#ffffff', border: '1px solid #d0dbe8', borderRadius: '8px', color: '#0f1c30', fontSize: 12 }
    : { background: '#0D3558', border: '1px solid #1D4C73', borderRadius: '8px', color: '#F4F8FC', fontSize: 12 }
  const cursorFill = light ? 'rgba(0,153,204,0.08)' : 'rgba(53,199,243,0.06)'

  const data = stages.map((s) => ({ name: s.stage.replace('Learn-to-Swim', 'LTS'), count: s.count }))

  return (
    <div
      className={`rounded-[var(--radius-card)] border border-border/80 bg-card p-5 shadow-[var(--shadow-card)] ${className}`}
    >
      {title && <p className="text-sm font-medium text-text-primary mb-4">{title}</p>}
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 24, bottom: 0, left: 0 }}>
          <XAxis
            type="number"
            tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
            tick={{ fill: tickMuted, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={90}
            tick={{ fill: tickPrimary, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={((value: number) => [Number(value ?? 0).toLocaleString(), 'Swimmers']) as any}
            contentStyle={tooltip}
            cursor={{ fill: cursorFill }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={barColors[index] ?? barColors[barColors.length - 1]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
