import { useState, useMemo } from 'react'
import { useParams, Navigate, useNavigate, Link } from 'react-router-dom'
import {
  Calendar, Clock, MapPin, Users, Edit2, Trash2, ArrowLeft, CheckCircle2, XCircle, ClipboardCheck,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { PageSection } from '../components/layout/PageSection'
import { AttendeeList } from '../components/events/AttendeeList'
import { EventTypeBadge } from '../components/events/EventTypeBadge'
import { EventStatusBadge } from '../components/events/EventStatusBadge'
import { SpotsRemaining } from '../components/events/SpotsRemaining'
import { Modal } from '../components/ui/Modal'
import { ROUTES } from '../routes'

function fmt(date: string) {
  return new Date(date + 'T12:00:00').toLocaleDateString('en-AU', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}
function fmtTime(t: string) {
  const [h, m] = t.split(':').map(Number)
  const period = h >= 12 ? 'pm' : 'am'
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${period}`
}

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    accountType, clubEvents, eventRegistrations,
    swimmers, updateClubEvent, deleteClubEvent,
    addEventRegistration, removeEventRegistration,
    attendanceRecords, addAttendanceRecord,
  } = useApp()

  const isCoach = accountType === 'club'
  const isParent = accountType === 'parent'

  const [confirmDelete, setConfirmDelete] = useState(false)

  const event = clubEvents.find((e) => e.id === id)
  if (!event) return <Navigate to={ROUTES.app.events} replace />
  if (!isCoach && event.status !== 'published') return <Navigate to={ROUTES.app.events} replace />

  const eventRegs = eventRegistrations.filter((r) => r.eventId === event.id)
  const registered = eventRegs.length
  const remaining = event.capacity - registered
  const isFull = remaining <= 0

  // For parent: which of their swimmers are registered?
  const myRegistrations = isParent
    ? eventRegs.filter((r) => swimmers.some((s) => s.id === r.swimmerId))
    : []

  function handleCancelEvent() {
    // event is guaranteed defined here (early returns above handle undefined)
    updateClubEvent(event!.id, { status: 'cancelled' })
    setConfirmDelete(false)
  }

  function handleRegister(swimmerId: string, swimmerName: string) {
    addEventRegistration({ eventId: event!.id, swimmerId, swimmerName, registeredBy: 'parent' })
  }

  function handleUnregister(regId: string) {
    removeEventRegistration(regId)
  }

  // Swimmers who can still register
  const unregisteredSwimmers = isParent
    ? swimmers.filter((s) => !eventRegs.some((r) => r.swimmerId === s.id))
    : []

  return (
    <PageSection
      title={event.title}
      headerAction={
        <Link
          to={ROUTES.app.events}
          className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-accent transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> All events
        </Link>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left: details */}
        <div className="space-y-6">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <EventTypeBadge type={event.eventType} />
            <EventStatusBadge status={event.status} />
            {event.squadName && (
              <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-text-muted">
                {event.squadName}
              </span>
            )}
          </div>

          {/* Meta */}
          <div className="space-y-2 text-sm text-text-secondary">
            <div className="flex items-center gap-2.5">
              <Calendar className="h-4 w-4 shrink-0 text-text-muted" />
              {fmt(event.date)}
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 shrink-0 text-text-muted" />
              {fmtTime(event.startTime)} – {fmtTime(event.endTime)}
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 shrink-0 text-text-muted" />
              {event.location}
            </div>
            <div className="flex items-center gap-2.5">
              <Users className="h-4 w-4 shrink-0 text-text-muted" />
              Coach: {event.coachName}
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div className="rounded-[var(--radius-card)] border border-border/60 bg-card px-5 py-4">
              <p className="text-sm leading-relaxed text-text-secondary">{event.description}</p>
            </div>
          )}

          {/* Cutoff */}
          <p className="text-xs text-text-muted">
            Registration closes: {new Date(event.registrationCutoff + 'T12:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          {/* Coach: attendee list + mark attendance */}
          {isCoach && (
            <div className="space-y-6">
              <div>
                <h2 className="mb-3 font-display text-base font-semibold text-text-primary">Attendee list</h2>
                <AttendeeList registrations={eventRegs} capacity={event.capacity} />
              </div>

              {eventRegs.length > 0 && (
                <AttendanceSection
                  eventId={event.id}
                  eventDate={event.date}
                  registrations={eventRegs}
                  attendanceRecords={attendanceRecords}
                  onMarkAttendance={addAttendanceRecord}
                />
              )}
            </div>
          )}

          {/* Parent: my registrations */}
          {isParent && myRegistrations.length > 0 && (
            <div className="rounded-[var(--radius-card)] border border-success/30 bg-success/5 px-5 py-4 space-y-2">
              <p className="text-sm font-semibold text-success flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Registered
              </p>
              {myRegistrations.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-text-primary">{r.swimmerName}</span>
                  <button
                    type="button"
                    onClick={() => handleUnregister(r.id)}
                    className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    <XCircle className="h-3.5 w-3.5" /> Unregister
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: capacity + actions */}
        <div className="space-y-4">
          {/* Spots */}
          <div className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <p className="mb-3 text-sm font-semibold text-text-primary">Registration</p>
            <SpotsRemaining registered={registered} capacity={event.capacity} />
          </div>

          {/* Parent: register action */}
          {isParent && event.status === 'published' && !isFull && unregisteredSwimmers.length > 0 && (
            <div className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)] space-y-3">
              <p className="text-sm font-semibold text-text-primary">Register a swimmer</p>
              {unregisteredSwimmers.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleRegister(s.id, `${s.firstName} ${s.lastName}`)}
                  className="w-full rounded-[var(--radius-button)] bg-accent px-4 py-2.5 text-sm font-semibold text-bg transition hover:bg-accent-bright"
                >
                  Register {s.firstName}
                </button>
              ))}
            </div>
          )}

          {isParent && isFull && (
            <div className="rounded-[var(--radius-card)] border border-red-400/30 bg-red-400/5 px-4 py-3 text-sm text-red-400">
              This event is full.
            </div>
          )}

          {isParent && event.status === 'cancelled' && (
            <div className="rounded-[var(--radius-card)] border border-border bg-card px-4 py-3 text-sm text-text-muted">
              This event has been cancelled.
            </div>
          )}

          {/* Coach: edit + cancel */}
          {isCoach && (
            <div className="space-y-2">
              <Link
                to={ROUTES.app.eventEdit(event.id)}
                className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-border px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                <Edit2 className="h-4 w-4" /> Edit event
              </Link>
              {event.status !== 'cancelled' && (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-red-400/30 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-400/5 transition-colors"
                >
                  <Trash2 className="h-4 w-4" /> Cancel event
                </button>
              )}
              {event.status === 'cancelled' && (
                <button
                  type="button"
                  onClick={() => { deleteClubEvent(event.id); navigate(ROUTES.app.events) }}
                  className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-red-400/30 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-400/5 transition-colors"
                >
                  <Trash2 className="h-4 w-4" /> Delete permanently
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confirm cancel modal */}
      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} title="Cancel this event?">
        <p className="text-sm text-text-secondary mb-6">
          Cancelling will mark this event as cancelled. Registrations will be preserved for reference. You can delete the event permanently afterwards.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleCancelEvent}
            className="rounded-[var(--radius-button)] bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-400"
          >
            Yes, cancel event
          </button>
          <button
            type="button"
            onClick={() => setConfirmDelete(false)}
            className="rounded-[var(--radius-button)] border border-border px-5 py-2 text-sm font-medium text-text-secondary hover:text-text-primary"
          >
            Keep event
          </button>
        </div>
      </Modal>
    </PageSection>
  )
}

function AttendanceSection({
  eventId,
  eventDate,
  registrations,
  attendanceRecords,
  onMarkAttendance,
}: {
  eventId: string
  eventDate: string
  registrations: { swimmerId: string; swimmerName: string }[]
  attendanceRecords: { eventId: string; swimmerId: string; status: 'present' | 'absent' }[]
  onMarkAttendance: (r: { eventId: string; swimmerId: string; swimmerName: string; date: string; status: 'present' | 'absent' }) => void
}) {
  const eventAttendance = useMemo(
    () => attendanceRecords.filter((a) => a.eventId === eventId),
    [attendanceRecords, eventId]
  )

  const getStatus = (swimmerId: string) =>
    eventAttendance.find((a) => a.swimmerId === swimmerId)?.status ?? null

  const presentCount = eventAttendance.filter((a) => a.status === 'present').length
  const absentCount = eventAttendance.filter((a) => a.status === 'absent').length
  const unmarkedCount = registrations.length - presentCount - absentCount

  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-card shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h2 className="flex items-center gap-2 font-display text-base font-semibold text-text-primary">
          <ClipboardCheck className="h-4 w-4 text-accent" />
          Mark attendance
        </h2>
        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span className="text-success">{presentCount} present</span>
          <span className="text-red-400">{absentCount} absent</span>
          {unmarkedCount > 0 && <span>{unmarkedCount} unmarked</span>}
        </div>
      </div>
      <div className="divide-y divide-border/60">
        {registrations.map((reg) => {
          const status = getStatus(reg.swimmerId)
          return (
            <div key={reg.swimmerId} className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="text-sm font-medium text-text-primary">{reg.swimmerName}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onMarkAttendance({ eventId, swimmerId: reg.swimmerId, swimmerName: reg.swimmerName, date: eventDate, status: 'present' })}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    status === 'present'
                      ? 'bg-success/20 text-success ring-1 ring-success/40'
                      : 'border border-border text-text-muted hover:bg-success/10 hover:text-success'
                  }`}
                >
                  Present
                </button>
                <button
                  type="button"
                  onClick={() => onMarkAttendance({ eventId, swimmerId: reg.swimmerId, swimmerName: reg.swimmerName, date: eventDate, status: 'absent' })}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    status === 'absent'
                      ? 'bg-red-400/20 text-red-400 ring-1 ring-red-400/40'
                      : 'border border-border text-text-muted hover:bg-red-400/10 hover:text-red-400'
                  }`}
                >
                  Absent
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
