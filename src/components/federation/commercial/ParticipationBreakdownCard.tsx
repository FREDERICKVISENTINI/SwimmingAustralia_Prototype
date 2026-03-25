import { Fragment } from 'react'

type FunnelStage = {
  label: string
  value: string
  share: string
  conversion?: string
  widthClass: string
}

const stages: FunnelStage[] = [
  {
    label: 'Learn to Swim',
    value: '235k',
    share: '62%',
    conversion: '62%',
    widthClass: 'w-full',
  },
  {
    label: 'Club',
    value: '110k',
    share: '29%',
    conversion: '53%',
    widthClass: 'w-[78%]',
  },
  {
    label: 'Competitive Pathway',
    value: '25k',
    share: '6%',
    conversion: '23%',
    widthClass: 'w-[54%]',
  },
  {
    label: 'Elite / National',
    value: '10k',
    share: '3%',
    conversion: '40%',
    widthClass: 'w-[32%]',
  },
]

function stageTagline(label: string) {
  if (label === 'Learn to Swim') return 'Top funnel'
  if (label === 'Club') return 'Core base'
  if (label === 'Competitive Pathway') return 'Talent layer'
  return 'Elite depth'
}

export function ParticipationBreakdownCard() {
  return (
    <section className="rounded-[var(--radius-card)] border border-border/80 bg-card p-5 shadow-[var(--shadow-card)] md:p-6">
      <div className="mb-5">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-text-primary md:text-[1.75rem]">
          Participation breakdown
        </h2>
        <p className="mt-1 text-sm text-text-muted">National swimmer distribution across the pathway</p>
      </div>

      <div className="grid grid-cols-1 items-center gap-x-4 gap-y-4 md:grid-cols-[minmax(0,150px)_1fr_minmax(0,72px)] lg:grid-cols-[170px_1fr_88px]">
        {stages.map((stage, i) => (
          <Fragment key={stage.label}>
            <div>
              <div className="text-[15px] font-semibold text-text-primary">{stage.label}</div>
              <div className="mt-1 text-2xl font-semibold leading-none tracking-tight text-text-primary md:text-[28px]">
                {stage.value}
              </div>
              <div className="mt-1 text-sm text-text-muted">{stage.share}</div>
            </div>

            <div className="flex justify-center py-1">
              <div
                className={[
                  'relative min-h-[72px] min-w-[160px] overflow-hidden md:h-[88px] md:min-w-[180px]',
                  stage.widthClass,
                  'bg-gradient-to-r from-accent/10 to-accent/20',
                  i === 0 ? 'rounded-t-[10px] rounded-b-[18px]' : '',
                  i === 1 ? 'rounded-[18px]' : '',
                  i === 2 ? 'rounded-[16px]' : '',
                  i === 3 ? 'rounded-b-[18px] rounded-t-[10px]' : '',
                ].join(' ')}
                style={{
                  clipPath:
                    i === 0
                      ? 'polygon(4% 0%, 96% 0%, 90% 100%, 10% 100%)'
                      : i === 1
                        ? 'polygon(7% 0%, 93% 0%, 85% 100%, 15% 100%)'
                        : i === 2
                          ? 'polygon(10% 0%, 90% 0%, 78% 100%, 22% 100%)'
                          : 'polygon(14% 0%, 86% 0%, 72% 100%, 28% 100%)',
                }}
              >
                <div className="absolute inset-0 border border-accent/20" />
                <div className="absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
                  <div className="text-[13px] font-medium text-accent md:text-[15px]">{stageTagline(stage.label)}</div>
                  <div className="mt-1 text-base font-semibold tracking-tight text-text-primary md:text-[18px]">
                    {stage.value}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 md:flex-row">
              <span className="text-sm text-text-muted">→</span>
              <span className="text-base font-semibold text-accent">{stage.conversion}</span>
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  )
}
