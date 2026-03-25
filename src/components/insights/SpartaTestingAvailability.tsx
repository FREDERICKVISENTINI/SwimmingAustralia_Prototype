import type { PathwayStageId } from '../../types/insights'
import { spartaAvailabilityForStage } from '../../data/insightsContent'

type Props = { stageId: PathwayStageId }

export function SpartaTestingAvailability({ stageId }: Props) {
  const { showBookingTable, slots, note } = spartaAvailabilityForStage(stageId)

  return (
    <section
      className="rounded-[var(--radius-card)] border border-accent/25 bg-accent/[0.06] p-5 shadow-[var(--shadow-card)]"
      aria-labelledby="sparta-availability-heading"
    >
      <h3
        id="sparta-availability-heading"
        className="font-display text-base font-semibold text-text-primary"
      >
        SPARTA II testing availability
      </h3>
      <p className="mt-2 text-sm text-text-secondary">
        High-performance screening slots (example). Shown under Expert Outputs so parents and coaches can align assessments,
        SPARTA bookings, and pathway reports in one place.
      </p>

      {showBookingTable ? (
        <div className="mt-4 overflow-x-auto rounded-lg border border-border/80 bg-card">
          <table className="w-full min-w-[280px] text-sm">
            <thead>
              <tr className="border-b border-border/80 bg-bg-elevated/50 text-left text-xs uppercase tracking-wider text-text-muted">
                <th className="px-4 py-3">Window</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3 text-right">Places left</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((row) => (
                <tr key={row.id} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-3 font-medium text-text-primary">{row.window}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.location}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-text-primary">{row.placesRemaining}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-4 text-sm text-text-muted">{note}</p>
      )}

      {showBookingTable ? (
        <p className="mt-3 text-xs text-text-muted">{note}</p>
      ) : null}
    </section>
  )
}
