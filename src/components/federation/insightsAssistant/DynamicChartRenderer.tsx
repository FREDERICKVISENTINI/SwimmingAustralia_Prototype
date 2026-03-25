import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type {
  InsightChartPayload,
  InsightScatterPayload,
} from '../../../data/federationInsightsAssistantMock'
import { useFederationLightPage } from '../../../context/FederationLightPageContext'

export type InsightVisualPayload = InsightChartPayload | InsightScatterPayload

type Props = {
  payload: InsightVisualPayload
  className?: string
}

export function DynamicChartRenderer({ payload, className = '' }: Props) {
  const light = useFederationLightPage()
  const muted = light ? '#5c6d80' : '#8FB2C9'
  const primary = light ? '#2d3d52' : '#D7E6F2'
  const grid = light ? '#e2e8f0' : '#1D4C73'
  const accent = '#0099cc'
  const teal = '#0d9488'

  if (payload.kind === 'scatter') {
    const data = payload.rows.map((r) => ({
      x: r.trend,
      y: r.visibility,
      name: r.name,
    }))
    return (
      <div className={`h-[300px] w-full ${className}`}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} opacity={0.5} />
            <XAxis
              type="number"
              dataKey="x"
              name="Performance trend"
              tick={{ fill: muted, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={[40, 100]}
              label={{ value: 'Performance trend index', position: 'bottom', offset: 0, fill: muted, fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Visibility"
              tick={{ fill: muted, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={[40, 100]}
              label={{ value: 'Visibility / engagement index', angle: -90, position: 'insideLeft', fill: muted, fontSize: 11 }}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                background: light ? '#fff' : '#0D3558',
                border: `1px solid ${grid}`,
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Scatter data={data} fill={accent} name="Athletes" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    )
  }

  const chart = payload

  if (chart.kind === 'heatmap') {
    const { rowLabels, colLabels, values } = chart
    return (
      <div className={`overflow-x-auto ${className}`}>
        <div className="inline-block min-w-full">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="border border-border/60 bg-bg-elevated/80 p-2 text-left font-medium text-text-muted">
                  State
                </th>
                {colLabels.map((c) => (
                  <th
                    key={c}
                    className="border border-border/60 bg-bg-elevated/80 p-2 text-center font-medium text-text-muted"
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rowLabels.map((row, ri) => (
                <tr key={row}>
                  <td className="border border-border/60 bg-card px-2 py-1.5 font-medium text-text-primary">
                    {row}
                  </td>
                  {colLabels.map((_, ci) => {
                    const v = values[ri]?.[ci] ?? 0
                    const bg = `color-mix(in srgb, ${accent} ${Math.round(v * 85)}%, transparent)`
                    return (
                      <td
                        key={`${row}-${ci}`}
                        className="border border-border/60 p-0 text-center tabular-nums text-text-primary"
                        style={{ background: bg }}
                        title={`${row} ${colLabels[ci]}: ${(v * 100).toFixed(0)}% index`}
                      >
                        <span className="inline-block min-w-[2.5rem] py-2">{v.toFixed(2)}</span>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-[0.7rem] text-text-muted">Index 0–1 · darker = higher relative participation intensity</p>
        </div>
      </div>
    )
  }

  if (chart.kind === 'funnel') {
    const data = chart.rows.map((r) => ({ name: r.stage.replace('Learn-to-Swim', 'LTS'), count: r.count }))
    return (
      <div className={`h-[260px] w-full ${className}`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} opacity={0.5} />
            <XAxis type="number" tick={{ fill: muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              width={100}
              tick={{ fill: primary, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: light ? '#fff' : '#0D3558',
                border: `1px solid ${grid}`,
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Bar dataKey="count" fill={accent} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (chart.kind === 'dotPlot') {
    const data = chart.rows.map((r) => ({ x: r.value, y: r.label }))
    return (
      <div className={`h-[280px] w-full ${className}`}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} opacity={0.5} />
            <XAxis
              type="number"
              dataKey="x"
              tick={{ fill: muted, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              label={{ value: 'YoY %', position: 'bottom', offset: 0, fill: muted, fontSize: 11 }}
            />
            <YAxis
              type="category"
              dataKey="y"
              width={44}
              tick={{ fill: primary, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                background: light ? '#fff' : '#0D3558',
                border: `1px solid ${grid}`,
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Scatter data={data} fill={accent} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (chart.kind === 'groupedBar') {
    const { categoryKey, series, rows } = chart
    return (
      <div className={`h-[300px] w-full ${className}`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} opacity={0.5} />
            <XAxis dataKey={categoryKey} tick={{ fill: muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: light ? '#fff' : '#0D3558',
                border: `1px solid ${grid}`,
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {series.map((s, idx) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.label}
                fill={idx === 0 ? accent : teal}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (chart.kind === 'line') {
    const { xKey, series, rows } = chart
    return (
      <div className={`h-[300px] w-full ${className}`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 8, right: 24, bottom: 8, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} opacity={0.5} />
            <XAxis dataKey={xKey} tick={{ fill: muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              yAxisId="left"
              tick={{ fill: muted, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: muted, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: light ? '#fff' : '#0D3558',
                border: `1px solid ${grid}`,
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {series.map((s, idx) => (
              <Line
                key={s.key}
                yAxisId={idx === 0 ? 'left' : 'right'}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color ?? (idx === 0 ? accent : teal)}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return null
}
