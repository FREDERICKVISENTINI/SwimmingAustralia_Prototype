import { useState, useRef } from 'react'
import type { ClubEvent, EventType, EventStatus, SwimClass } from '../../types/club'

type FormValues = Omit<ClubEvent, 'id' | 'createdAt'>

type Props = {
  initial?: Partial<FormValues>
  squads: SwimClass[]
  homePool?: string
  onSave: (values: FormValues) => void
  onCancel: () => void
  saving?: boolean
}

const inputClass =
  'w-full rounded-[var(--radius-button)] border border-border bg-bg-elevated px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent'

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: 'training-session', label: 'Training Session' },
  { value: 'meet', label: 'Meet' },
  { value: 'clinic', label: 'Clinic' },
  { value: 'testing-day', label: 'Testing Day' },
]

const STATUS_OPTIONS: { value: EventStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'cancelled', label: 'Cancelled' },
]

export function EventForm({ initial, squads, homePool, onSave, onCancel, saving = false }: Props) {
  const defaultValues: FormValues = {
    title: '',
    eventType: 'training-session',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    squadId: null,
    squadName: null,
    capacity: 20,
    registrationCutoff: '',
    status: 'published',
    coachName: '',
    ...initial,
  }

  const isHomePool = !!homePool && !!defaultValues.location && defaultValues.location === homePool
  const [useHomePool, setUseHomePool] = useState(isHomePool)
  const [location, setLocation] = useState(defaultValues.location)
  const locationRef = useRef<HTMLInputElement>(null)

  function handleHomePoolToggle(checked: boolean) {
    setUseHomePool(checked)
    if (checked && homePool) {
      setLocation(homePool)
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const squadId = (fd.get('squadId') as string) || null
    const squad = squads.find((s) => s.id === squadId)
    onSave({
      title: (fd.get('title') as string).trim(),
      eventType: fd.get('eventType') as EventType,
      description: (fd.get('description') as string).trim(),
      date: fd.get('date') as string,
      startTime: fd.get('startTime') as string,
      endTime: fd.get('endTime') as string,
      location: location.trim(),
      squadId,
      squadName: squad?.name ?? null,
      capacity: Number(fd.get('capacity')) || 20,
      registrationCutoff: fd.get('registrationCutoff') as string,
      status: fd.get('status') as EventStatus,
      coachName: (fd.get('coachName') as string).trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label className="mb-1 block text-sm font-medium text-text-secondary">Title *</label>
        <input name="title" required defaultValue={defaultValues.title} placeholder="e.g. Junior Squad Training" className={inputClass} />
      </div>

      {/* Type + Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">Event type *</label>
          <select name="eventType" defaultValue={defaultValues.eventType} className={inputClass}>
            {EVENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">Status *</label>
          <select name="status" defaultValue={defaultValues.status} className={inputClass}>
            {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="mb-1 block text-sm font-medium text-text-secondary">Description</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={defaultValues.description}
          placeholder="What should attendees know?"
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Date + Times */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">Date *</label>
          <input name="date" type="date" required defaultValue={defaultValues.date} className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">Start time *</label>
          <input name="startTime" type="time" required defaultValue={defaultValues.startTime} className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">End time *</label>
          <input name="endTime" type="time" required defaultValue={defaultValues.endTime} className={inputClass} />
        </div>
      </div>

      {/* Location */}
      <div>
        <div className="mb-1.5 flex items-center justify-between gap-4">
          <label className="text-sm font-medium text-text-secondary">Location *</label>
          {homePool && (
            <label className="flex cursor-pointer items-center gap-2 text-sm text-text-secondary select-none">
              <input
                type="checkbox"
                checked={useHomePool}
                onChange={(e) => handleHomePoolToggle(e.target.checked)}
                className="h-4 w-4 rounded border-border text-accent accent-[var(--color-accent)] focus:ring-accent"
              />
              <span>
                Home pool
                <span className="ml-1.5 text-xs text-text-muted">({homePool})</span>
              </span>
            </label>
          )}
        </div>
        <input
          ref={locationRef}
          name="location"
          required
          value={location}
          onChange={(e) => {
            setLocation(e.target.value)
            if (useHomePool) setUseHomePool(false)
          }}
          placeholder="Pool name or address"
          className={inputClass}
          readOnly={useHomePool}
        />
      </div>

      {/* Squad + Capacity + Cutoff */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">Squad (optional)</label>
          <select name="squadId" defaultValue={defaultValues.squadId ?? ''} className={inputClass}>
            <option value="">Open to all</option>
            {squads.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">Capacity *</label>
          <input name="capacity" type="number" min={1} required defaultValue={defaultValues.capacity} className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">Registration cutoff *</label>
          <input name="registrationCutoff" type="date" required defaultValue={defaultValues.registrationCutoff} className={inputClass} />
        </div>
      </div>

      {/* Coach */}
      <div>
        <label className="mb-1 block text-sm font-medium text-text-secondary">Coach name *</label>
        <input name="coachName" required defaultValue={defaultValues.coachName} placeholder="e.g. Mike Torres" className={inputClass} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 border-t border-border/60 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="rounded-[var(--radius-button)] bg-accent px-5 py-2 text-sm font-semibold text-bg transition hover:bg-accent-bright disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save event'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-[var(--radius-button)] border border-border px-5 py-2 text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
