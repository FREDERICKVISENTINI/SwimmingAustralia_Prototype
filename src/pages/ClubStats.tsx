import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { PageSection } from '../components/layout/PageSection'
import { UploadStatsModal } from '../components/club'
import type { StatUploadSource } from '../types/club'

const SOURCE_LABELS: Record<StatUploadSource, string> = {
  'meet-result': 'Meet',
  'training-observation': 'Training',
  assessment: 'Assessment',
  'manual-entry': 'Manual',
}

export function ClubStats() {
  const { accountType, clubSwimmers, clubStatUploads, addClubStatUpload, updateClubSwimmer } = useApp()
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadModalInitialTab, setUploadModalInitialTab] = useState<'team' | 'individual'>('team')
  const [preselectedId, setPreselectedId] = useState<string | null>(null)
  const [uploadHistorySourceFilter, setUploadHistorySourceFilter] = useState<string>('')
  const HISTORY_PAGE_SIZE = 25
  const [uploadHistoryShowing, setUploadHistoryShowing] = useState(HISTORY_PAGE_SIZE)

  const sortedUploads = useMemo(
    () => [...clubStatUploads].sort((a, b) => (b.uploadedAt < a.uploadedAt ? -1 : 1)),
    [clubStatUploads]
  )

  if (accountType !== 'club') {
    return (
      <PageSection title="Stats">
        <p className="text-text-muted">This page is for club accounts.</p>
      </PageSection>
    )
  }

  const filteredHistory = useMemo(() => {
    if (!uploadHistorySourceFilter) return sortedUploads
    return sortedUploads.filter((u) => u.source === uploadHistorySourceFilter)
  }, [sortedUploads, uploadHistorySourceFilter])
  const visibleHistory = filteredHistory.slice(0, uploadHistoryShowing)
  const hasMoreHistory = visibleHistory.length < filteredHistory.length

  return (
    <PageSection
      title="Stats"
      subtitle="Meet results, squad data, and performance uploads."
    >
      <div className="mb-6 rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-primary mb-3">
          What this page can bring
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          A single place to capture and view meet and squad results, training observations, and assessments — for your club and, in time, across the sport. Meet integrations could connect the many meets run around Australia (club, regional, state, national) so results flow in automatically where possible, linked by member ID so each swimmer’s record stays in one place. Clubs can still upload manually or via file import where live integration isn’t available. Data here feeds swimmer insights, pathway visibility, and national reporting.
        </p>
      </div>

      <>
          <p className="mb-4 text-sm text-text-secondary">
            Upload meet or squad results in bulk, or add a single swimmer result when needed.
          </p>
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              type="button"
              onClick={() => { setUploadModalInitialTab('team'); setPreselectedId(null); setUploadOpen(true) }}
              className="rounded-[var(--radius-button)] border border-border bg-bg-elevated px-4 py-2 text-sm font-medium text-text-primary hover:bg-bg-elevated/80"
            >
              Upload meet / squad results
            </button>
            <button
              type="button"
              onClick={() => { setUploadModalInitialTab('individual'); setPreselectedId(null); setUploadOpen(true) }}
              className="rounded-[var(--radius-button)] border border-border bg-bg-elevated px-4 py-2 text-sm font-medium text-text-primary hover:bg-bg-elevated/80"
            >
              Add individual result
            </button>
          </div>

          <div className="rounded-[var(--radius-card)] border border-border bg-card shadow-[var(--shadow-card)]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-4">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-primary">
                Upload history
              </h3>
              <label className="flex items-center gap-2">
                <span className="text-xs text-text-muted">Source</span>
                <select
                  value={uploadHistorySourceFilter}
                  onChange={(e) => setUploadHistorySourceFilter(e.target.value)}
                  className="rounded-[var(--radius-button)] border border-border bg-bg px-3 py-1.5 text-sm text-text-primary"
                >
                  <option value="">All</option>
                  {(Object.entries(SOURCE_LABELS) as [StatUploadSource, string][]).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </label>
            </div>
            {filteredHistory.length === 0 ? (
              <div className="p-8 text-center text-text-muted text-sm">
                {clubStatUploads.length === 0
                  ? 'No uploads yet. Use the buttons above to add meet or individual results.'
                  : 'No uploads match the selected source.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-bg-elevated/80">
                      <th className="px-4 py-3 font-medium text-text-muted">Date</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Source</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Swimmer</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Event / metric</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Value</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Uploaded</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleHistory.map((u) => (
                      <tr key={u.id} className="border-b border-border/70 last:border-0">
                        <td className="px-4 py-3 text-text-secondary">{u.date}</td>
                        <td className="px-4 py-3 text-text-secondary">{SOURCE_LABELS[u.source]}</td>
                        <td className="px-4 py-3 font-medium text-text-primary">{u.swimmerName}</td>
                        <td className="px-4 py-3 text-text-secondary">{u.eventMetric}</td>
                        <td className="px-4 py-3 text-text-secondary">{u.value}</td>
                        <td className="px-4 py-3 text-text-muted">
                          {new Date(u.uploadedAt).toLocaleString('en-AU', { dateStyle: 'short', timeStyle: 'short' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {hasMoreHistory && (
              <div className="border-t border-border p-3 text-center">
                <button
                  type="button"
                  onClick={() => setUploadHistoryShowing((n) => n + HISTORY_PAGE_SIZE)}
                  className="text-sm font-medium text-accent hover:underline"
                >
                  Show more
                </button>
              </div>
            )}
          </div>
        </>

      <UploadStatsModal
        open={uploadOpen}
        onClose={() => { setUploadOpen(false); setPreselectedId(null) }}
        swimmers={clubSwimmers}
        preselectedSwimmer={preselectedId ? clubSwimmers.find((s) => s.id === preselectedId) ?? null : null}
        initialTab={uploadModalInitialTab}
        onSave={(payload) => {
          const { attachment: _attachment, ...rest } = payload
          addClubStatUpload(rest)
          updateClubSwimmer(payload.swimmerId, { latestStatDate: payload.date })
        }}
      />
    </PageSection>
  )
}
