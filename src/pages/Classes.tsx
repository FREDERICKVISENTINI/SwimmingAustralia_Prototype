import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { PageSection } from '../components/layout/PageSection'
import { ClassCard, ClubEmptyState, InstructorsSection } from '../components/club'
import { Modal } from '../components/ui/Modal'
import type { SwimClass } from '../types/club'
import { PATHWAY_STAGES } from '../theme/tokens'

const CLASS_TYPE_LABELS: Record<SwimClass['classType'], string> = {
  'learn-to-swim': 'Learn-to-Swim',
  'junior-squad': 'Junior Squad',
  'competitive-squad': 'Competitive Squad',
  'state-prep': 'State Prep',
  'elite-program': 'Elite Program',
}

export function Classes() {
  const { accountType, clubClasses, clubSwimmers, clubInstructors, addClubClass } = useApp()
  const enrolledCountByClassId = useMemo(() => {
    const m = new Map<string, number>()
    clubSwimmers.forEach((s) => {
      if (s.classId) m.set(s.classId, (m.get(s.classId) ?? 0) + 1)
    })
    return m
  }, [clubSwimmers])
  const [createOpen, setCreateOpen] = useState(false)
  const [newClass, setNewClass] = useState<Partial<SwimClass>>({
    name: '',
    classType: 'junior-squad',
    coachName: 'Sarah Chen',
    ageGroup: '',
    trainingDays: '',
    trainingTimes: '',
    capacity: 14,
    status: 'active',
    pathwayStageId: 'junior-squad',
  })

  if (accountType !== 'club') {
    return (
      <PageSection title="Classes">
        <p className="text-text-muted">This page is for club accounts.</p>
      </PageSection>
    )
  }

  const handleCreate = () => {
    if (!newClass.name?.trim()) return
    addClubClass({
      name: newClass.name!,
      classType: newClass.classType!,
      coachId: 'coach-1',
      coachName: newClass.coachName!,
      ageGroup: newClass.ageGroup || '—',
      swimmerCount: 0,
      trainingDays: newClass.trainingDays || '—',
      trainingTimes: newClass.trainingTimes || '—',
      capacity: newClass.capacity ?? 14,
      status: 'active',
      pathwayStageId: newClass.pathwayStageId!,
    })
    setNewClass((prev) => ({ ...prev, name: '', ageGroup: '' }))
    setCreateOpen(false)
  }

  return (
    <PageSection
      title="Classes"
      subtitle="Manage training groups, squads, and class lists."
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-text-secondary">{clubClasses.length} classes</p>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="rounded-[var(--radius-button)] bg-accent px-4 py-2 text-sm font-medium text-bg"
        >
          Create class
        </button>
      </div>

      {clubClasses.length === 0 ? (
        <ClubEmptyState
          title="No classes yet"
          description="Create a class to manage swimmers and sessions."
          ctaLabel="Create class"
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

      <div className="mt-8">
        <InstructorsSection instructors={clubInstructors} />
      </div>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create class">
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
  newClass,
  setNewClass,
  onSave,
  onCancel,
}: {
  newClass: Partial<SwimClass>
  setNewClass: (c: Partial<SwimClass>) => void
  onSave: () => void
  onCancel: () => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-xs text-text-muted">Class name</label>
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
