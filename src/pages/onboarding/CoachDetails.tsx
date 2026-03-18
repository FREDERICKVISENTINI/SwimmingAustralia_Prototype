import { Card } from '../../components/ui/Card'
import type { CoachProfile } from '../../context/AppContext'

const STATES = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA']

const ACCREDITATION_LEVELS = [
  'Foundation',
  'Development',
  'Performance',
  'High Performance',
]

type Props = {
  data: Partial<CoachProfile>
  onChange: (data: Partial<CoachProfile>) => void
  onNext: () => void
}

export function CoachDetails({ data, onChange, onNext }: Props) {
  return (
    <Card>
      <h2 className="font-display text-xl font-semibold text-text-primary">
        Coach details
      </h2>
      <p className="mt-1 text-sm text-text-muted">
        Tell us about your coaching role. (Demo: you can skip and continue.)
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
            Full name
          </label>
          <input
            type="text"
            value={data.fullName ?? ''}
            onChange={(e) => onChange({ ...data, fullName: e.target.value })}
            className="w-full rounded-[var(--radius-button)] border border-border bg-bg-elevated px-3 py-2 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">
            Coaching organisation / club
          </label>
          <input
            type="text"
            value={data.organisation ?? ''}
            onChange={(e) => onChange({ ...data, organisation: e.target.value })}
            className="w-full rounded-[var(--radius-button)] border border-border bg-bg-elevated px-3 py-2 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="e.g. City Swimming Club"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">
            Role title
          </label>
          <input
            type="text"
            value={data.roleTitle ?? ''}
            onChange={(e) => onChange({ ...data, roleTitle: e.target.value })}
            className="w-full rounded-[var(--radius-button)] border border-border bg-bg-elevated px-3 py-2 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="e.g. Head Coach, Squad Coach"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">
            State
          </label>
          <select
            value={data.state ?? ''}
            onChange={(e) => onChange({ ...data, state: e.target.value })}
            className="w-full rounded-[var(--radius-button)] border border-border bg-bg-elevated px-3 py-2 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">Select</option>
            {STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">
            Accreditation level
          </label>
          <select
            value={data.accreditationLevel ?? ''}
            onChange={(e) => onChange({ ...data, accreditationLevel: e.target.value })}
            className="w-full rounded-[var(--radius-button)] border border-border bg-bg-elevated px-3 py-2 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">Select</option>
            {ACCREDITATION_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
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
