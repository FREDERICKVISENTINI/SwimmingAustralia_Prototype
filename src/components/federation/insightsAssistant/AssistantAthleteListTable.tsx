import type { RecommendationAthlete } from '../../../types/insightsAssistant'

type Props = {
  athletes: RecommendationAthlete[]
  startRank: number
}

export function AssistantAthleteListTable({ athletes, startRank }: Props) {
  return (
    <div className="max-h-[min(70vh,520px)] overflow-auto rounded-lg border border-border/60">
      <table className="w-full min-w-[720px] border-collapse text-left text-xs">
        <thead className="sticky top-0 z-10 bg-bg-elevated/95 backdrop-blur-sm">
          <tr className="border-b border-border/60 text-[0.65rem] font-semibold uppercase tracking-wider text-text-muted">
            <th className="px-2 py-2 pl-3">#</th>
            <th className="px-2 py-2">Athlete</th>
            <th className="px-2 py-2">Age</th>
            <th className="px-2 py-2">State</th>
            <th className="px-2 py-2">Club</th>
            <th className="px-2 py-2">Pathway</th>
            <th className="px-2 py-2">Signal</th>
            <th className="px-2 py-2 pr-3">Detail</th>
          </tr>
        </thead>
        <tbody>
          {athletes.map((a, i) => (
            <tr
              key={a.id}
              className="border-b border-border/40 odd:bg-card/40 hover:bg-bg-elevated/50"
            >
              <td className="whitespace-nowrap px-2 py-1.5 pl-3 tabular-nums text-text-muted">{startRank + i}</td>
              <td className="px-2 py-1.5 font-medium text-text-primary">{a.name}</td>
              <td className="whitespace-nowrap px-2 py-1.5 tabular-nums text-text-secondary">{a.age}</td>
              <td className="whitespace-nowrap px-2 py-1.5 text-text-secondary">{a.state}</td>
              <td className="max-w-[140px] truncate px-2 py-1.5 text-text-secondary" title={a.club}>
                {a.club}
              </td>
              <td className="max-w-[120px] truncate px-2 py-1.5 text-text-muted" title={a.pathwayStage}>
                {a.pathwayStage}
              </td>
              <td className="whitespace-nowrap px-2 py-1.5">
                {a.signalBasis && (
                  <span
                    className={`inline-block rounded px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase ${
                      a.signalBasis === 'hp'
                        ? 'bg-premium/15 text-premium'
                        : a.signalBasis === 'meet'
                          ? 'bg-accent/15 text-accent'
                          : a.signalBasis === 'risk'
                            ? 'bg-amber-500/15 text-amber-800 dark:text-amber-200'
                            : 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-200'
                    }`}
                  >
                    {a.signalBasis === 'hp'
                      ? 'HP'
                      : a.signalBasis === 'meet'
                        ? 'Meet'
                        : a.signalBasis === 'risk'
                          ? 'Risk'
                          : 'Results'}
                  </span>
                )}
              </td>
              <td className="max-w-md px-2 py-1.5 pr-3 text-text-secondary">
                <span className="line-clamp-2">{a.performanceNote}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
