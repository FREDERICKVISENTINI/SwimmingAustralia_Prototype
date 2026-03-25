import { useCallback, useState } from 'react'
import { Bookmark, Sparkles } from 'lucide-react'
import {
  getInsightResultById,
  resolveInsightQuery,
  type InsightAssistantResult,
} from '../../../data/federationInsightsAssistantMock'
import { AssistantResultModeRenderer } from './AssistantResultModeRenderer'

export function InsightsAssistantPanel() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<InsightAssistantResult | null>(null)
  const [pending, setPending] = useState(false)
  const [saved, setSaved] = useState(false)

  const runQuery = useCallback((raw: string) => {
    const q = raw.trim()
    if (!q) return
    setPending(true)
    window.setTimeout(() => {
      const r = resolveInsightQuery(q)
      setResult(r)
      setSaved(false)
      setPending(false)
    }, 280)
  }, [])

  const runExampleJuniorProspects = useCallback(() => {
    setQuery('High-potential junior prospects (11–14)')
    setPending(true)
    window.setTimeout(() => {
      const r = getInsightResultById('junior-prospects')
      if (r) setResult(r)
      setSaved(false)
      setPending(false)
    }, 200)
  }, [])

  const saveView = () => {
    if (!result) return
    try {
      localStorage.setItem('federation.insightsAssistant.lastViewId', result.id)
      setSaved(true)
    } catch {
      /* ignore */
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    runQuery(query)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-[var(--radius-card)] border border-border/80 border-l-4 border-l-accent bg-card/80 p-4 shadow-[var(--shadow-card)]">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">Insights Assistant</span>
          </div>
          <label htmlFor="insights-query" className="sr-only">
            Ask the data
          </label>
          <textarea
            id="insights-query"
            rows={2}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask the data…"
            className="w-full resize-y rounded-lg border border-border bg-bg-elevated px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={pending || !query.trim()}
              className="rounded-[var(--radius-button)] bg-accent px-5 py-2.5 text-sm font-semibold text-bg transition hover:bg-accent-bright disabled:opacity-50"
            >
              {pending ? 'Running…' : 'Run query'}
            </button>
            {result && (
              <button
                type="button"
                onClick={saveView}
                className={`inline-flex items-center gap-2 rounded-[var(--radius-button)] border px-4 py-2.5 text-sm font-medium transition ${
                  saved
                    ? 'border-success/50 bg-success/10 text-success'
                    : 'border-border bg-card text-text-primary hover:bg-bg-elevated'
                }`}
              >
                <Bookmark className="h-4 w-4" aria-hidden />
                {saved ? 'Saved' : 'Save view'}
              </button>
            )}
          </div>

          <div className="mt-4 border-t border-border/50 pt-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-muted">Example prompt</p>
            <button
              type="button"
              disabled={pending}
              onClick={runExampleJuniorProspects}
              className="rounded-full border border-border/70 bg-bg-elevated px-3 py-2 text-left text-sm font-medium leading-snug text-text-primary transition hover:border-accent/40 hover:bg-bg-elevated/90 disabled:opacity-50"
            >
              High-potential junior prospects (11–14)
            </button>
          </div>
        </div>
      </form>

      {pending && (
        <div className="rounded-lg border border-border/60 bg-bg-elevated/50 px-4 py-3 text-sm text-text-muted">
          Interpreting query against federation aggregates…
        </div>
      )}

      {!pending && result && (
        <AssistantResultModeRenderer result={result} />
      )}
    </div>
  )
}
