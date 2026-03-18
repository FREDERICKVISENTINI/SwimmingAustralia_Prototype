import { useState, useRef, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import type { ClubSwimmer } from '../../types/club'
import type { StatUploadSource } from '../../types/club'

const EVENT_OPTIONS = ['50m Freestyle', '100m Freestyle', '50m Backstroke', '100m Backstroke', '50m Breaststroke', '100m Breaststroke', '50m Butterfly', '100m Butterfly', '200m IM', '400m Freestyle', '800m Freestyle', '1500m Freestyle', 'Attendance %', 'Technique note', 'Starts / turns', 'Other']
const SOURCE_OPTIONS: { value: StatUploadSource; label: string }[] = [
  { value: 'meet-result', label: 'Meet result' },
  { value: 'training-observation', label: 'Training observation' },
  { value: 'assessment', label: 'Assessment' },
  { value: 'manual-entry', label: 'Manual entry' },
]

const ACCEPT_FILE = 'image/*,.pdf,.csv'
const MAX_FILE_MB = 10

type UploadTab = 'team' | 'individual'

type Props = {
  open: boolean
  onClose: () => void
  swimmers: ClubSwimmer[]
  preselectedSwimmer?: ClubSwimmer | null
  /** When opening, show this tab first (e.g. 'team' for meet/squad uploads). */
  initialTab?: UploadTab
  onSave: (payload: { swimmerId: string; swimmerName: string; date: string; eventMetric: string; value: string; coachNotes?: string; source: StatUploadSource; attachment?: File }) => void
  onSaveTeam?: (payload: { date: string; eventMetric: string; value: string; notes?: string; attachment?: File }) => void
}

export function UploadStatsModal({
  open,
  onClose,
  swimmers,
  preselectedSwimmer,
  initialTab,
  onSave,
  onSaveTeam,
}: Props) {
  const [tab, setTab] = useState<UploadTab>(initialTab ?? 'individual')
  useEffect(() => {
    if (open && initialTab) setTab(initialTab)
  }, [open, initialTab])
  const [swimmerId, setSwimmerId] = useState(preselectedSwimmer?.id ?? '')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [eventMetric, setEventMetric] = useState('')
  const [value, setValue] = useState('')
  const [coachNotes, setCoachNotes] = useState('')
  const [source, setSource] = useState<StatUploadSource>('manual-entry')
  const [attachment, setAttachment] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [teamDate, setTeamDate] = useState(new Date().toISOString().slice(0, 10))
  const [teamMetric, setTeamMetric] = useState('')
  const [teamValue, setTeamValue] = useState('')
  const [teamNotes, setTeamNotes] = useState('')
  const [teamAttachment, setTeamAttachment] = useState<File | null>(null)
  const teamFileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmitIndividual = (e: React.FormEvent) => {
    e.preventDefault()
    const swimmer = swimmers.find((s) => s.id === swimmerId)
    if (!swimmer || !eventMetric.trim() || !value.trim()) return
    onSave({
      swimmerId: swimmer.id,
      swimmerName: `${swimmer.firstName} ${swimmer.lastName}`,
      date,
      eventMetric,
      value: value.trim(),
      coachNotes: coachNotes.trim() || undefined,
      source,
      attachment: attachment ?? undefined,
    })
    setEventMetric('')
    setValue('')
    setCoachNotes('')
    setAttachment(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    onClose()
  }

  const handleSubmitTeam = (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamMetric.trim() || !teamValue.trim()) return
    if (onSaveTeam) {
      onSaveTeam({
        date: teamDate,
        eventMetric: teamMetric.trim(),
        value: teamValue.trim(),
        notes: teamNotes.trim() || undefined,
        attachment: teamAttachment ?? undefined,
      })
      setTeamMetric('')
      setTeamValue('')
      setTeamNotes('')
      setTeamAttachment(null)
      if (teamFileInputRef.current) teamFileInputRef.current.value = ''
      onClose()
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Upload stats">
      <div className="border-b border-border mb-4 -mx-5 px-5">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setTab('team')}
            className={`rounded-t-[var(--radius-button)] px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === 'team'
                ? 'bg-bg-elevated text-text-primary border border-border border-b-0 -mb-px'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Team stats
          </button>
          <button
            type="button"
            onClick={() => setTab('individual')}
            className={`rounded-t-[var(--radius-button)] px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === 'individual'
                ? 'bg-bg-elevated text-text-primary border border-border border-b-0 -mb-px'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Individual stats
          </button>
        </div>
      </div>

      {tab === 'team' && (
        <form onSubmit={handleSubmitTeam} className="space-y-4 p-5 md:p-6 pt-0">
          <p className="text-sm text-text-secondary">
            Record squad- or session-level data: attendance, averages, or session notes. Optionally attach a photo of the timesheet or results.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-text-muted">Date</label>
              <input
                type="date"
                value={teamDate}
                onChange={(e) => setTeamDate(e.target.value)}
                className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-text-muted">Metric</label>
              <select
                value={teamMetric}
                onChange={(e) => setTeamMetric(e.target.value)}
                className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                required
              >
                <option value="">Select metric</option>
                <option value="Session attendance">Session attendance</option>
                <option value="Squad average">Squad average</option>
                <option value="Session notes">Session notes</option>
                <option value="Squad size">Squad size</option>
                <option value="Drill completion">Drill completion</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">Value</label>
            <input
              type="text"
              value={teamValue}
              onChange={(e) => setTeamValue(e.target.value)}
              placeholder="e.g. 85%, 12/14, or 28.5s avg"
              className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">Notes</label>
            <textarea
              value={teamNotes}
              onChange={(e) => setTeamNotes(e.target.value)}
              rows={2}
              placeholder="Optional session or squad notes"
              className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">Attach image or file</label>
            <p className="mb-2 text-xs text-text-muted">Photo of timesheet, PDF results, or CSV. Max {MAX_FILE_MB}MB.</p>
            <input
              ref={teamFileInputRef}
              type="file"
              accept={ACCEPT_FILE}
              onChange={(e) => setTeamAttachment(e.target.files?.[0] ?? null)}
              className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-sm text-text-primary file:mr-3 file:rounded file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-bg"
            />
            {teamAttachment && (
              <p className="mt-1.5 text-xs text-text-secondary">Selected: {teamAttachment.name}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            <button
              type="submit"
              disabled={!onSaveTeam}
              className="rounded-[var(--radius-button)] bg-accent px-4 py-2 text-sm font-medium text-bg disabled:opacity-50"
            >
              Save team stats
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-[var(--radius-button)] border border-border px-4 py-2 text-sm font-medium text-text-secondary hover:bg-bg-elevated"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {tab === 'individual' && (
        <form onSubmit={handleSubmitIndividual} className="space-y-4 p-5 md:p-6 pt-0">
          <p className="text-sm text-text-secondary">
            Log a single swimmer&apos;s result: meet time, training observation, or assessment. You can attach a photo of the result slip or timesheet.
          </p>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">Swimmer</label>
            <select
              value={swimmerId}
              onChange={(e) => setSwimmerId(e.target.value)}
              className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              required
            >
              <option value="">Select swimmer</option>
              {swimmers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName} · {s.className ?? 'No class'}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-text-muted">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-text-muted">Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as StatUploadSource)}
                className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              >
                {SOURCE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">Event / metric</label>
            <select
              value={eventMetric}
              onChange={(e) => setEventMetric(e.target.value)}
              className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              required
            >
              <option value="">Select event or metric</option>
              {EVENT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">Value / time</label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g. 42.15, 1:04.22, or note"
              className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">Coach notes</label>
            <textarea
              value={coachNotes}
              onChange={(e) => setCoachNotes(e.target.value)}
              rows={2}
              placeholder="Optional context or feedback"
              className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">Attach image or file</label>
            <p className="mb-2 text-xs text-text-muted">Photo of result slip, timesheet, or PDF. Max {MAX_FILE_MB}MB.</p>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPT_FILE}
              onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
              className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-sm text-text-primary file:mr-3 file:rounded file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-bg"
            />
            {attachment && (
              <p className="mt-1.5 text-xs text-text-secondary">Selected: {attachment.name}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            <button
              type="submit"
              className="rounded-[var(--radius-button)] bg-accent px-4 py-2 text-sm font-medium text-bg"
            >
              Save upload
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-[var(--radius-button)] border border-border px-4 py-2 text-sm font-medium text-text-secondary hover:bg-bg-elevated"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}
