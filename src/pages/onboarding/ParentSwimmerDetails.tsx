import { Card } from '../../components/ui/Card'
import type { SwimmerProfile } from '../../context/AppContext'

type Props = {
  data: Partial<SwimmerProfile>
  onChange: (data: Partial<SwimmerProfile>) => void
  onNext: () => void
}

const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say']
const STATES = [
  'ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA',
]

export function ParentSwimmerDetails({ data, onChange, onNext }: Props) {
  return (
    <Card>
      <h2 className="font-display text-xl font-semibold text-text-primary">
        Swimmer details
      </h2>
      <p className="mt-1 text-sm text-text-muted">
        Tell us about your child. (Demo: you can skip and continue.)
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onNext()
        }}
        className="mt-6 space-y-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-text-secondary">
              First name
            </label>
            <input
              type="text"
              value={data.firstName ?? ''}
              onChange={(e) => onChange({ ...data, firstName: e.target.value })}
              className="w-full rounded-[var(--radius-button)] border border-border bg-bg-elevated px-3 py-2 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="First name"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text-secondary">
              Last name
            </label>
            <input
              type="text"
              value={data.lastName ?? ''}
              onChange={(e) => onChange({ ...data, lastName: e.target.value })}
              className="w-full rounded-[var(--radius-button)] border border-border bg-bg-elevated px-3 py-2 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="Last name"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">
            Date of birth
          </label>
          <input
            type="date"
            value={data.dateOfBirth ?? ''}
            onChange={(e) => onChange({ ...data, dateOfBirth: e.target.value })}
            className="w-full rounded-[var(--radius-button)] border border-border bg-bg-elevated px-3 py-2 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">
            Gender
          </label>
          <select
            value={data.gender ?? ''}
            onChange={(e) => onChange({ ...data, gender: e.target.value })}
            className="w-full rounded-[var(--radius-button)] border border-border bg-bg-elevated px-3 py-2 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">Select</option>
            {GENDERS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">
            Current program / club
          </label>
          <input
            type="text"
            value={data.program ?? ''}
            onChange={(e) => onChange({ ...data, program: e.target.value })}
            className="w-full rounded-[var(--radius-button)] border border-border bg-bg-elevated px-3 py-2 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="e.g. City Swimming Club"
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
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">
            Notes <span className="text-text-muted">(optional)</span>
          </label>
          <textarea
            value={data.notes ?? ''}
            onChange={(e) => onChange({ ...data, notes: e.target.value })}
            rows={2}
            className="w-full rounded-[var(--radius-button)] border border-border bg-bg-elevated px-3 py-2 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Any additional information"
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
