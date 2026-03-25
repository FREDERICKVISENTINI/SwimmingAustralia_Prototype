import { useLayoutEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FlaskConical, ChevronRight } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { PageSection } from '../components/layout/PageSection'
import { ROUTES } from '../routes'
import type { ClubSwimmer } from '../types/club'
import { needsSpartaRecommendation, spartaPrimaryLabel } from '../utils/spartaPathway'

/** Max swimmers shown in the SPARTA spotlight (random sample from the full eligible pool). */
const SPARTA_SPOTLIGHT_MAX = 8

function shuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

type HpProductsTab = 'coaches' | 'individual'

const HP_PRODUCT_TABS: { id: HpProductsTab; label: string }[] = [
  { id: 'coaches', label: 'Coach catalogue' },
  { id: 'individual', label: 'Individual swimmers' },
]

/** Individual pathway report purchase state for coach-facing HP list. */
function pathwayReportPurchaseLine(s: ClubSwimmer): string {
  const sp = s.spartaII
  if (!sp?.testCompleted) return 'Individual pathway report unlocks after SPARTA II screening (as an example)'
  if (!sp.reportReceived) return 'Individual pathway report — not purchased (promote to parents)'
  return 'Individual pathway report — purchased (open in swimmer Details)'
}

export function HpProductsPage() {
  const { accountType, clubSwimmers } = useApp()
  const [activeTab, setActiveTab] = useState<HpProductsTab>('coaches')

  const spartaCandidates = useMemo(
    () =>
      clubSwimmers
        .filter(needsSpartaRecommendation)
        .sort((a, b) => `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`)),
    [clubSwimmers],
  )

  const [spartaSpotlight, setSpartaSpotlight] = useState<ClubSwimmer[]>([])

  /** New random sample on each full page load and whenever the eligible pool changes. */
  useLayoutEffect(() => {
    const copy = [...spartaCandidates]
    shuffleInPlace(copy)
    setSpartaSpotlight(copy.slice(0, Math.min(SPARTA_SPOTLIGHT_MAX, copy.length)))
  }, [spartaCandidates])

  if (accountType !== 'club') {
    return (
      <PageSection title="HP products">
        <p className="text-text-muted">This page is for club accounts.</p>
      </PageSection>
    )
  }

  return (
    <PageSection
      title="HP products"
      subtitle="Help your coaches see what high-performance services exist for them — and track per-swimmer pathway in the other tab."
    >
      <div className="space-y-6">
        {/* Same tab strip pattern as Payments (Incoming / Outgoing) */}
        <div className="border-b border-border bg-bg-elevated/50" role="tablist">
          <div className="flex gap-0">
            {HP_PRODUCT_TABS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={activeTab === id}
                onClick={() => setActiveTab(id)}
                className={`shrink-0 border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
                  activeTab === id
                    ? 'border-accent text-accent'
                    : 'border-transparent text-text-muted hover:border-border hover:text-text-secondary'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'coaches' && (
          <div className="space-y-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-text-primary md:text-xl">
                National services for coaches
              </h2>
              <p className="mt-1 max-w-3xl text-sm text-text-secondary">
                This tab is about <strong className="text-text-primary">visibility</strong>, not a product catalogue.
                Use it as a place to show your coaches which high-performance services are available and accessible to
                them — analysis, physiology, camps, clinics, and pathway support that the club can book through
                Swimming Australia or partner channels.
              </p>
            </div>
            <div className="rounded-[var(--radius-card)] border border-border/80 bg-card p-5 shadow-[var(--shadow-card)] md:p-6">
              <p className="text-sm leading-relaxed text-text-secondary">
                When coaches <strong className="text-text-primary">see what’s on offer</strong> in one place, they can
                plan squads and sessions with confidence. That clarity makes the value obvious to everyone — and clubs
                are <strong className="text-text-primary">more likely to purchase and book</strong> HP services because
                the ask is tied to real coaching needs, not a hidden menu.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                Per-swimmer screening and parent-purchased pathway reports sit in the{' '}
                <strong className="text-text-primary">Individual swimmers</strong> tab — this tab stays focused on
                squad-level HP services for your coaching staff.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'individual' && (
          <div className="space-y-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-text-primary md:text-xl">
                Individual swimmer HP
              </h2>
              <p className="mt-1 max-w-3xl text-sm text-text-secondary">
                SPARTA II screening (as an example) and parent-purchased pathway reports are tracked per athlete. Coaches see status here;
                the full pathway view (including SPARTA context) is on each swimmer’s <strong className="text-text-primary">Details</strong> tab.
                Parents who haven’t bought the individual report yet show up here so you can follow up.
              </p>
            </div>
            <section className="rounded-[var(--radius-card)] border border-border/80 bg-card p-5 shadow-[var(--shadow-card)]">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-premium/10 text-premium">
                  <FlaskConical className="h-5 w-5" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-lg font-semibold text-text-primary">SPARTA II &amp; pathway status</h3>
                  <p className="mt-1 text-sm text-text-secondary">
                    Active junior and competitive swimmers who may need SPARTA II and/or a parent-purchased individual
                    pathway report. LTS swimmers are not listed. Screening and reports are purchased through your club
                    catalogue — this list is a random sample of who’s in scope.
                  </p>
                </div>
              </div>

              {spartaCandidates.length === 0 ? (
                <p className="mt-4 rounded-lg border border-success/25 bg-success/5 px-3 py-2.5 text-sm text-text-secondary">
                  All eligible swimmers have completed SPARTA II and received their state report (or none on file).
                </p>
              ) : (
                <>
                  <p className="mt-3 text-xs text-text-muted">
                    Showing {spartaSpotlight.length} of {spartaCandidates.length} eligible — refresh the page for a different
                    random sample.
                  </p>
                  <ul className="mt-4 divide-y divide-border/60 border-t border-border/60">
                    {spartaSpotlight.map((s) => {
                      const reportPending =
                        s.spartaII?.testCompleted && !s.spartaII.reportReceived
                      return (
                        <li key={s.id}>
                          <Link
                            to={`${ROUTES.app.swimmerDetail(s.id)}#pathway`}
                            state={{ fromHpProducts: true }}
                            className="group flex items-start justify-between gap-3 py-3 transition-colors hover:bg-bg-elevated/40 -mx-2 px-2 rounded-lg"
                          >
                            <div className="min-w-0">
                              <p className="font-medium text-text-primary">
                                {s.firstName} {s.lastName}
                                <span className="font-normal text-text-muted"> · {s.className}</span>
                              </p>
                              <p className="mt-0.5 text-sm font-medium text-accent">{spartaPrimaryLabel(s)}</p>
                              <p
                                className={`mt-1 text-xs leading-snug ${
                                  reportPending ? 'font-medium text-amber-700' : 'text-text-muted'
                                }`}
                              >
                                {pathwayReportPurchaseLine(s)}
                              </p>
                              {s.stateInsightNote && (
                                <p className="mt-1 text-xs leading-relaxed text-text-muted">{s.stateInsightNote}</p>
                              )}
                            </div>
                            <ChevronRight
                              className="h-5 w-5 shrink-0 text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
                              aria-hidden
                            />
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </>
              )}
            </section>
          </div>
        )}
      </div>
    </PageSection>
  )
}
