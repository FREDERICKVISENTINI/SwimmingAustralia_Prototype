import { NATIONAL_PARTICIPATION_BY_STATE } from '../../../data/federationNationalDashboard'
import { AustraliaShareChoroplethMap } from './AustraliaShareChoroplethMap'

const STATE_LABEL: Record<string, string> = {
  NSW: 'New South Wales',
  VIC: 'Victoria',
  QLD: 'Queensland',
  WA: 'Western Australia',
  SA: 'South Australia',
  TAS: 'Tasmania',
  ACT: 'Australian Capital Territory',
  NT: 'Northern Territory',
}

/** Same source as Federation dashboard “Participation by state” — sorted by volume. */
const stateRows = [...NATIONAL_PARTICIPATION_BY_STATE]
  .sort((a, b) => b.swimmers - a.swimmers)
  .map((r) => ({
    name: STATE_LABEL[r.state] ?? r.state,
    value: r.swimmers.toLocaleString('en-AU'),
    share: `${r.sharePct.toFixed(1)}%`,
  }))

/** Australia map from @svg-maps/australia (state/territory paths); styled in asset. */
export function NationalReachCard() {
  return (
    <section className="rounded-[var(--radius-card)] border border-border/80 bg-card p-5 shadow-[var(--shadow-card)] md:p-6">
      <div className="mb-5">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-text-primary md:text-[1.75rem]">
          National reach
        </h2>
        <p className="mt-1 text-sm text-text-muted">Swimmer distribution by state</p>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_1fr]">
        <div className="rounded-[22px] bg-bg-elevated/60 p-4">
          <AustraliaShareChoroplethMap className="mx-auto h-auto w-full max-w-[min(100%,420px)] drop-shadow-[0_10px_28px_-10px_rgba(0,60,100,0.18)]" />
          <p className="mt-2 text-center text-[0.65rem] text-text-muted">
            Darker = higher national share · figures match table (demo data)
          </p>
        </div>

        <div className="rounded-[22px] bg-bg-elevated/60 p-4">
          <div className="space-y-3">
            {stateRows.map((row, i) => (
              <div
                key={row.name}
                className="flex items-center justify-between rounded-2xl border border-border/60 bg-card px-4 py-3 shadow-[var(--shadow-card)]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent">
                    {i + 1}
                  </div>
                  <span className="truncate text-sm font-medium text-text-secondary">{row.name}</span>
                </div>

                <div className="ml-2 flex shrink-0 items-center gap-3">
                  <span className="text-sm font-semibold tabular-nums text-text-primary">{row.value}</span>
                  <span className="text-sm text-text-muted">{row.share}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs leading-5 text-text-muted">
            Geographic spread shows where sponsor activation can be national, regional, or hyper-local.
          </p>
        </div>
      </div>
    </section>
  )
}
