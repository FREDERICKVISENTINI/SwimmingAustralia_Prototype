import { useParams, Navigate, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { PageSection } from '../components/layout/PageSection'
import { ROUTES } from '../routes'
import { INSIGHT_CATEGORIES } from '../data/insightsContent'
import { getSheetForCategory } from '../data/insightCategorySheets'

export function InsightCategoryPage() {
  const { accountType } = useApp()
  const navigate = useNavigate()
  const { categoryId } = useParams<{ categoryId: string }>()
  const category = categoryId
    ? INSIGHT_CATEGORIES.find((c) => c.id === categoryId)
    : null
  const sheet = categoryId ? getSheetForCategory(categoryId) : null

  if (accountType === 'parent') {
    return <Navigate to={ROUTES.app.insights} replace />
  }
  if (!category) {
    return <Navigate to={ROUTES.app.insights} replace />
  }

  const isTalentId = categoryId === 'talent-signals'
  const hasFlagColumn = sheet?.columns.includes('Flag')

  return (
    <PageSection
      title={category.title}
      subtitle={category.description}
    >
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-bright mb-6 cursor-pointer bg-transparent border-0 p-0 text-left"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" />
        Back
      </button>

      <div
        className={`rounded-[var(--radius-card)] border bg-card/80 p-6 shadow-[var(--shadow-card)] ${
          isTalentId
            ? 'border-accent/60 ring-2 ring-accent/25 shadow-[0_0_24px_-8px_rgb(53,199,243,0.2)]'
            : 'border-accent/40 ring-1 ring-accent/20'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <p className={`text-xs font-medium uppercase tracking-wider ${isTalentId ? 'text-accent' : 'text-text-muted'} mb-1`}>
              Sample data sheet (100 records · fake data)
            </p>
            <p className="text-sm text-text-secondary">
              {category.description}
            </p>
          </div>
          {isTalentId && (
            <span className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium bg-accent/15 text-accent border border-accent/30">
              Talent ID · flagged rows highlighted
            </span>
          )}
        </div>
        {sheet ? (
          <div className="overflow-x-auto rounded-lg border border-border/60 -mx-1">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className={`border-b border-border ${isTalentId ? 'bg-accent/10' : 'bg-bg-elevated/60'}`}>
                  {sheet.columns.map((col) => (
                    <th
                      key={col}
                      className={`px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap ${
                        isTalentId && col === 'Flag' ? 'text-accent' : 'text-text-muted'
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sheet.rows.map((row, i) => {
                  const isHighlight = isTalentId && hasFlagColumn && row['Flag'] === 'High potential'
                  return (
                    <tr
                      key={row['Member ID'] ?? i}
                      className={`border-b border-border/50 last:border-0 transition-colors ${
                        isHighlight
                          ? 'bg-accent/10 border-l-4 border-l-accent hover:bg-accent/15'
                          : 'hover:bg-bg-elevated/30'
                      }`}
                    >
                      {sheet.columns.map((col) => {
                        const value = row[col] ?? '—'
                        const isFlagCell = col === 'Flag' && value === 'High potential'
                        return (
                          <td key={col} className="px-3 py-2 text-text-primary whitespace-nowrap">
                            {isFlagCell ? (
                              <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium bg-accent/20 text-accent border border-accent/40">
                                {value}
                              </span>
                            ) : (
                              value
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-lg border border-border/60 bg-bg-elevated/30 p-8 text-center text-text-muted text-sm">
            No sheet config for this category.
          </div>
        )}
      </div>
    </PageSection>
  )
}
