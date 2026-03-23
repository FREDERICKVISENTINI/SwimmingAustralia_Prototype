import type { EventRegistration } from '../../types/club'

type Props = {
  registrations: EventRegistration[]
  capacity: number
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function AttendeeList({ registrations, capacity }: Props) {
  if (registrations.length === 0) {
    return (
      <p className="rounded-[var(--radius-card)] border border-border/60 bg-card px-4 py-8 text-center text-sm text-text-muted">
        No registrations yet.
      </p>
    )
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-card shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between border-b border-border/80 bg-bg-elevated/80 px-4 py-3">
        <p className="text-sm font-semibold text-text-primary">
          Attendees — {registrations.length} / {capacity}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border/60">
              <th className="px-4 py-2.5 font-medium text-text-muted">#</th>
              <th className="px-4 py-2.5 font-medium text-text-muted">Name</th>
              <th className="px-4 py-2.5 font-medium text-text-muted">Registered by</th>
              <th className="px-4 py-2.5 font-medium text-text-muted">Date</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((r, i) => (
              <tr key={r.id} className="border-b border-border/40 last:border-0 hover:bg-bg-elevated/40">
                <td className="px-4 py-2.5 text-text-muted">{i + 1}</td>
                <td className="px-4 py-2.5 font-medium text-text-primary">{r.swimmerName}</td>
                <td className="px-4 py-2.5 capitalize text-text-secondary">{r.registeredBy}</td>
                <td className="px-4 py-2.5 text-text-muted">{fmt(r.registeredAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
