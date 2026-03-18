/**
 * Mock calendar events for the Swimming Australia prototype.
 * Covers training, competition, assessment, camps, and club events.
 * Fred & Emma = demo family; Mia & Oliver = alternate family.
 */
import type { CalendarEvent } from '../types/calendar'
import type { SwimClass } from '../types/club'

const DAY_TO_NUM: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }

/** Parse trainingDays (e.g. "Mon, Wed", "Mon–Fri") into weekday numbers (1 = Mon). */
function parseTrainingDays(s: string): number[] {
  const out: number[] = []
  const normalized = s.replace(/\s/g, '')
  if (normalized.includes('–') || normalized.includes('-')) {
    const [a, b] = normalized.split(/[–-]/)
    const start = DAY_TO_NUM[a] ?? -1
    const end = DAY_TO_NUM[b] ?? -1
    if (start >= 0 && end >= 0) {
      for (let d = start; d <= end; d++) out.push(d)
      return out
    }
  }
  normalized.split(',').forEach((day) => {
    const n = DAY_TO_NUM[day]
    if (n !== undefined) out.push(n)
  })
  return out.length ? out : [1, 2, 3, 4, 5]
}

/** Parse trainingTimes (e.g. "4:00–4:45 pm") into { startTime: "16:00", endTime: "16:45" }. */
function parseTrainingTimes(s: string): { startTime: string; endTime: string } {
  const match = s.match(/(\d{1,2}):?(\d{2})?\s*[–-]\s*(\d{1,2}):?(\d{2})?\s*(am|pm)/i)
  if (!match) return { startTime: '09:00', endTime: '10:00' }
  const [, sh, sm, eh, em, period] = match
  const toMins = (h: number, m: number, p: string) => {
    let hour = h
    if (p.toLowerCase() === 'pm' && hour !== 12) hour += 12
    if (p.toLowerCase() === 'am' && hour === 12) hour = 0
    return hour * 60 + (m || 0)
  }
  const startMins = toMins(parseInt(sh ?? '9', 10), parseInt(sm ?? '0', 10), period)
  const endMins = toMins(parseInt(eh ?? '10', 10), parseInt(em ?? '0', 10), period)
  const fmt = (mins: number) => {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
  }
  return { startTime: fmt(startMins), endTime: fmt(endMins) }
}

