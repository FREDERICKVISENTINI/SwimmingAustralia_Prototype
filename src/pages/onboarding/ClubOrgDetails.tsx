import { Card } from '../../components/ui/Card'
import type { TeamProfile } from '../../context/AppContext'

const STATES = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA']

const ORG_TYPES: { value: TeamProfile['organisationType']; label: string }[] = [
  { value: 'club', label: 'Club' },
  { value: 'swim school', label: 'Swim school' },
  { value: 'squad program', label: 'Squad program' },
  { value: 'state program', label: 'State program' },
]

type Props = {
  data: Partial<TeamProfile>
  onChange: (data: Partial<TeamProfile>) => void
  onNext: () => void
}

export function ClubOrgDetails({ data, onChange, onNext }: Props) {
  return (
    <Card>
      <h2 className="font-display text-xl font-semibold text-text-primary">
        Organisation details
      </h2>
      <p className="mt-1 text-sm text-text-muted">
        Tell us about your organisation. (Demo: you can skip and continue.)
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
            Organisation name
          </label>
          <input
            type="text"
            value={data.organisationName ?? ''}
            onChange={(e) => onChange({ ...data, organisationName: e.target.value })}
            className="w-full rounded-[var(--radius-button)] border border-border bg-bg-elevated px-3 py-2 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="e.g. City Swimming Club"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">
            Organisation type
          </label>
          <select
            value={data.organisationType ?? ''}
            onChange={(e) =>
              onChange({ ...data, organisationType: e.target.value as TeamProfile['organisationType'] })
            }
            className="w-full rounded-[var(--radius-button)] border border-border bg-bg-elevated px-3 py-2 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">Select</option>
            {ORG_TYPES.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
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
            Main contact name
          </label>
          <input
            type="text"
            value={data.mainContactName ?? ''}
            onChange={(e) => onChange({ ...data, mainContactName: e.target.value })}
            className="w-full rounded-[var(--radius-button)] border border-border bg-bg-elevated px-3 py-2 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Full name"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">
            Contact email
          </label>
          <input
            type="email"
            value={data.contactEmail ?? ''}
            onChange={(e) => onChange({ ...data, contactEmail: e.target.value })}
            className="w-full rounded-[var(--radius-button)] border border-border bg-bg-elevated px-3 py-2 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="contact@example.com"
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
