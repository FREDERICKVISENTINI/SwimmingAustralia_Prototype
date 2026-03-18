import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { ROUTES } from '../routes'
import { PageSection } from '../components/layout/PageSection'
import {
  InsightsTabs,
  InsightPanel,
  ExpertOutputCard,
  EmptyStateCard,
  SubscribeToExpertData,
} from '../components/insights'
import type { InsightsTabId, PathwayStageId } from '../types/insights'
import {
  resolveStageId,
  expertOutputsByStage,
  getInsightCategoriesForFederationSection,
} from '../data/insightsContent'
import { FEDERATION_SECTIONS } from '../data/federationSections'

export function Insights() {
  const { accountType, swimmers, activeSwimmerId, swimmerProfile, setActiveSwimmerId } = useApp()
  const stageId = useMemo(
    (): PathwayStageId => resolveStageId(swimmerProfile?.pathwayStage ?? null),
    [swimmerProfile?.pathwayStage]
  )

  const [activeTab, setActiveTab] = useState<InsightsTabId>('pro-plan-prototype')

  const expertOutputs = expertOutputsByStage[stageId]

  return (
    <PageSection
      title="Insights"
      subtitle="Clear stage-based guidance for swimmer development, progression, and opportunity."
    >
      {swimmers.length > 1 && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-text-muted">Swimmer</label>
          <select
            value={activeSwimmerId ?? ''}
            onChange={(e) => setActiveSwimmerId(e.target.value || null)}
            className="rounded-[var(--radius-button)] border border-border bg-bg-elevated px-3 py-2 text-sm text-text-primary"
          >
            {swimmers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.firstName} {s.lastName}
              </option>
            ))}
          </select>
          <span className="text-sm text-text-muted">
            Results and insights below are for the selected swimmer.
          </span>
        </div>
      )}

      {accountType === 'federation' && (
        <section className="mt-8 space-y-6">
          <h2 className="font-display text-lg font-semibold tracking-tight text-text-primary border-b border-accent/30 pb-2">
            Data & intelligence categories
          </h2>
          <p className="text-sm text-text-muted">
            Categories are grouped under Participation & Growth, Talent Identification, and other sections. Click a category to open its page.
          </p>
          {FEDERATION_SECTIONS.map((section) => {
            const categories = getInsightCategoriesForFederationSection(section.id)
            if (categories.length === 0) return null
            return (
              <div key={section.id}>
                <h3 className="font-display text-base font-semibold text-text-primary mb-2">
                  {section.label}
                </h3>
                <div className="divide-y divide-border/80 rounded-[var(--radius-card)] border border-border/80 bg-card/40 overflow-hidden">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={ROUTES.app.insightCategory(cat.id)}
                      className="block py-3 px-4 text-left transition-colors hover:bg-bg-elevated/60 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-inset"
                    >
                      <span className="font-medium text-text-primary">{cat.title}</span>
                      <p className="mt-0.5 text-sm text-text-secondary leading-relaxed">
                        {cat.description}
                      </p>
                      <span className="mt-1 inline-block text-xs font-medium text-accent">
                        View page →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </section>
      )}

      <div className={accountType === 'federation' ? 'mt-8' : 'mt-6'}>
        <InsightsTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="min-h-[320px]">
        {activeTab === 'subscription' && (
          <InsightPanel id="subscription">
            <div className="space-y-6">
              <section className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <h3 className="font-display text-base font-semibold text-text-primary border-b border-accent/30 pb-2 mb-4">
                  Current plan
                </h3>
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-2xl font-semibold text-text-primary">$29.99</span>
                  <span className="text-sm text-text-muted">/ month</span>
                </div>
                <p className="mt-2 text-sm text-text-secondary">
                  Full access to insights, meet results, expert outputs, and pathway tools. Billed monthly. Cancel anytime.
                </p>
                <button
                  type="button"
                  className="mt-4 rounded-[var(--radius-button)] border border-border bg-bg-elevated px-4 py-2 text-sm font-medium text-text-primary hover:bg-bg-elevated/80 transition-colors"
                >
                  Change plan
                </button>
              </section>
              <section className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <h3 className="font-display text-base font-semibold text-text-primary border-b border-accent/30 pb-2 mb-4">
                  Payment method
                </h3>
                <div className="flex items-center justify-between gap-4 rounded-[var(--radius-button)] border border-border bg-bg-elevated/50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg text-text-muted" aria-hidden>••••</span>
                    <div>
                      <p className="text-sm font-medium text-text-primary">Visa ending in 4242</p>
                      <p className="text-xs text-text-muted">Expires 12/26</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-sm font-medium text-accent hover:underline"
                  >
                    Update card
                  </button>
                </div>
                <p className="mt-3 text-xs text-text-muted">
                  Your card is securely saved. We never store your full card number.
                </p>
              </section>
              <section className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <h3 className="font-display text-base font-semibold text-text-primary border-b border-accent/30 pb-2 mb-4">
                  Billing history
                </h3>
                <p className="text-sm text-text-muted">
                  Next billing date: 17 April 2025. View and download past invoices from your account settings.
                </p>
              </section>
            </div>
          </InsightPanel>
        )}

        {activeTab === 'expert-outputs' && accountType !== 'club' && (
          <InsightPanel id="expert-outputs">
            <p className="mb-4 text-sm text-text-muted">
              {accountType === 'federation'
                ? 'Insights based on the federation’s high-performance data — assessments, technique analysis, and performance outputs from national and state systems.'
                : 'Data retrieved from high-performance and assessment systems.'}
            </p>
            <div className="space-y-4">
              <SubscribeToExpertData />
              {expertOutputs.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                  {expertOutputs.map((item) => (
                    <ExpertOutputCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <EmptyStateCard
                  title={accountType === 'federation' ? 'No federation high-performance data yet' : 'No expert data yet'}
                  description={
                    accountType === 'federation'
                      ? 'Insights from the federation’s high-performance systems will appear here — assessments, technique analysis, and performance outputs as they are made available.'
                      : 'Subscribe to expert data to receive assessments, technique analysis, and high-performance outputs here.'
                  }
                />
              )}
            </div>
          </InsightPanel>
        )}

        {activeTab === 'pro-plan-prototype' && (
          <InsightPanel id="pro-plan-prototype">
            <p className="mb-6 text-sm text-text-muted">
              Potential data and capabilities that could be provided in a Pro Plan — not live analytics, but what the platform could deliver to coaches, parents, and the pathway.
            </p>
            <div className="space-y-8">
              <section className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <h3 className="font-display text-base font-semibold text-text-primary border-b border-accent/30 pb-2">
                  Talent identification
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                  <li>Flag athletes showing HP technique signals — not just fastest race times.</li>
                  <li>Separate physical maturity from genuine technique development.</li>
                  <li>Give coaches conviction in decisions they&apos;re currently making by gut feel.</li>
                </ul>
              </section>
              <section className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <h3 className="font-display text-base font-semibold text-text-primary border-b border-accent/30 pb-2">
                  National benchmarking
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                  <li>How does my athlete compare to every equivalent swimmer nationally right now?</li>
                  <li>Changes how coaches write training programs and set parent expectations.</li>
                  <li>No clean way to answer this question currently exists.</li>
                </ul>
              </section>
              <section className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <h3 className="font-display text-base font-semibold text-text-primary border-b border-accent/30 pb-2">
                  Parent communication
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                  <li>Auto-generate progress reports coaches can share with parents.</li>
                  <li>Shows technique trends, pathway position and milestone progress.</li>
                  <li>Takes the hardest conversation in coaching out of their hands.</li>
                </ul>
              </section>
              <section className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <h3 className="font-display text-base font-semibold text-text-primary border-b border-accent/30 pb-2">
                  Session planning
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                  <li>Connect technique data to training load and competition calendar.</li>
                  <li>Link race results back to what was happening in training six weeks prior.</li>
                  <li>Nobody has built this for club-level swimming.</li>
                </ul>
              </section>
              <section className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <h3 className="font-display text-base font-semibold text-text-primary border-b border-accent/30 pb-2">
                  Recruitment
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                  <li>Surface swimmers in their region progressing rapidly but not yet at their club.</li>
                  <li>Especially valuable at transition points — junior squad to competitive club.</li>
                  <li>Coaches are always looking for talent; the platform knows every swimmer&apos;s trajectory.</li>
                </ul>
              </section>
              <section className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <h3 className="font-display text-base font-semibold text-text-primary border-b border-accent/30 pb-2">
                  Accreditation and development
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                  <li>Structured learning modules connected to what they&apos;re seeing in their own athlete data.</li>
                  <li>If three athletes have a weak underwater kick, serve the relevant coaching module.</li>
                  <li>Professional development that&apos;s specific to their squad, not generic.</li>
                </ul>
              </section>
            </div>
          </InsightPanel>
        )}
      </div>
    </PageSection>
  )
}
