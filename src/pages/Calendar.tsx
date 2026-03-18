import { useMemo, useState } from 'react'
import { Calendar as CalendarIcon, Trophy, Users, Zap } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { PageSection } from '../components/layout/PageSection'
import {
  AgendaList,
  CalendarFilterBar,
  CalendarMiniHeader,
  CalendarSummaryCard,
  MiniCalendarWithUpcoming,
  SwimmerFilterTabs,
} from '../components/calendar'
import { MOCK_CALENDAR_EVENTS, getSwimmerNamesFromEvents, getClubCalendarEvents } from '../data/calendarEvents'
import type { CalendarViewMode, CalendarActivityFilter } from '../types/calendar'

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

export function Calendar() {
  const { accountType, swimmers, clubClasses } = useApp()
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
    if (isClub && clubClasses.length > 0) {
      list = getClubCalendarEvents(clubClasses, monthStart, monthEnd, { maxDays: 14 })
      if (selectedSquadId) list = list.filter((e) => e.id.startsWith(`club-${selectedSquadId}-`))
    } else {
      list = MOCK_CALENDAR_EVENTS.filter((e) =>
        isInRange(e.date, monthStart, monthEnd)
      )
      if (isParent && familyNameSet.size > 0) list = list.filter((e) => familyNameSet.has(e.swimmerName ?? ''))
      if (isParent && selectedSwimmer) list = list.filter((e) => e.swimmerName === selectedSwimmer)
    }
    if (activityFilter !== 'all') list = list.filter((e) => e.type === activityFilter)
    // Parent/generic: limit mini calendar when too many
    if (!isClub && !isParent && list.length > 8) {
      const byType = (type: string) => list.filter((e) => e.type === type)
      const training = byType('training').sort((a, b) => a.date.localeCompare(b.date)).slice(0, 2)
      const competition = byType('competition').sort((a, b) => a.date.localeCompare(b.date)).slice(0, 1)
      const clubEvent = byType('club-event').sort((a, b) => a.date.localeCompare(b.date)).slice(0, 1)
      const assessment = byType('assessment').slice(0, 1)
      list = [...training, ...competition, ...clubEvent, ...assessment].sort(
        (a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)
      )
    }
    return list.sort(
      (a, b) =>
        a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)
    )
  }, [focusDate, activityFilter, isParent, isClub, clubClasses, selectedSquadId, selectedSwimmer, familyNameSet])

  const filteredEvents = useMemo(() => {
    let list: typeof MOCK_CALENDAR_EVENTS
    if (isClub && clubClasses.length > 0) {
      list = getClubCalendarEvents(clubClasses, rangeStart, rangeEnd, { maxDays: 14 })
      if (selectedSquadId) list = list.filter((e) => e.id.startsWith(`club-${selectedSquadId}-`))
    } else {
      list = MOCK_CALENDAR_EVENTS.filter((e) =>
        isInRange(e.date, rangeStart, rangeEnd)
      )
      if (isParent && familyNameSet.size > 0) list = list.filter((e) => familyNameSet.has(e.swimmerName ?? ''))
      if (isParent && selectedSwimmer) list = list.filter((e) => e.swimmerName === selectedSwimmer)
    }
    if (activityFilter !== 'all') list = list.filter((e) => e.type === activityFilter)
    return list.sort(
      (a, b) =>
        a.date.localeCompare(b.date) ||
        a.startTime.localeCompare(b.startTime)
    )
  }, [rangeStart, rangeEnd, activityFilter, isParent, isClub, clubClasses, selectedSquadId, selectedSwimmer, familyNameSet])

  const summaryStats = useMemo(() => {
    const now = new Date()
    const weekStart = getWeekStart(now)
    const weekEnd = addDays(weekStart, 6)
    const weekendStart = addDays(weekStart, 5)
    const weekendEnd = addDays(weekStart, 6)
    let allInRange: typeof MOCK_CALENDAR_EVENTS
    if (isClub && clubClasses.length > 0) {
      allInRange = getClubCalendarEvents(clubClasses, rangeStart, rangeEnd, { maxDays: 14 })
      if (selectedSquadId) allInRange = allInRange.filter((e) => e.id.startsWith(`club-${selectedSquadId}-`))
    } else {
      allInRange = MOCK_CALENDAR_EVENTS.filter((e) =>
        isInRange(e.date, rangeStart, rangeEnd)
      )
      if (isParent && familyNameSet.size > 0) allInRange = allInRange.filter((e) => familyNameSet.has(e.swimmerName ?? ''))
    }
    let forSummary = allInRange
    if (activityFilter !== 'all') forSummary = forSummary.filter((e) => e.type === activityFilter)
    if (isParent && selectedSwimmer) forSummary = forSummary.filter((e) => e.swimmerName === selectedSwimmer)

    const thisWeek = forSummary.filter((e) =>
      isInRange(e.date, weekStart, weekEnd)
    )
    const thisWeekend = forSummary.filter((e) =>
      isInRange(e.date, weekendStart, weekendEnd)
    )
    const competitions = thisWeekend.filter((e) => e.type === 'competition')
    const nextEvent = forSummary.find(
      (e) =>
        new Date(e.date + 'T' + e.endTime).getTime() >= now.getTime()
    )
    const linkedCount = isParent ? familyNames.length : 0
    return {
      activitiesThisWeek: thisWeek.length,
      competitionsThisWeekend: competitions.length,
      nextEventTitle: nextEvent
        ? `${nextEvent.title}${nextEvent.swimmerName ? ` (${nextEvent.swimmerName})` : ''}`
        : (isClub ? 'No sessions this period' : 'No upcoming events'),
      nextEventSubtitle: nextEvent
        ? `${nextEvent.date} ${nextEvent.startTime}`
        : undefined,
      linkedSwimmers: linkedCount,
    }
  }, [rangeStart, rangeEnd, activityFilter, isParent, isClub, clubClasses, selectedSquadId, selectedSwimmer, familyNames.length, familyNameSet, swimmerNames.length])

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
    <PageSection
      title="Calendar"
      subtitle={isClub
        ? 'Sessions and events from your classes. Link your calendar for full view.'
        : 'View upcoming training sessions, events, and pathway activities.'}
    >
      {/* White calendar with dots + 4 soonest */}
      <MiniCalendarWithUpcoming
        focusDate={focusDate}
        events={eventsForMiniCalendar}
      />

      {isClub && clubClasses.length > 0 && (
        <div className="mb-4">
          <label className="block text-xs font-medium text-text-muted mb-1.5">Squad</label>
          <select
            value={selectedSquadId}
            onChange={(e) => setSelectedSquadId(e.target.value)}
            className="rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-sm text-text-primary w-full sm:w-48"
          >
            <option value="">All squads</option>
            {clubClasses.filter((c) => c.status === 'active').map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Top controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CalendarMiniHeader
          label={headerLabel}
          onPrev={handlePrev}
          onNext={handleNext}
        />
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

      <div className="grid gap-6 lg:grid-cols-[1fr,280px]">
        {/* Main: agenda list */}
        <div className="min-w-0">
          <AgendaList events={filteredEvents} />
        </div>

        {/* Right: summary cards */}
        <aside className="space-y-4">
          {isParent && summaryStats.linkedSwimmers > 0 && (
            <CalendarSummaryCard
              title="Swimmers linked"
              value={summaryStats.linkedSwimmers}
              subtitle="in this view"
              icon={<Users className="h-5 w-5" />}
            />
          )}
          <CalendarSummaryCard
            title="Activities this week"
            value={summaryStats.activitiesThisWeek}
            icon={<Zap className="h-5 w-5" />}
          />
          <CalendarSummaryCard
            title="Competitions this weekend"
            value={summaryStats.competitionsThisWeekend}
            icon={<Trophy className="h-5 w-5" />}
          />
          <CalendarSummaryCard
            title="Upcoming next"
            value={summaryStats.nextEventTitle}
            subtitle={summaryStats.nextEventSubtitle ?? 'Next event in range'}
            icon={<CalendarIcon className="h-5 w-5" />}
          />
        </aside>
      </div>
    </PageSection>
  )
}
