import { Card } from '../../components/ui/Card'
import type { SwimmerProfile } from '../../context/AppContext'
import { PATHWAY_STAGES } from '../../theme/tokens'

type Props = {
  profile: Partial<SwimmerProfile> & { pathwayStage?: string; dateOfBirth?: string }
  onCreateProfile: () => void
  onBack: () => void
}

function formatDoB(dob: string) {
  if (!dob) return '—'
  const d = new Date(dob)
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
}

function ageFromDoB(dob: string) {
  if (!dob) return null
  const today = new Date()
  const birth = new Date(dob)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

export function ParentConfirmation({ profile, onCreateProfile, onBack }: Props) {
  const stageLabel =
    PATHWAY_STAGES.find((s) => s.id === profile.pathwayStageId)?.label ?? profile.pathwayStageId ?? '—'
  const age = profile.dateOfBirth ? ageFromDoB(profile.dateOfBirth) : null

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Confirm profile
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          Review and create your swimmer&apos;s profile.
        </p>
      </Card>
      <Card className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
              Name
            </p>
            <p className="font-medium text-text-primary">
              {profile.firstName} {profile.lastName}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
              Age / Date of birth
            </p>
            <p className="font-medium text-text-primary">
              {age != null ? `${age} years` : '—'} · {formatDoB(profile.dateOfBirth ?? '')}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
              Current stage
            </p>
            <p className="font-medium text-success">{stageLabel}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
              Program / club
            </p>
            <p className="font-medium text-text-primary">{profile.program ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
              State
            </p>
            <p className="font-medium text-text-primary">{profile.state ?? '—'}</p>
          </div>
        </div>
        {profile.notes && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
              Notes
            </p>
            <p className="text-text-secondary">{profile.notes}</p>
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
            onClick={onCreateProfile}
            className="flex-1 rounded-[var(--radius-button)] bg-accent px-4 py-2.5 font-medium text-bg transition-colors hover:bg-accent-bright"
          >
            Create profile
          </button>
        </div>
      </Card>
    </div>
  )
}
