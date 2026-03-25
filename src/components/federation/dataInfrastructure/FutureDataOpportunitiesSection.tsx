import {
  FUTURE_DATA_OPPORTUNITIES,
  type FutureCaptureChannel,
} from '../../../data/futureDataOpportunities'

const CHANNEL_LABEL: Record<FutureCaptureChannel, string> = {
  partnership: 'Partnership',
  api: 'API',
  facility_integration: 'Facility integration',
}

const CHANNEL_STYLE: Record<FutureCaptureChannel, string> = {
  partnership: 'border-premium/35 bg-premium/8 text-premium',
  api: 'border-accent/30 bg-accent/10 text-accent',
  facility_integration: 'border-border/80 bg-bg-elevated text-text-secondary',
}

const CHANNEL_ORDER: FutureCaptureChannel[] = ['partnership', 'api', 'facility_integration']

function orderedChannels(channels: FutureCaptureChannel[]) {
  return CHANNEL_ORDER.filter((c) => channels.includes(c))
}

const FUTURE_CARD_CLASS =
  'relative flex h-full min-h-[15.5rem] flex-col rounded-[var(--radius-card)] border border-dashed border-border/65 bg-bg-elevated/30 p-5 shadow-none ring-1 ring-inset ring-border/35 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-border/80 hover:bg-bg-elevated/45 hover:shadow-sm xl:min-h-[16rem]'

export function FutureDataOpportunitiesSection() {
  return (
    <section className="space-y-6 md:space-y-8">
      <div className="max-w-3xl space-y-2">
        <h2 className="font-display text-xl font-semibold tracking-tight text-text-primary md:text-2xl">
          Future Data Opportunities
        </h2>
        <p className="text-sm leading-relaxed text-text-secondary">
          Planned datasets not yet in the platform — what we’re missing, why it matters, and how it could be captured.
        </p>
      </div>

      <div className="grid auto-rows-fr gap-4 md:grid-cols-2 md:gap-5 xl:gap-6">
        {FUTURE_DATA_OPPORTUNITIES.map((item) => (
          <article key={item.id} className={FUTURE_CARD_CLASS}>
            <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-2">
              <h3 className="min-w-0 flex-1 font-display text-[0.9375rem] font-semibold leading-snug tracking-tight text-text-primary">
                {item.name}
              </h3>
              <span className="shrink-0 rounded-full border border-border/70 bg-card/90 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-text-muted">
                Not integrated
              </span>
            </div>

            {item.partnershipRequired && (
              <p className="mt-3">
                <span className="inline-flex rounded-full border border-amber-500/35 bg-amber-500/10 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200/95">
                  Partnership required
                </span>
              </p>
            )}

            <p
              className={`text-sm leading-relaxed text-text-secondary ${item.partnershipRequired ? 'mt-3' : 'mt-4'}`}
            >
              {item.whyItMatters}
            </p>

            <div className="mt-auto border-t border-border/40 pt-5">
              <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-text-muted">
                How it would be captured
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {orderedChannels(item.channels).map((ch) => (
                  <span
                    key={ch}
                    className={`inline-flex rounded-full border px-2.5 py-1 text-[0.7rem] font-medium leading-snug ${CHANNEL_STYLE[ch]}`}
                  >
                    {CHANNEL_LABEL[ch]}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
