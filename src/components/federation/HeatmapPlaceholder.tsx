import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { useFederationLightPage } from '../../context/FederationLightPageContext'

const STATE_DATA = [
  { state: 'NSW', count: 28400 },
  { state: 'VIC', count: 21200 },
  { state: 'QLD', count: 18600 },
  { state: 'WA', count: 7200 },
  { state: 'SA', count: 5100 },
  { state: 'TAS', count: 2370 },
  { state: 'ACT', count: 1270 },
  { state: 'NT', count: 580 },
]

type Props = {
  title?: string
  className?: string
}

export function HeatmapPlaceholder({ title = 'Participation by state', className = '' }: Props) {
  const light = useFederationLightPage()
  const tickPrimary = light ? '#2d3d52' : '#D7E6F2'
  const tickMuted = light ? '#5c6d80' : '#8FB2C9'
  const tooltip = light
    ? { background: '#ffffff', border: '1px solid #d0dbe8', borderRadius: '8px', color: '#0f1c30', fontSize: 12 }
    : { background: '#0D3558', border: '1px solid #1D4C73', borderRadius: '8px', color: '#F4F8FC', fontSize: 12 }
  const cursorFill = light ? 'rgba(0,153,204,0.08)' : 'rgba(53,199,243,0.06)'
  const barFill = light ? 'rgba(0,153,204,0.55)' : 'rgba(53,199,243,0.55)'
  const barFillHi = light ? 'rgba(0,153,204,0.8)' : 'rgba(53,199,243,0.75)'
  const barFillLo = light ? 'rgba(0,153,204,0.4)' : 'rgba(53,199,243,0.45)'

  return (
    <div
      className={`rounded-[var(--radius-card)] border border-border/80 bg-card p-5 shadow-[var(--shadow-card)] ${className}`}
    >
      {title && <p className="text-sm font-medium text-text-primary mb-4">{title}</p>}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={STATE_DATA} margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
          <XAxis
            dataKey="state"
            tick={{ fill: tickPrimary, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
            tick={{ fill: tickMuted, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <Tooltip
            formatter={(value: number) => [value.toLocaleString(), 'Swimmers']}
            contentStyle={tooltip}
            cursor={{ fill: cursorFill }}
          />
          <Bar dataKey="count" fill={barFill} radius={[4, 4, 0, 0]}>
            {STATE_DATA.map((entry) => (
              <Cell
                key={entry.state}
                fill={entry.count > 15000 ? barFillHi : barFillLo}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
