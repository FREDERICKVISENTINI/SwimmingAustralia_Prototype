import type { ClubSwimmer } from '../../types/club'

type Props = {
  swimmer: ClubSwimmer
  /** Profile: contact, details, club history. */
  onView?: (s: ClubSwimmer) => void
  /** Details section on swimmer detail page. */
  onViewDetails?: (s: ClubSwimmer) => void
}

export function ClubSwimmerRow({ swimmer, onView, onViewDetails }: Props) {
  const name = `${swimmer.firstName} ${swimmer.lastName}`
  return (
    <tr className="border-b border-border/70 last:border-0">
      <td className="px-4 py-3 font-medium text-text-primary">{name}</td>
      <td className="px-4 py-3 text-sm text-text-secondary">{swimmer.ageGroup}</td>
      <td className="px-4 py-3 text-sm text-text-secondary">{swimmer.className ?? '—'}</td>
      <td className="px-4 py-3 text-sm text-text-secondary">{swimmer.pathwayStageId.replace(/-/g, ' ')}</td>
      <td className="px-4 py-3 text-sm text-text-secondary">{swimmer.attendanceStatus}</td>
      <td className="px-4 py-3 text-sm text-text-secondary">{swimmer.latestStatDate ?? '—'}</td>
      <td className="pl-2 pr-4 py-3">
        <div className="flex flex-wrap justify-start gap-3">
          {onView && (
            <button
              type="button"
              onClick={() => onView(swimmer)}
              className="text-sm font-medium text-accent hover:underline"
            >
              Profile
            </button>
          )}
          {onViewDetails && (
            <button
              type="button"
              onClick={() => onViewDetails(swimmer)}
              className="text-sm font-medium text-accent hover:underline"
            >
              Details
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}
