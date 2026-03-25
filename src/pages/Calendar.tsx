import { useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { PageSection } from '../components/layout/PageSection'
import {
  AgendaList,
  CalendarFilterBar,
  CalendarMiniHeader,
  MiniCalendarWithUpcoming,
  SwimmerFilterTabs,
} from '../components/calendar'
import { MOCK_CALENDAR_EVENTS, getSwimmerNamesFromEvents, getClubCalendarEvents } from '../data/calendarEvents'
import { ROUTES } from '../routes'
import type { CalendarEvent, CalendarViewMode, CalendarActivityFilter } from '../types/calendar'
import type { ClubEvent } from '../types/club'
import { EventsListPanel } from './EventsPage'

function clubEventToCalendar(e: ClubEvent): CalendarEvent {
  const typeMap: Record<string, CalendarEvent['type']> = {
    'training-session': 'training',
    meet: 'competition',
    clinic: 'camp-program',
    'testing-day': 'assessment',
  }
  return {
    id: `club-evt-${e.id}`,
    title: e.title,
    swimmerId: null,
    swimmerName: null,
    type: typeMap[e.eventType] ?? 'club-event',
    date: e.date,
    startTime: e.startTime,
    endTime: e.endTime,
    location: e.location,
    status: 'upcoming',
  }
}

function getWeekStart(d: Date): Date {
  const date = new Date(d)
  const day = date.getDay()
  const diff = date.getDate() - (day === 0 ? 6 : day - 1)
  date.setDate(diff)
  date.setHours(0, 0, 0, 0)
  return date
}

function getMonthStart(d: Date): Date {
  const date = new Date(d)
  date.setDate(1)
  date.setHours(0, 0, 0, 0)
  return date
}

function addDays(d: Date, n: number): Date {
  const out = new Date(d)
  out.setDate(out.getDate() + n)
  return out
}

function isInRange(dateStr: string, start: Date, end: Date): boolean {
  const t = new Date(dateStr + 'T12:00:00').getTime()
  return t >= start.getTime() && t <= end.getTime()
}

/** Shell: title, subheading tabs (Schedule | Events), outlet. */
export function CalendarLayout() {
  const { accountType } = useApp()
  const { pathname } = useLocation()
  const isClub = accountType === 'club'

  const onEvents = pathname === ROUTES.app.calendarEvents || pathname.endsWith('/calendar/events')

  const subtitle = onEvents
    ? isClub
      ? 'Create, publish, and track club events — or switch to Schedule for the calendar agenda.'
      : 'Register for club events and meets — or switch to Schedule for your family calendar.'
    : isClub
      ? 'Sessions and events from your classes. Link your calendar for full view.'
      : 'View upcoming training sessions, events, and pathway activities.'

  return (
    <PageSection title="Calendar" subtitle={subtitle}>
      <div
        className="mt-2 border-b border-border bg-bg-elevated/50"
        role="tablist"
        aria-label="Calendar views"
      >
        <div className="flex gap-0 overflow-x-auto">
          <NavLink
            to={ROUTES.app.calendar}
            end
            role="tab"
            className={({ isActive }) =>
              `shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-accent text-accent'
                  : 'border-transparent text-text-muted hover:border-border hover:text-text-secondary'
              }`
            }
          >
            Schedule
          </NavLink>
          <NavLink
            to={ROUTES.app.calendarEvents}
            role="tab"
            className={({ isActive }) =>
              `shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-accent text-accent'
                  : 'border-transparent text-text-muted hover:border-border hover:text-text-secondary'
              }`
            }
          >
            Events
          </NavLink>
        </div>
      </div>

      <div className="mt-6">
        <Outlet />
      </div>
    </PageSection>
  )
}

/** Agenda / mini calendar view (default `/calendar`). */
export function CalendarSchedulePage() {
  const { accountType, swimmers, clubClasses, clubEvents } = useApp()
  const isParent = accountType === 'parent'
  const isClub = accountType === 'club'

  const [viewMode, setViewMode] = useState<CalendarViewMode>('agenda')
  const [activityFilter, setActivityFilter] = useState<CalendarActivityFilter>('all')
  const [selectedSwimmer, setSelectedSwimmer] = useState<string | null>(null)
  const [selectedSquadId, setSelectedSquadId] = useState<string>('')
  const [focusDate, setFocusDate] = useState(() => new Date())

  const familyNames = useMemo(
    () => (isParent ? swimmers.map((s) => `${s.firstName} ${s.lastName}`.trim()).filter(Boolean) : []),
    [isParent, swimmers]
  )
  const swimmerNames = useMemo(
    () => (isParent ? familyNames : getSwimmerNamesFromEvents(MOCK_CALENDAR_EVENTS)),
    [isParent, familyNames]
  )
  const familyNameSet = useMemo(() => new Set(familyNames), [familyNames])

  const realClubCalEvents = useMemo(
    () => clubEvents.filter((e) => e.status === 'published').map(clubEventToCalendar),
    [clubEvents]
  )

  const { rangeStart, rangeEnd, headerLabel } = useMemo(() => {
    if (viewMode === 'month') {
      const start = getMonthStart(focusDate)
      const end = addDays(new Date(start.getFullYear(), start.getMonth() + 1, 0), 0)
      return {
        rangeStart: start,
        rangeEnd: end,
        headerLabel: start.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' }),
      }
    }
    if (viewMode === 'week') {
      const start = getWeekStart(focusDate)
      const end = addDays(start, 6)
      return {
        rangeStart: start,
        rangeEnd: end,
        headerLabel: `${start.getDate()}–${end.getDate()} ${start.toLocaleDateString('en-AU', { month: 'short' })} ${start.getFullYear()}`,
      }
    }
    const start = new Date(focusDate)
    start.setHours(0, 0, 0, 0)
    const end = addDays(start, 13)
    return {
      rangeStart: start,
      rangeEnd: end,
      headerLabel: `${start.getDate()}–${end.getDate()} ${start.toLocaleDateString('en-AU', { month: 'short' })} ${start.getFullYear()}`,
    }
  }, [viewMode, focusDate])

  const eventsForMiniCalendar = useMemo(() => {
    const monthStart = getMonthStart(focusDate)
    const monthEnd = addDays(new Date(focusDate.getFullYear(), focusDate.getMonth() + 1, 0), 0)
    let list: typeof MOCK_CALENDAR_EVENTS
    if (isClub) {
      list = [
        ...getClubCalendarEvents(clubClasses, monthStart, monthEnd, { maxDays: 14 }),
        ...realClubCalEvents.filter((e) => isInRange(e.date, monthStart, monthEnd)),
      ]
      if (selectedSquadId) list = list.filter((e) => e.id.startsWith(`club-${selectedSquadId}-`))
    } else {
      list = [
        ...MOCK_CALENDAR_EVENTS.filter((e) => isInRange(e.date, monthStart, monthEnd)),
        ...realClubCalEvents.filter((e) => isInRange(e.date, monthStart, monthEnd)),
      ]
      if (isParent && familyNameSet.size > 0)
        list = list.filter((e) => e.swimmerName === null || familyNameSet.has(e.swimmerName ?? ''))
      if (isParent && selectedSwimmer)
        list = list.filter((e) => e.swimmerName === null || e.swimmerName === selectedSwimmer)
    }
    if (activityFilter !== 'all') list = list.filter((e) => e.type === activityFilter)
    return list.sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
  }, [
    focusDate,
    activityFilter,
    isParent,
    isClub,
    clubClasses,
    selectedSquadId,
    selectedSwimmer,
    familyNameSet,
    realClubCalEvents,
  ])

  const filteredEvents = useMemo(() => {
    let list: typeof MOCK_CALENDAR_EVENTS
    if (isClub) {
      list = [
        ...getClubCalendarEvents(clubClasses, rangeStart, rangeEnd, { maxDays: 14 }),
        ...realClubCalEvents.filter((e) => isInRange(e.date, rangeStart, rangeEnd)),
      ]
      if (selectedSquadId) list = list.filter((e) => e.id.startsWith(`club-${selectedSquadId}-`))
    } else {
      list = [
        ...MOCK_CALENDAR_EVENTS.filter((e) => isInRange(e.date, rangeStart, rangeEnd)),
        ...realClubCalEvents.filter((e) => isInRange(e.date, rangeStart, rangeEnd)),
      ]
      if (isParent && familyNameSet.size > 0)
        list = list.filter((e) => e.swimmerName === null || familyNameSet.has(e.swimmerName ?? ''))
      if (isParent && selectedSwimmer)
        list = list.filter((e) => e.swimmerName === null || e.swimmerName === selectedSwimmer)
    }
    if (activityFilter !== 'all') list = list.filter((e) => e.type === activityFilter)
    return list.sort(
      (a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)
    )
  }, [
    rangeStart,
    rangeEnd,
    activityFilter,
    isParent,
    isClub,
    clubClasses,
    selectedSquadId,
    selectedSwimmer,
    familyNameSet,
    realClubCalEvents,
  ])

  const handlePrev = () => {
    if (viewMode === 'month') {
      setFocusDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
    } else if (viewMode === 'week') {
      setFocusDate((d) => addDays(getWeekStart(d), -7))
    } else {
      setFocusDate((d) => addDays(d, -14))
    }
  }

  const handleNext = () => {
    if (viewMode === 'month') {
      setFocusDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))
    } else if (viewMode === 'week') {
      setFocusDate((d) => addDays(getWeekStart(d), 7))
    } else {
      setFocusDate((d) => addDays(d, 14))
    }
  }

  return (
    <>
      <MiniCalendarWithUpcoming focusDate={focusDate} events={eventsForMiniCalendar} />

      {isClub && clubClasses.length > 0 && (
        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-medium text-text-muted">Squad</label>
          <select
            value={selectedSquadId}
            onChange={(e) => setSelectedSquadId(e.target.value)}
            className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-sm text-text-primary sm:w-48"
          >
            <option value="">All squads</option>
            {clubClasses
              .filter((c) => c.status === 'active')
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CalendarMiniHeader label={headerLabel} onPrev={handlePrev} onNext={handleNext} />
        <CalendarFilterBar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          activityFilter={activityFilter}
          onActivityFilterChange={setActivityFilter}
        />
      </div>

      {isParent && (
        <SwimmerFilterTabs
          swimmers={swimmerNames}
          selectedSwimmer={selectedSwimmer}
          onSelect={setSelectedSwimmer}
        />
      )}

      <div className="min-w-0">
        <AgendaList events={filteredEvents} />
      </div>
    </>
  )
}

/** Club events list (`/calendar/events`). */
export function CalendarEventsPage() {
  return <EventsListPanel />
}
