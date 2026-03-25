import { Link } from 'react-router-dom'
import { MapPin, FileText, ShoppingBag, FlaskConical, ExternalLink } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { ROUTES } from '../../routes'
import { PATHWAY_STAGES } from '../../theme/tokens'
import type { ClubSwimmer } from '../../types/club'
import { isSpartaEligible, spartaPrimaryLabel } from '../../utils/spartaPathway'

function nearbyScreeningBlurb(state: string): { heading: string; items: { title: string; detail: string }[] } {
  const s = state.trim() || 'NSW'
  return {
    heading: `${s} — nearby options`,
    items: [
      {
        title: 'Regional HP screening day',
        detail: `Travelling blocks across ${s}; your club books a squad slot through the HP catalogue (prototype).`,
      },
      {
        title: 'State pathway institute',
        detail: `State report delivery and interpretation sessions are scheduled after SPARTA II where applicable — check your state calendar.`,
      },
      {
        title: 'Home pool coordination',
        detail: 'Club admin aligns bookings with squad training so parents get one clear invite and payment link.',
      },
    ],
  }
}

type Props = {
  swimmer: ClubSwimmer
  /** When true, panel is first inside **Details** — no top divider. */
  suppressTopBorder?: boolean
}

/**
 * SPARTA II / state report — purchase guidance, state report explainer, nearby (prototype).
 * Lives under the **Details** nav target; **Profile** holds contact, club history, and squad roster.
 */
export function SwimmerPathwayRecommendationsPanel({ swimmer, suppressTopBorder }: Props) {
  const { teamProfile } = useApp()
  const state = teamProfile?.state ?? 'NSW'
  const homePool = teamProfile?.homePool
  const nearby = nearbyScreeningBlurb(state)
  const pathwayLabel = PATHWAY_STAGES.find((p) => p.id === swimmer.pathwayStageId)?.label ?? swimmer.pathwayStageId
  const eligible = isSpartaEligible(swimmer)
  const sp = swimmer.spartaII

  return (
    <div className={`space-y-5 ${suppressTopBorder ? '' : 'border-t border-border/60 pt-6 mt-6'}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
          SPARTA II &amp; state pathway
        </h3>
      </div>


      <div className="rounded-[var(--radius-card)] border border-premium/30 bg-premium/5 p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-premium/15 text-premium">
            <FlaskConical className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="font-display text-base font-semibold text-text-primary">Current status</p>
            <p className="mt-0.5 text-sm font-medium text-accent">{spartaPrimaryLabel(swimmer)}</p>
            <p className="mt-2 text-sm text-text-secondary">
              <span className="text-text-muted">Squad:</span> {swimmer.className ?? '—'} ·{' '}
              <span className="text-text-muted">Pathway:</span> {pathwayLabel}
            </p>
            {swimmer.stateInsightNote && (
              <p className="mt-3 rounded-lg border border-border/80 bg-card/80 px-3 py-2 text-sm leading-relaxed text-text-secondary">
                <span className="font-medium text-text-primary">State / pathway note: </span>
                {swimmer.stateInsightNote}
              </p>
            )}
          </div>
        </div>
      </div>

      {!eligible && (
        <div className="rounded-[var(--radius-card)] border border-border/80 bg-bg-elevated/40 p-4">
          <p className="font-medium text-text-primary">Not on this pathway yet</p>
          <p className="mt-1 text-sm text-text-secondary">
            SPARTA II and state report recommendations apply to active junior squad and competitive swimmers.
          </p>
        </div>
      )}

      {eligible && (
        <>
          <div className="rounded-[var(--radius-card)] border border-border/80 bg-bg-elevated/30 p-4">
            <div className="flex items-center gap-2 text-text-primary">
              <ShoppingBag className="h-5 w-5 text-accent shrink-0" aria-hidden />
              <p className="font-display text-base font-semibold">Recommended next steps</p>
            </div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-text-secondary">
              {(!sp || !sp.testCompleted) && (
                <li>
                  Book <strong className="text-text-primary">SPARTA II screening (as an example)</strong> when your state block opens —
                  purchased via the club HP catalogue so coaches can plan squad attendance.
                </li>
              )}
              {sp?.testCompleted && !sp.reportReceived && (
                <li>
                  The <strong className="text-text-primary">individual pathway report</strong> is parent-purchasable — promote it to families; once they buy it, you can view it as their coach (after screening data is ready).
                </li>
              )}
              {sp?.testCompleted && sp.reportReceived && (
                <li>
                  Screening and state report are <strong className="text-text-primary">on file</strong>. Rebook when your
                  pathway lead advises the next window (e.g. before major state meets).
                </li>
              )}
            </ul>
            <p className="mt-2 text-xs text-text-muted leading-relaxed">
              <strong className="font-medium text-text-secondary">Prototype scenario:</strong> imagine you’re in a meeting with the Swimming Australia CEO, walking through how a club coach promotes national HP services — club admins curate which products appear in squad planning, coaches see them in context with their athletes, and parents get a clear payment path from the club (no live checkout in this demo).
            </p>
          </div>

          <div className="rounded-[var(--radius-card)] border border-border/80 bg-bg-elevated/30 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-2 text-text-primary">
                <FileText className="h-5 w-5 shrink-0 text-accent mt-0.5" aria-hidden />
                <div>
                  <p className="font-display text-base font-semibold">Individual pathway report</p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    One report per swimmer — written for the athlete’s goals, not a generic state bulletin.
                  </p>
                </div>
              </div>
              {sp?.reportReceived ? (
                <span className="shrink-0 rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-success">
                  Purchased — coach can view
                </span>
              ) : (
                <span className="shrink-0 rounded-full border border-border bg-bg-elevated/80 px-2.5 py-1 text-xs font-semibold text-text-muted">
                  Not purchased
                </span>
              )}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              This is a <strong className="text-text-primary">player-centred</strong> document: it ties screening and pathway
              data to what <em>this</em> swimmer is working toward (meets, progression, focus strokes) — distinct from broad
              state-level messaging aimed at clubs.
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              <strong className="text-text-primary">Promote to parents</strong> as an optional catalogue item. Families
              complete payment; after purchase, the report is attached to this athlete profile and{' '}
              <strong className="text-text-primary">you as coach can open it</strong> for session planning and
              conversations (parents keep their copy too — prototype).
            </p>
            {sp?.reportReceived && (
              <p className="mt-2 text-xs text-text-muted">
                Delivered digitally when screening data is finalised; optional pathway briefing windows still apply at state
                level (prototype).
              </p>
            )}
          </div>

          <div className="rounded-[var(--radius-card)] border border-border/80 bg-bg-elevated/30 p-4">
            <div className="flex items-center gap-2 text-text-primary">
              <MapPin className="h-5 w-5 text-accent shrink-0" aria-hidden />
              <p className="font-display text-base font-semibold">{nearby.heading}</p>
            </div>
            {homePool && (
              <p className="mt-2 text-sm text-text-secondary">
                <span className="text-text-muted">Your club’s home pool:</span> {homePool}
              </p>
            )}
            <ul className="mt-3 space-y-3">
              {nearby.items.map((item) => (
                <li key={item.title} className="border-b border-border/60 pb-3 last:border-0 last:pb-0">
                  <p className="font-medium text-text-primary">{item.title}</p>
                  <p className="mt-0.5 text-sm text-text-secondary">{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
