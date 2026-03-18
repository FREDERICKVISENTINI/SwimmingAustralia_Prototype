import type { ClubInfo } from '../../types/insights'

type Props = { club: ClubInfo }

export function ClubSummaryCard({ club }: Props) {
  if (!club) return null

  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <p className="text-xs font-medium uppercase tracking-wider text-accent">
        Your club
      </p>
      <h3 className="mt-2 font-display text-xl font-semibold text-text-primary">
        {club.name}
      </h3>
      <p className="mt-2 text-sm text-text-secondary">{club.summary}</p>
      <p className="mt-2 text-sm text-text-muted">{club.role}</p>
      <p className="mt-4 text-sm italic text-text-secondary">{club.message}</p>

      <div className="mt-5 border-t border-border pt-4">
        <h4 className="text-sm font-semibold text-text-primary">Upcoming</h4>
        <ul className="mt-2 space-y-2">
          {club.upcomingEvents.map((e) => (
            <li key={e.id} className="flex justify-between gap-2 text-sm text-text-secondary">
              <span>{e.title}</span>
              <span className="text-text-muted">{e.date}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-semibold text-text-primary">Opportunities</h4>
        <p className="mt-1 text-sm text-text-secondary">
          {club.opportunities.join(' · ')}
        </p>
      </div>
    </div>
  )
}
