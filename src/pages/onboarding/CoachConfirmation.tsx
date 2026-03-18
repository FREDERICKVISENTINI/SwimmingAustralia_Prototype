import { Card } from '../../components/ui/Card'
import { PATHWAY_STAGES } from '../../theme/tokens'
import type { CoachProfile } from '../../context/AppContext'

type Props = {
  profile: Partial<CoachProfile>
  onCreateCoachAccount: () => void
  onBack: () => void
}

export function CoachConfirmation({ profile, onCreateCoachAccount, onBack }: Props) {
  const pathwayLabels =
    profile.pathwayFocus?.length
      ? profile.pathwayFocus
          .map(
            (id) => PATHWAY_STAGES.find((s) => s.id === id)?.label ?? id
          )
          .join(', ')
      : '—'

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Confirm coach account
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          Review and create your coach account.
        </p>
      </Card>
      <Card className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
              Coach name
            </p>
            <p className="font-medium text-text-primary">
              {profile.fullName ?? '—'}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
              Organisation
            </p>
            <p className="font-medium text-text-primary">
              {profile.organisation ?? '—'}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
              Role
            </p>
            <p className="font-medium text-text-primary">
              {profile.roleTitle ?? '—'}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
              Accreditation
            </p>
            <p className="font-medium text-success">
              {profile.accreditationLevel ?? '—'}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
              Pathway focus
            </p>
            <p className="mt-0.5 font-medium text-text-primary">{pathwayLabels}</p>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="rounded-[var(--radius-button)] border border-border bg-transparent px-4 py-2.5 font-medium text-text-secondary transition-colors hover:bg-card hover:text-text-primary"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onCreateCoachAccount}
            className="flex-1 rounded-[var(--radius-button)] bg-accent px-4 py-2.5 font-medium text-bg transition-colors hover:bg-accent-bright"
          >
            Create coach account
          </button>
        </div>
      </Card>
    </div>
  )
}
