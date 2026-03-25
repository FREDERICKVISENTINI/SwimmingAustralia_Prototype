import { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Plus, CheckCircle2, AlertTriangle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { PageSection } from '../components/layout/PageSection'
import { ClassCard, ClubEmptyState, ClubSwimmerRow } from '../components/club'
import { Modal } from '../components/ui/Modal'
import type { SwimClass } from '../types/club'
import { PATHWAY_STAGES } from '../theme/tokens'
import { ROUTES } from '../routes'
type Tab = 'squads' | 'swimmers' | 'instructors'

const CLASS_TYPE_LABELS: Record<SwimClass['classType'], string> = {
  'learn-to-swim': 'Learn-to-Swim',
  'junior-squad': 'Junior Squad',
  'competitive-squad': 'Competitive Squad',
  'state-prep': 'State Prep',
  'elite-program': 'Elite Program',
}

export function Classes() {
  const navigate = useNavigate()
  const { accountType, clubClasses, clubSwimmers, clubInstructors, addClubClass, attendanceRecords } = useApp()
  const [activeTab, setActiveTab] = useState<Tab>('squads')
  const [createOpen, setCreateOpen] = useState(false)

  // — Squads tab —
  const enrolledCountByClassId = useMemo(() => {
    const m = new Map<string, number>()
    clubSwimmers.forEach((s) => { if (s.classId) m.set(s.classId, (m.get(s.classId) ?? 0) + 1) })
    return m
  }, [clubSwimmers])
  const [newClass, setNewClass] = useState<Partial<SwimClass>>({
    name: '', classType: 'junior-squad', coachName: 'Mike Torres',
    ageGroup: '', trainingDays: '', trainingTimes: '', capacity: 14,
    status: 'active', pathwayStageId: 'junior-squad',
  })
  const handleCreate = () => {
    if (!newClass.name?.trim()) return
    addClubClass({
      name: newClass.name!, classType: newClass.classType!,
      coachId: 'coach-1', coachName: newClass.coachName!,
      ageGroup: newClass.ageGroup || '—', swimmerCount: 0,
      trainingDays: newClass.trainingDays || '—',
      trainingTimes: newClass.trainingTimes || '—',
      capacity: newClass.capacity ?? 14, status: 'active',
      pathwayStageId: newClass.pathwayStageId!,
    })
    setNewClass((prev) => ({ ...prev, name: '', ageGroup: '' }))
    setCreateOpen(false)
  }

  // — Swimmers tab —
  const [search, setSearch] = useState('')
  const [filterAgeGroup, setFilterAgeGroup] = useState('')
  const [filterClassId, setFilterClassId] = useState('')
  const [filterPathwayStageId, setFilterPathwayStageId] = useState('')
  const [filterAttendance, setFilterAttendance] = useState('')
  const [filterPayment, setFilterPayment] = useState('')
  const [filterAtRisk, setFilterAtRisk] = useState(false)

  const ageGroupOptions = useMemo(
    () => [...new Set(clubSwimmers.map((s) => s.ageGroup).filter(Boolean))].sort(),
    [clubSwimmers]
  )

  const isSwimmerAtRisk = useMemo(() => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return (s: typeof clubSwimmers[number]) => {
      const noRecentStat = !s.latestStatDate || new Date(s.latestStatDate) < thirtyDaysAgo
      const paymentIssue = s.paymentStatus === 'overdue'
      const inactive = s.attendanceStatus === 'inactive'
      const records = attendanceRecords.filter((a) => a.swimmerId === s.id)
      const present = records.filter((a) => a.status === 'present').length
      const lowAttendance = records.length >= 3 && (present / records.length) < 0.6
      return noRecentStat || paymentIssue || inactive || lowAttendance
    }
  }, [attendanceRecords])

  const filteredSwimmers = useMemo(() => {
    let list = clubSwimmers
    if (search.trim()) list = list.filter((s) => `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()))
    if (filterAgeGroup) list = list.filter((s) => s.ageGroup === filterAgeGroup)
    if (filterClassId) list = list.filter((s) => s.classId === filterClassId)
    if (filterPathwayStageId) list = list.filter((s) => s.pathwayStageId === filterPathwayStageId)
    if (filterAttendance) list = list.filter((s) => s.attendanceStatus === filterAttendance)
    if (filterPayment) list = list.filter((s) => s.paymentStatus === filterPayment)
    if (filterAtRisk) list = list.filter(isSwimmerAtRisk)
    return list
  }, [clubSwimmers, search, filterAgeGroup, filterClassId, filterPathwayStageId, filterAttendance, filterPayment, filterAtRisk, isSwimmerAtRisk])

  if (accountType !== 'club') {
    return (
      <PageSection title="Squads">
        <p className="text-text-muted">This page is for club accounts.</p>
      </PageSection>
    )
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'squads', label: 'Squads' },
    { id: 'swimmers', label: 'Swimmers' },
    { id: 'instructors', label: 'Instructors' },
  ]

  return (
    <PageSection
      title="Squads"
      subtitle="Manage training groups and your club roster."
      headerAction={
        activeTab === 'squads' ? (
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-1.5 rounded-[var(--radius-button)] bg-accent px-4 py-2 text-sm font-semibold text-bg transition hover:bg-accent-bright"
          >
            <Plus className="h-4 w-4" /> Create squad
          </button>
        ) : activeTab === 'instructors' ? (
          <span className="text-xs text-text-muted">
            {clubInstructors.length} instructor{clubInstructors.length !== 1 ? 's' : ''}
          </span>
        ) : null
      }
    >
      {/* Tab bar */}
      <div className="border-b border-border bg-bg-elevated/50" role="tablist">
        <div className="flex gap-0">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={`shrink-0 border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-text-muted hover:border-border hover:text-text-secondary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Squads tab ── */}
      {activeTab === 'squads' && (
        <>
          <p className="text-sm text-text-secondary">{clubClasses.length} squad{clubClasses.length !== 1 ? 's' : ''}</p>
          {clubClasses.length === 0 ? (
            <ClubEmptyState
              title="No squads yet"
              description="Create a squad to manage swimmers and sessions."
              ctaLabel="Create squad"
              onCtaClick={() => setCreateOpen(true)}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {clubClasses.map((c) => (
                <ClassCard
                  key={c.id}
                  class={c}
                  enrolledCount={enrolledCountByClassId.get(c.id) ?? 0}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Swimmers tab ── */}
      {activeTab === 'swimmers' && (
        <>
          <div className="flex flex-wrap items-center gap-4">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name"
              className="w-64 rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-sm text-text-primary"
            />
            <label className="flex items-center gap-2">
              <span className="text-xs font-medium text-text-muted">Age group</span>
              <select
                value={filterAgeGroup}
                onChange={(e) => setFilterAgeGroup(e.target.value)}
                className="min-w-[6rem] rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-sm text-text-primary"
              >
                <option value="">All</option>
                {ageGroupOptions.map((ag) => <option key={ag} value={ag}>{ag}</option>)}
              </select>
            </label>
            <label className="flex items-center gap-2">
              <span className="text-xs font-medium text-text-muted">Squad</span>
              <select
                value={filterClassId}
                onChange={(e) => setFilterClassId(e.target.value)}
                className="min-w-[8rem] rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-sm text-text-primary"
              >
                <option value="">All</option>
                {clubClasses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
            <label className="flex items-center gap-2">
              <span className="text-xs font-medium text-text-muted">Stage</span>
              <select
                value={filterPathwayStageId}
                onChange={(e) => setFilterPathwayStageId(e.target.value)}
                className="min-w-[8rem] rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-sm text-text-primary"
              >
                <option value="">All</option>
                {PATHWAY_STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </label>
            <label className="flex items-center gap-2">
              <span className="text-xs font-medium text-text-muted">Attendance</span>
              <select
                value={filterAttendance}
                onChange={(e) => setFilterAttendance(e.target.value)}
                className="min-w-[6rem] rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-sm text-text-primary"
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on-hold">On hold</option>
              </select>
            </label>
            <label className="flex items-center gap-2">
              <span className="text-xs font-medium text-text-muted">Payment</span>
              <select
                value={filterPayment}
                onChange={(e) => setFilterPayment(e.target.value)}
                className="min-w-[6rem] rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-sm text-text-primary"
              >
                <option value="">All</option>
                <option value="paid">Paid</option>
                <option value="due">Due</option>
                <option value="overdue">Overdue</option>
                <option value="partial">Partial</option>
              </select>
            </label>
            <button
              type="button"
              onClick={() => setFilterAtRisk((v) => !v)}
              className={`flex items-center gap-1.5 rounded-[var(--radius-button)] px-3 py-2 text-xs font-semibold transition-colors ${
                filterAtRisk
                  ? 'bg-red-400/20 text-red-400 ring-1 ring-red-400/40'
                  : 'border border-border text-text-muted hover:bg-red-400/10 hover:text-red-400'
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              At risk
            </button>
            <span className="text-sm text-text-muted">{filteredSwimmers.length} swimmer{filteredSwimmers.length !== 1 ? 's' : ''}</span>
          </div>

          {clubSwimmers.length === 0 ? (
            <ClubEmptyState
              title="No swimmers yet"
              description="Add swimmers to your roster to manage classes and stats."
              ctaLabel="Add swimmer"
            />
          ) : (
            <div className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-card shadow-[var(--shadow-card)]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-bg-elevated/80">
                      <th className="px-4 py-3 font-medium text-text-muted">Name</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Age group</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Squad</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Pathway stage</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Attendance</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Latest stat</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSwimmers.map((s) => (
                      <ClubSwimmerRow
                        key={s.id}
                        swimmer={s}
                        onView={() => navigate(`${ROUTES.app.swimmerDetail(s.id)}#profile`)}
                        onViewDetails={() => navigate(`${ROUTES.app.swimmerDetail(s.id)}#details`)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Instructors tab ── */}
      {activeTab === 'instructors' && (
        <>
          {clubInstructors.length === 0 ? (
            <ClubEmptyState
              title="No instructors yet"
              description="Instructors are linked via their personal AusSwim accounts."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {clubInstructors.map((inst) => {
                const bankOk = inst.bankDetailsComplete
                const wwccOk = inst.workingWithChildrenComplete
                const hasWarning = !bankOk || !wwccOk
                const assignedSquads = clubClasses.filter((c) => inst.classIds.includes(c.id))
                return (
                  <Link
                    key={inst.id}
                    to={ROUTES.app.instructorDetail(inst.id)}
                    className={`group block rounded-[var(--radius-card)] border p-5 shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-card-hover)] hover:border-accent/30 ${
                      hasWarning ? 'border-amber-400/40 bg-amber-400/5' : 'border-border/80 bg-card'
                    }`}
                  >
                    {/* Name + accreditation */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-display text-base font-semibold text-text-primary group-hover:text-accent transition-colors">
                          {inst.fullName}
                        </p>
                        {inst.accreditationLevel && (
                          <p className="mt-0.5 text-xs text-text-muted">{inst.accreditationLevel}</p>
                        )}
                      </div>
                      {hasWarning ? (
                        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-success mt-0.5" />
                      )}
                    </div>

                    {/* Member number + contact */}
                    <div className="mt-3 space-y-1 text-sm text-text-secondary">
                      <p className="font-mono text-xs text-text-muted">{inst.memberNumber}</p>
                      {inst.email && <p className="truncate">{inst.email}</p>}
                      {inst.phone && <p>{inst.phone}</p>}
                    </div>

                    {/* Squads assigned */}
                    {assignedSquads.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {assignedSquads.map((c) => (
                          <span
                            key={c.id}
                            className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent"
                          >
                            {c.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Compliance warnings */}
                    {hasWarning && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {!bankOk && (
                          <span className="rounded bg-amber-400/20 px-2 py-0.5 text-xs font-medium text-amber-600">
                            Bank details outstanding
                          </span>
                        )}
                        {!wwccOk && (
                          <span className="rounded bg-amber-400/20 px-2 py-0.5 text-xs font-medium text-amber-600">
                            WWCC not verified
                          </span>
                        )}
                      </div>
                    )}

                    <p className="mt-4 text-xs font-medium text-accent">View profile →</p>
                  </Link>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* Create squad modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create squad">
        <ClassesCreateForm
          newClass={newClass}
          setNewClass={setNewClass}
          onSave={handleCreate}
          onCancel={() => setCreateOpen(false)}
        />
      </Modal>
    </PageSection>
  )
}

function ClassesCreateForm({
  newClass, setNewClass, onSave, onCancel,
}: {
  newClass: Partial<SwimClass>
  setNewClass: (c: Partial<SwimClass>) => void
  onSave: () => void
  onCancel: () => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-xs text-text-muted">Squad name</label>
        <input
          type="text"
          value={newClass.name ?? ''}
          onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
          className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-text-primary"
          placeholder="e.g. Junior Squad A"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-text-muted">Type</label>
        <select
          value={newClass.classType ?? 'junior-squad'}
          onChange={(e) => setNewClass({ ...newClass, classType: e.target.value as SwimClass['classType'] })}
          className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-text-primary"
        >
          {Object.entries(CLASS_TYPE_LABELS).map(([id, label]) => (
            <option key={id} value={id}>{label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs text-text-muted">Age group</label>
        <input
          type="text"
          value={newClass.ageGroup ?? ''}
          onChange={(e) => setNewClass({ ...newClass, ageGroup: e.target.value })}
          className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-text-primary"
          placeholder="e.g. 8–11"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-text-muted">Pathway stage</label>
        <select
          value={newClass.pathwayStageId ?? 'junior-squad'}
          onChange={(e) => setNewClass({ ...newClass, pathwayStageId: e.target.value })}
          className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-text-primary"
        >
          {PATHWAY_STAGES.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onSave} className="rounded-[var(--radius-button)] bg-accent px-4 py-2 text-sm font-medium text-bg">
          Create
        </button>
        <button type="button" onClick={onCancel} className="rounded-[var(--radius-button)] border border-border px-4 py-2 text-sm font-medium text-text-secondary">
          Cancel
        </button>
      </div>
    </div>
  )
}
