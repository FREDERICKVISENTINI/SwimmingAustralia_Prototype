import { Card } from '../../components/ui/Card'
import { PATHWAY_STAGES } from '../../theme/tokens'
import type { TeamProfile } from '../../context/AppContext'

const AGE_GROUP_OPTIONS = [
  'Under 8',
  '8–10',
  '10–12',
  '12–14',
  '14–16',
  '16+',
  'All ages',
]

const SWIMMER_VOLUME_BANDS = [
  { value: '1-50', label: '1–50 swimmers' },
  { value: '51-100', label: '51–100 swimmers' },
  { value: '101-200', label: '101–200 swimmers' },
  { value: '201-500', label: '201–500 swimmers' },
  { value: '500+', label: '500+ swimmers' },
]

type Props = {
  data: Partial<TeamProfile>
  onChange: (data: Partial<TeamProfile>) => void
  onNext: () => void
}

export function ClubTeamSetup({ data, onChange, onNext }: Props) {
  return (
    <Card>
      <h2 className="font-display text-xl font-semibold text-text-primary">
        Team setup
      </h2>
      <p className="mt-1 text-sm text-text-muted">
        Help us understand your program scale and focus. (Demo: you can skip and continue.)
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onNext()
        }}
        className="mt-6 space-y-4"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">
            Primary age group focus
          </label>
          <select
            value={data.primaryAgeGroupFocus ?? ''}
            onChange={(e) => onChange({ ...data, primaryAgeGroupFocus: e.target.value })}
            className="w-full rounded-[var(--radius-button)] border border-border bg-bg-elevated px-3 py-2 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">Select</option>
            {AGE_GROUP_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">
            Number of swimmers <span className="text-text-muted font-normal">(optional)</span>
          </label>
          <select
            value={data.numberOfSwimmers ?? ''}
            onChange={(e) => onChange({ ...data, numberOfSwimmers: e.target.value })}
            className="w-full rounded-[var(--radius-button)] border border-border bg-bg-elevated px-3 py-2 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">Select range</option>
            {SWIMMER_VOLUME_BANDS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">
            Primary pathway stage served
          </label>
          <select
            value={data.primaryPathwayStageServed ?? ''}
            onChange={(e) => onChange({ ...data, primaryPathwayStageServed: e.target.value })}
            className="w-full rounded-[var(--radius-button)] border border-border bg-bg-elevated px-3 py-2 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">Select</option>
            {PATHWAY_STAGES.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">
            Description <span className="text-text-muted">(optional)</span>
          </label>
          <textarea
            value={data.description ?? ''}
            onChange={(e) => onChange({ ...data, description: e.target.value })}
            rows={3}
            className="w-full rounded-[var(--radius-button)] border border-border bg-bg-elevated px-3 py-2 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Short description of your program"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-[var(--radius-button)] bg-accent px-4 py-2.5 font-medium text-bg transition-colors hover:bg-accent-bright"
        >
          Continue
        </button>
      </form>
    </Card>
  )
}
