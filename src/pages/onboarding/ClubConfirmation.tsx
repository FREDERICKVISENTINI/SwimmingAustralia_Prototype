import { Card } from '../../components/ui/Card'
import { PATHWAY_STAGES } from '../../theme/tokens'
import type { TeamProfile } from '../../context/AppContext'

const SWIMMER_VOLUME_LABELS: Record<string, string> = {
  '1-50': '1–50 swimmers',
  '51-100': '51–100 swimmers',
  '101-200': '101–200 swimmers',
  '201-500': '201–500 swimmers',
  '500+': '500+ swimmers',
}

const ORG_TYPE_LABELS: Record<TeamProfile['organisationType'], string> = {
  club: 'Club',
  'swim school': 'Swim school',
  'squad program': 'Squad program',
  'state program': 'State program',
}

type Props = {
  profile: Partial<TeamProfile>
  onCreateTeamAccount: () => void
  onBack: () => void
}

export function ClubConfirmation({ profile, onCreateTeamAccount, onBack }: Props) {
  const stageLabel =
    PATHWAY_STAGES.find((s) => s.id === profile.primaryPathwayStageServed)?.label ??
    profile.primaryPathwayStageServed ??
    '—'
  const volumeLabel =
    profile.numberOfSwimmers && SWIMMER_VOLUME_LABELS[profile.numberOfSwimmers]
      ? SWIMMER_VOLUME_LABELS[profile.numberOfSwimmers]
      : profile.numberOfSwimmers ?? '—'
  const orgTypeLabel =
    profile.organisationType && ORG_TYPE_LABELS[profile.organisationType]
      ? ORG_TYPE_LABELS[profile.organisationType]
      : profile.organisationType ?? '—'

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Confirm team account
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          Review and create your team account.
        </p>
      </Card>
      <Card className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
              Organisation name
            </p>
            <p className="font-medium text-text-primary">
              {profile.organisationName ?? '—'}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
              Type
            </p>
            <p className="font-medium text-text-primary">{orgTypeLabel}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
              State
            </p>
            <p className="font-medium text-text-primary">{profile.state ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
              Pathway stage served
            </p>
            <p className="font-medium text-success">{stageLabel}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
              Swimmer volume
            </p>
            <p className="font-medium text-text-primary">{volumeLabel}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
              Contact
            </p>
            <p className="font-medium text-text-primary">
              {profile.mainContactName ?? '—'} · {profile.contactEmail ?? '—'}
            </p>
          </div>
        </div>
        {profile.description && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
              Description
            </p>
            <p className="text-text-secondary">{profile.description}</p>
          </div>
        )}
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
            onClick={onCreateTeamAccount}
            className="flex-1 rounded-[var(--radius-button)] bg-accent px-4 py-2.5 font-medium text-bg transition-colors hover:bg-accent-bright"
          >
            Create team account
          </button>
        </div>
      </Card>
    </div>
  )
}