/** Build club/coach calendar events from class schedules for a date range. Optional maxDays caps range to keep sessions minimal. */
export function getClubCalendarEvents(
  clubClasses: SwimClass[],
  rangeStart: Date,
  rangeEnd: Date,
  options?: { maxDays?: number }
): CalendarEvent[] {
  const events: CalendarEvent[] = []
  const start = new Date(rangeStart)
  start.setHours(0, 0, 0, 0)
  let end = new Date(rangeEnd)
  end.setHours(23, 59, 59, 999)
  if (options?.maxDays != null) {
    const cap = new Date(start)
    cap.setDate(cap.getDate() + options.maxDays)
    if (end.getTime() > cap.getTime()) end = cap
  }

  clubClasses.filter((c) => c.status === 'active').forEach((cls) => {
    const days = parseTrainingDays(cls.trainingDays)
    const { startTime, endTime } = parseTrainingTimes(cls.trainingTimes)
    const d = new Date(start)
    while (d.getTime() <= end.getTime()) {
      if (days.includes(d.getDay())) {
        const dateStr = d.toISOString().slice(0, 10)
        events.push({
          id: `club-${cls.id}-${dateStr}`,
          title: cls.name,
          swimmerId: null,
          swimmerName: null,
          type: 'training',
          date: dateStr,
          startTime,
          endTime,
          location: 'Pool',
          status: new Date(dateStr + 'T' + endTime) >= new Date() ? 'upcoming' : 'completed',
        })
      }
      d.setDate(d.getDate() + 1)
    }
  })

  return events.sort(
    (a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)
  )
}

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
  // Fred Visentini (demo Member family)
  {
    id: 'ev-fred-1',
    title: 'Junior Squad Training',
    swimmerId: 'demo-fred',
    swimmerName: 'Fred Visentini',
    type: 'training',
    date: '2025-03-10',
    startTime: '16:00',
    endTime: '17:30',
    location: 'City Aquatic Centre',
    status: 'upcoming',
    notes: 'Bring fins.',
  },
  {
    id: 'ev-fred-2',
    title: 'Club Night - 50m Free',
    swimmerId: 'demo-fred',
    swimmerName: 'Fred Visentini',
    type: 'competition',
    date: '2025-03-14',
    startTime: '18:00',
    endTime: '20:00',
    location: 'City Dolphins Pool',
    status: 'upcoming',
  },
  {
    id: 'ev-fred-3',
    title: 'Junior Squad Training',
    swimmerId: 'demo-fred',
    swimmerName: 'Fred Visentini',
    type: 'training',
    date: '2025-03-11',
    startTime: '16:00',
    endTime: '17:30',
    location: 'City Aquatic Centre',
    status: 'completed',
  },
  {
    id: 'ev-fred-4',
    title: 'Technique Assessment - Freestyle',
    swimmerId: 'demo-fred',
    swimmerName: 'Fred Visentini',
    type: 'assessment',
    date: '2025-03-17',
    startTime: '09:00',
    endTime: '10:00',
    location: 'State Swim Academy',
    status: 'registered',
  },
  {
    id: 'ev-fred-5',
    title: 'Development Meet - 50m Back',
    swimmerId: 'demo-fred',
    swimmerName: 'Fred Visentini',
    type: 'competition',
    date: '2025-03-22',
    startTime: '08:30',
    endTime: '12:00',
    location: 'Regional Pool',
    status: 'registered',
    notes: 'Warm-up 8:00am.',
  },
  {
    id: 'ev-fred-6',
    title: 'Junior Squad Training',
    swimmerId: 'demo-fred',
    swimmerName: 'Fred Visentini',
    type: 'training',
    date: '2025-03-13',
    startTime: '16:00',
    endTime: '17:30',
    location: 'City Aquatic Centre',
    status: 'upcoming',
  },
  {
    id: 'ev-fred-7',
    title: 'Stroke Clinic - Freestyle',
    swimmerId: 'demo-fred',
    swimmerName: 'Fred Visentini',
    type: 'camp-program',
    date: '2025-03-29',
    startTime: '09:00',
    endTime: '12:00',
    location: 'City Aquatic Centre',
    status: 'upcoming',
  },
  // Emma Visentini (demo Member family)
  {
    id: 'ev-emma-1',
    title: 'Learn-to-Swim Session',
    swimmerId: 'demo-emma',
    swimmerName: 'Emma Visentini',
    type: 'training',
    date: '2025-03-10',
    startTime: '15:00',
    endTime: '15:45',
    location: 'City Dolphins Pool',
    status: 'upcoming',
  },
  {
    id: 'ev-emma-2',
    title: 'Learn-to-Swim Session',
    swimmerId: 'demo-emma',
    swimmerName: 'Emma Visentini',
    type: 'training',
    date: '2025-03-12',
    startTime: '15:00',
    endTime: '15:45',
    location: 'City Dolphins Pool',
    status: 'upcoming',
  },
  {
    id: 'ev-emma-3',
    title: 'Water Confidence Assessment',
    swimmerId: 'demo-emma',
    swimmerName: 'Emma Visentini',
    type: 'assessment',
    date: '2025-03-15',
    startTime: '10:00',
    endTime: '10:45',
    location: 'City Dolphins Pool',
    status: 'registered',
    notes: 'Parent to accompany.',
  },
  {
    id: 'ev-emma-4',
    title: 'Learn-to-Swim Session',
    swimmerId: 'demo-emma',
    swimmerName: 'Emma Visentini',
    type: 'training',
    date: '2025-03-17',
    startTime: '15:00',
    endTime: '15:45',
    location: 'City Dolphins Pool',
    status: 'upcoming',
  },
  {
    id: 'ev-emma-5',
    title: 'Splash & Play Day',
    swimmerId: 'demo-emma',
    swimmerName: 'Emma Visentini',
    type: 'club-event',
    date: '2025-03-23',
    startTime: '09:00',
    endTime: '11:00',
    location: 'City Aquatic Centre',
    status: 'upcoming',
    notes: 'Family event.',
  },
  {
    id: 'ev-emma-6',
    title: 'Learn-to-Swim Session',
    swimmerId: 'demo-emma',
    swimmerName: 'Emma Visentini',
    type: 'training',
    date: '2025-03-19',
    startTime: '15:00',
    endTime: '15:45',
    location: 'City Dolphins Pool',
    status: 'upcoming',
  },
  {
    id: 'ev-emma-7',
    title: 'Progress Check',
    swimmerId: 'demo-emma',
    swimmerName: 'Emma Visentini',
    type: 'assessment',
    date: '2025-03-26',
    startTime: '15:30',
    endTime: '16:15',
    location: 'City Dolphins Pool',
    status: 'registered',
  },
  // ── March 2026 – City Dolphins Swim Club (Fred & Emma) ──────────────
  // Fred – Junior Squad (Tue/Thu/Fri training, competitions, clinic)
  {
    id: 'ev-fred-2026-1',
    title: 'Junior Squad Training',
    swimmerId: 'demo-fred',
    swimmerName: 'Fred Visentini',
    type: 'training',
    date: '2026-03-03',
    startTime: '16:00',
    endTime: '17:30',
    location: 'City Dolphins Pool',
    status: 'completed',
    notes: 'Focus: turns and underwater.',
  },
  {
    id: 'ev-fred-2026-2',
    title: 'Junior Squad Training',
    swimmerId: 'demo-fred',
    swimmerName: 'Fred Visentini',
    type: 'training',
    date: '2026-03-05',
    startTime: '16:00',
    endTime: '17:30',
    location: 'City Dolphins Pool',
    status: 'completed',
  },
  {
    id: 'ev-fred-2026-3',
    title: 'Junior Squad Training',
    swimmerId: 'demo-fred',
    swimmerName: 'Fred Visentini',
    type: 'training',
    date: '2026-03-06',
    startTime: '16:00',
    endTime: '17:30',
    location: 'City Dolphins Pool',
    status: 'completed',
  },
  {
    id: 'ev-fred-2026-4',
    title: 'City Dolphins Club Night',
    swimmerId: 'demo-fred',
    swimmerName: 'Fred Visentini',
    type: 'competition',
    date: '2026-03-07',
    startTime: '17:00',
    endTime: '19:30',
    location: 'City Dolphins Pool',
    status: 'completed',
    notes: '50m Free & 100m Back. PB in 50 Free.',
  },
  {
    id: 'ev-fred-2026-5',
    title: 'Junior Squad Training',
    swimmerId: 'demo-fred',
    swimmerName: 'Fred Visentini',
    type: 'training',
    date: '2026-03-10',
    startTime: '16:00',
    endTime: '17:30',
    location: 'City Dolphins Pool',
    status: 'upcoming',
  },
  {
    id: 'ev-fred-2026-6',
    title: 'Junior Squad Training',
    swimmerId: 'demo-fred',
    swimmerName: 'Fred Visentini',
    type: 'training',
    date: '2026-03-12',
    startTime: '16:00',
    endTime: '17:30',
    location: 'City Dolphins Pool',
    status: 'upcoming',
  },
  {
    id: 'ev-fred-2026-7',
    title: 'Junior Squad Training',
    swimmerId: 'demo-fred',
    swimmerName: 'Fred Visentini',
    type: 'training',
    date: '2026-03-13',
    startTime: '16:00',
    endTime: '17:30',
    location: 'City Dolphins Pool',
    status: 'upcoming',
  },
  {
    id: 'ev-fred-2026-8',
    title: 'Pathway Stage Checkpoint – Freestyle',
    swimmerId: 'demo-fred',
    swimmerName: 'Fred Visentini',
    type: 'assessment',
    date: '2026-03-14',
    startTime: '09:00',
    endTime: '10:00',
    location: 'State Swim Academy',
    status: 'registered',
    notes: 'End-of-term technique evaluation.',
  },
  {
    id: 'ev-fred-2026-9',
    title: 'NSW Regional Junior Championship',
    swimmerId: 'demo-fred',
    swimmerName: 'Fred Visentini',
    type: 'competition',
    date: '2026-03-21',
    startTime: '08:00',
    endTime: '14:00',
    location: 'Metro Aquatic Centre, Sydney',
    status: 'registered',
    notes: 'Events: 100m Free, 50m Back. Warm-up 7:15am.',
  },
  {
    id: 'ev-fred-2026-10',
    title: 'Junior Squad Training',
    swimmerId: 'demo-fred',
    swimmerName: 'Fred Visentini',
    type: 'training',
    date: '2026-03-17',
    startTime: '16:00',
    endTime: '17:30',
    location: 'City Dolphins Pool',
    status: 'upcoming',
  },
  {
    id: 'ev-fred-2026-11',
    title: 'Junior Squad Training',
    swimmerId: 'demo-fred',
    swimmerName: 'Fred Visentini',
    type: 'training',
    date: '2026-03-19',
    startTime: '16:00',
    endTime: '17:30',
    location: 'City Dolphins Pool',
    status: 'upcoming',
  },
  {
    id: 'ev-fred-2026-12',
    title: 'Junior Squad Training',
    swimmerId: 'demo-fred',
    swimmerName: 'Fred Visentini',
    type: 'training',
    date: '2026-03-20',
    startTime: '16:00',
    endTime: '17:30',
    location: 'City Dolphins Pool',
    status: 'upcoming',
  },
  {
    id: 'ev-fred-2026-13',
    title: 'Stroke Clinic – Butterfly & IM',
    swimmerId: 'demo-fred',
    swimmerName: 'Fred Visentini',
    type: 'camp-program',
    date: '2026-03-28',
    startTime: '09:00',
    endTime: '12:00',
    location: 'City Dolphins Pool',
    status: 'upcoming',
    notes: 'Optional clinic — bring paddles and fins.',
  },
  {
    id: 'ev-fred-2026-14',
    title: 'Junior Squad Training',
    swimmerId: 'demo-fred',
    swimmerName: 'Fred Visentini',
    type: 'training',
    date: '2026-03-24',
    startTime: '16:00',
    endTime: '17:30',
    location: 'City Dolphins Pool',
    status: 'upcoming',
  },
  {
    id: 'ev-fred-2026-15',
    title: 'Junior Squad Training',
    swimmerId: 'demo-fred',
    swimmerName: 'Fred Visentini',
    type: 'training',
    date: '2026-03-26',
    startTime: '16:00',
    endTime: '17:30',
    location: 'City Dolphins Pool',
    status: 'upcoming',
  },
  {
    id: 'ev-fred-2026-16',
    title: 'Junior Squad Training',
    swimmerId: 'demo-fred',
    swimmerName: 'Fred Visentini',
    type: 'training',
    date: '2026-03-27',
    startTime: '16:00',
    endTime: '17:30',
    location: 'City Dolphins Pool',
    status: 'upcoming',
  },
  // Emma – Learn-to-Swim (Mon/Wed sessions, one assessment)
  {
    id: 'ev-emma-2026-1',
    title: 'Learn-to-Swim Session',
    swimmerId: 'demo-emma',
    swimmerName: 'Emma Visentini',
    type: 'training',
    date: '2026-03-02',
    startTime: '15:00',
    endTime: '15:45',
    location: 'City Dolphins Pool',
    status: 'completed',
  },
  {
    id: 'ev-emma-2026-2',
    title: 'Learn-to-Swim Session',
    swimmerId: 'demo-emma',
    swimmerName: 'Emma Visentini',
    type: 'training',
    date: '2026-03-04',
    startTime: '15:00',
    endTime: '15:45',
    location: 'City Dolphins Pool',
    status: 'completed',
  },
  {
    id: 'ev-emma-2026-3',
    title: 'Learn-to-Swim Session',
    swimmerId: 'demo-emma',
    swimmerName: 'Emma Visentini',
    type: 'training',
    date: '2026-03-09',
    startTime: '15:00',
    endTime: '15:45',
    location: 'City Dolphins Pool',
    status: 'completed',
  },
  {
    id: 'ev-emma-2026-4',
    title: 'Learn-to-Swim Session',
    swimmerId: 'demo-emma',
    swimmerName: 'Emma Visentini',
    type: 'training',
    date: '2026-03-11',
    startTime: '15:00',
    endTime: '15:45',
    location: 'City Dolphins Pool',
    status: 'upcoming',
  },
  {
    id: 'ev-emma-2026-5',
    title: 'Learn-to-Swim Session',
    swimmerId: 'demo-emma',
    swimmerName: 'Emma Visentini',
    type: 'training',
    date: '2026-03-16',
    startTime: '15:00',
    endTime: '15:45',
    location: 'City Dolphins Pool',
    status: 'upcoming',
  },
  {
    id: 'ev-emma-2026-6',
    title: 'Water Confidence & Stage Assessment',
    swimmerId: 'demo-emma',
    swimmerName: 'Emma Visentini',
    type: 'assessment',
    date: '2026-03-18',
    startTime: '10:00',
    endTime: '10:45',
    location: 'City Dolphins Pool',
    status: 'registered',
    notes: 'Parent to accompany poolside.',
  },
  {
    id: 'ev-emma-2026-7',
    title: 'Learn-to-Swim Session',
    swimmerId: 'demo-emma',
    swimmerName: 'Emma Visentini',
    type: 'training',
    date: '2026-03-18',
    startTime: '15:00',
    endTime: '15:45',
    location: 'City Dolphins Pool',
    status: 'upcoming',
  },
  {
    id: 'ev-emma-2026-8',
    title: 'Learn-to-Swim Session',
    swimmerId: 'demo-emma',
    swimmerName: 'Emma Visentini',
    type: 'training',
    date: '2026-03-23',
    startTime: '15:00',
    endTime: '15:45',
    location: 'City Dolphins Pool',
    status: 'upcoming',
  },
  {
    id: 'ev-emma-2026-9',
    title: 'Splash & Play Day – City Dolphins',
    swimmerId: 'demo-emma',
    swimmerName: 'Emma Visentini',
    type: 'club-event',
    date: '2026-03-22',
    startTime: '09:00',
    endTime: '11:00',
    location: 'City Aquatic Centre',
    status: 'upcoming',
    notes: 'Family welcome. Bring sunscreen.',
  },
  {
    id: 'ev-emma-2026-10',
    title: 'Learn-to-Swim Session',
    swimmerId: 'demo-emma',
    swimmerName: 'Emma Visentini',
    type: 'training',
    date: '2026-03-25',
    startTime: '15:00',
    endTime: '15:45',
    location: 'City Dolphins Pool',
    status: 'upcoming',
  },
  {
    id: 'ev-emma-2026-11',
    title: 'Learn-to-Swim Session',
    swimmerId: 'demo-emma',
    swimmerName: 'Emma Visentini',
    type: 'training',
    date: '2026-03-30',
    startTime: '15:00',
    endTime: '15:45',
    location: 'City Dolphins Pool',
    status: 'upcoming',
  },
  // ── end March 2026 ────────────────────────────────────────────────────

  // Mia Visentini
  {
    id: 'ev-1',
    title: 'Junior Squad Training',
    swimmerId: 'sw-mia',
    swimmerName: 'Mia Visentini',
    type: 'training',
    date: '2025-03-10',
    startTime: '16:00',
    endTime: '17:30',
    location: 'City Aquatic Centre',
    status: 'upcoming',
    notes: 'Bring fins this week.',
  },
  {
    id: 'ev-2',
    title: 'Technique Assessment - Freestyle',
    swimmerId: 'sw-mia',
    swimmerName: 'Mia Visentini',
    type: 'assessment',
    date: '2025-03-12',
    startTime: '09:00',
    endTime: '10:00',
    location: 'State Swim Academy',
    status: 'registered',
    notes: 'Check-in 15 min early.',
  },
  {
    id: 'ev-3',
    title: 'Club Night - 50m Free & Back',
    swimmerId: 'sw-mia',
    swimmerName: 'Mia Visentini',
    type: 'competition',
    date: '2025-03-14',
    startTime: '18:00',
    endTime: '20:30',
    location: 'Regional Pool',
    status: 'upcoming',
  },
  {
    id: 'ev-4',
    title: 'Junior Squad Training',
    swimmerId: 'sw-mia',
    swimmerName: 'Mia Visentini',
    type: 'training',
    date: '2025-03-11',
    startTime: '16:00',
    endTime: '17:30',
    location: 'City Aquatic Centre',
    status: 'completed',
  },
  {
    id: 'ev-5',
    title: 'Development Camp - Stroke Clinic',
    swimmerId: 'sw-mia',
    swimmerName: 'Mia Visentini',
    type: 'camp-program',
    date: '2025-03-22',
    startTime: '08:00',
    endTime: '12:00',
    location: 'State Institute of Sport',
    status: 'registered',
    notes: 'Full day; lunch provided.',
  },
  // Oliver Visentini
  {
    id: 'ev-6',
    title: 'Junior Squad Training',
    swimmerId: 'sw-oliver',
    swimmerName: 'Oliver Visentini',
    type: 'training',
    date: '2025-03-10',
    startTime: '17:30',
    endTime: '19:00',
    location: 'City Aquatic Centre',
    status: 'upcoming',
  },
  {
    id: 'ev-7',
    title: 'Club Presentation Night',
    swimmerId: 'sw-oliver',
    swimmerName: 'Oliver Visentini',
    type: 'club-event',
    date: '2025-03-15',
    startTime: '18:00',
    endTime: '20:00',
    location: 'Club Rooms',
    status: 'upcoming',
    notes: 'Awards and season wrap.',
  },
  {
    id: 'ev-8',
    title: 'Technique Assessment - Backstroke',
    swimmerId: 'sw-oliver',
    swimmerName: 'Oliver Visentini',
    type: 'assessment',
    date: '2025-03-18',
    startTime: '16:00',
    endTime: '17:00',
    location: 'State Swim Academy',
    status: 'registered',
  },
  {
    id: 'ev-9',
    title: 'Junior Squad Training',
    swimmerId: 'sw-oliver',
    swimmerName: 'Oliver Visentini',
    type: 'training',
    date: '2025-03-13',
    startTime: '17:30',
    endTime: '19:00',
    location: 'City Aquatic Centre',
    status: 'upcoming',
  },
  {
    id: 'ev-10',
    title: 'Regional Qualifier Meet',
    swimmerId: 'sw-oliver',
    swimmerName: 'Oliver Visentini',
    type: 'competition',
    date: '2025-03-21',
    startTime: '08:00',
    endTime: '14:00',
    location: 'Metro Aquatic Centre',
    status: 'registered',
    notes: 'Warm-up 7:15am.',
  },
  // Unassigned / club-level (for coach/team view)
  {
    id: 'ev-11',
    title: 'Squad Time Trial',
    swimmerId: null,
    swimmerName: null,
    type: 'competition',
    date: '2025-03-16',
    startTime: '09:00',
    endTime: '12:00',
    location: 'City Aquatic Centre',
    status: 'upcoming',
  },
  {
    id: 'ev-12',
    title: 'Coaches Workshop',
    swimmerId: null,
    swimmerName: null,
    type: 'club-event',
    date: '2025-03-19',
    startTime: '18:00',
    endTime: '20:00',
    location: 'Online',
    status: 'upcoming',
  },
]

/** Unique swimmer names from events (for parent filter). */
export function getSwimmerNamesFromEvents(events: CalendarEvent[]): string[] {
  const set = new Set<string>()
  events.forEach((e) => {
    if (e.swimmerName) set.add(e.swimmerName)
  })
  return Array.from(set).sort()
}
