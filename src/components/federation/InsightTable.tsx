import type { ReactNode } from 'react'

export type Column<T> = {
  key: keyof T | string
  header: string
  render?: (row: T) => ReactNode
}

type Props<T extends Record<string, unknown>> = {
  columns: Column<T>[]
  data: T[]
  emptyMessage?: string
  className?: string
}

export function InsightTable<T extends Record<string, unknown>>({
  columns,
  data,
  emptyMessage = 'No data',
  className = '',
}: Props<T>) {
  return (
    <div className={`overflow-x-auto rounded-lg border border-border/80 bg-card ${className}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/80 bg-bg-elevated/50">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-text-muted">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={i}
                className="border-b border-border/50 last:border-0 hover:bg-bg-elevated/30 transition-colors"
              >
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-3 text-text-primary">
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key as string] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
