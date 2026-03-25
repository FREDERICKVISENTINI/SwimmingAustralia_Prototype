import { useState, useMemo } from 'react'
import { BarChart3, Lock } from 'lucide-react'
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

type StatsTabId = 'uploads' | 'benchmarks'

export function ClubStats() {
  const {
    accountType,
    clubSwimmers,
    clubStatUploads,
    addClubStatUpload,
    updateClubSwimmer,
    isPremiumTier,
    setIsPremiumTier,
  } = useApp()
  const [statsTab, setStatsTab] = useState<StatsTabId>('uploads')
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

  const filteredHistory = uploadHistorySourceFilter
    ? sortedUploads.filter((u) => u.source === uploadHistorySourceFilter)
    : sortedUploads
  const visibleHistory = filteredHistory.slice(0, uploadHistoryShowing)
  const hasMoreHistory = visibleHistory.length < filteredHistory.length

  const tabBtn = (id: StatsTabId, label: string) => (
    <button
      key={id}
      type="button"
      role="tab"
      aria-selected={statsTab === id}
      onClick={() => setStatsTab(id)}
      className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
        statsTab === id
          ? 'border-accent text-accent'
          : 'border-transparent text-text-muted hover:border-border hover:text-text-secondary'
      }`}
    >
      {label}
    </button>
  )

  return (
    <PageSection
      title="Stats"
      subtitle="Meet results, squad data, uploads — and optional benchmark packs to compare your squad against the wider competition."
    >
      <div
        className="-mt-2 mb-6 border-b border-border bg-bg-elevated/50"
        role="tablist"
        aria-label="Stats sections"
      >
        <div className="flex gap-0 overflow-x-auto">
          {tabBtn('uploads', 'Uploads & history')}
          {tabBtn('benchmarks', 'Benchmark insights')}
        </div>
      </div>

      {statsTab === 'uploads' && (
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
      )}

      {statsTab === 'benchmarks' && (
        <div className="space-y-6">
          <p className="text-sm text-text-secondary">
            Coaches can <strong className="font-medium text-text-primary">purchase insight packs</strong> that layer national
            and regional benchmarks on top of your uploaded results — so you see how the squad stacks up against pathway
            cohorts, age standards, and peer clubs (prototype).
          </p>

          <div className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-start gap-3">
              <BarChart3 className="h-5 w-5 shrink-0 text-accent" aria-hidden />
              <div>
                <h3 className="font-display text-base font-semibold text-text-primary">What you&apos;re buying</h3>
                <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm text-text-secondary">
                  <li>Cohort percentiles and ranking movement vs national age groups</li>
                  <li>Event-level comparison against clubs in your region or pathway stage</li>
                  <li>Seasonal trend views tied to the stats you already upload</li>
                </ul>
              </div>
            </div>
          </div>

          <div
            className={`relative rounded-[var(--radius-card)] border p-5 shadow-[var(--shadow-card)] ${
              isPremiumTier ? 'border-premium/30 bg-card' : 'border-border bg-card'
            }`}
          >
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
              Club benchmarking access
            </h3>
            <p className="mt-1 text-xs text-text-muted">
              Unlocks dashboard and swimmer views that compare your squad to the competition set.
            </p>
            <div className={`mt-4 space-y-3 ${isPremiumTier ? '' : 'blur-sm select-none pointer-events-none'}`}>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Squad vs national median (100m FR)</span>
                <span className="font-medium text-success">+4.2% vs cohort</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Peer club index (region)</span>
                <span className="font-medium text-text-primary">72nd percentile</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Benchmark pack</span>
                <span className="font-medium text-accent">National pathway 2025</span>
              </div>
            </div>
            {!isPremiumTier && (
              <div className="absolute inset-0 flex items-center justify-center rounded-[var(--radius-card)] bg-bg/60 backdrop-blur-[2px]">
                <div className="max-w-sm px-4 text-center">
                  <Lock className="mx-auto h-6 w-6 text-text-muted" aria-hidden />
                  <p className="mt-2 text-sm font-medium text-text-secondary">Benchmark insights not purchased</p>
                  <p className="mt-1 text-xs text-text-muted">
                    Your organisation has not bought competitive benchmarking — purchase a pack or enable Premium to unlock
                    these views.
                  </p>
                  <button
                    type="button"
                    className="mt-4 rounded-[var(--radius-button)] bg-accent px-4 py-2 text-sm font-semibold text-bg hover:bg-accent-bright"
                  >
                    Purchase insights (demo)
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-text-muted">Prototype: toggle club Premium to preview unlocked benchmarking</span>
            <button
              type="button"
              onClick={() => setIsPremiumTier(!isPremiumTier)}
              className={`rounded-[var(--radius-button)] px-3 py-1.5 text-xs font-semibold transition ${
                isPremiumTier
                  ? 'bg-premium/20 text-premium ring-1 ring-premium/35'
                  : 'border border-border bg-bg-elevated text-text-primary'
              }`}
            >
              {isPremiumTier ? 'Premium on' : 'Enable Premium (demo)'}
            </button>
          </div>
        </div>
      )}

      <UploadStatsModal
        open={uploadOpen}
        onClose={() => { setUploadOpen(false); setPreselectedId(null) }}
        swimmers={clubSwimmers}
        preselectedSwimmer={preselectedId ? clubSwimmers.find((s) => s.id === preselectedId) ?? null : null}
        initialTab={uploadModalInitialTab}
        onSave={(payload) => {
          const { attachment: _attachment, ...rest } = payload
          addClubStatUpload({
            ...rest,
            uploadedAt: new Date().toISOString(),
          })
          updateClubSwimmer(payload.swimmerId, { latestStatDate: payload.date })
        }}
      />
    </PageSection>
  )
}
