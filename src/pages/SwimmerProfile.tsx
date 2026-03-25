import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { PageSection } from '../components/layout/PageSection'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { ClubMetricCard } from '../components/club'
import { ROUTES } from '../routes'
import { PATHWAY_STAGES } from '../theme/tokens'
import { getPathwayStageContent } from '../data/pathwayStageContent'
import { getProgressionTimeline, getMilestoneBadges } from '../data/swimmerProgress'
import type { SwimmerProfile } from '../types'
import type { TeamProfile } from '../context/AppContext'

const ORG_TYPE_LABELS: Record<TeamProfile['organisationType'], string> = {
  club: 'Club',
  'swim school': 'Swim school',
  'squad program': 'Squad program',
  'state program': 'State program',
}

function formatDoB(dob: string) {
  if (!dob) return '—'
  const d = new Date(dob)
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
}

const GENDERS = ['Male', 'Female', 'Other']
const STATES = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA']

const emptyNewSwimmer: Omit<SwimmerProfile, 'id'> = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  state: '',
  notes: '',
  pathwayStageId: 'learn-to-swim',
  classId: null,
  className: null,
  attendanceStatus: 'active',
  latestStatDate: null,
  paymentStatus: null,
}

function ProfileRow({
  label,
  value,
  onEdit,
  editLabel = 'Change',
}: {
  label: string
  value: string
  onEdit?: () => void
  editLabel?: string
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border/60 py-3 first:pt-0 last:border-0 last:pb-0">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-text-muted">{label}</p>
        <p className="mt-0.5 font-medium text-text-primary">{value || '—'}</p>
      </div>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="text-sm font-medium text-accent hover:underline"
        >
          {editLabel}
        </button>
      )}
    </div>
  )
}

function AddSwimmerForm({
  form,
  onChange,
  onSave,
  onCancel,
  inModal = false,
}: {
  form: Omit<SwimmerProfile, 'id'>
  onChange: (v: Omit<SwimmerProfile, 'id'>) => void
  onSave: () => void
  onCancel: () => void
  inModal?: boolean
}) {
  return (
    <section className={inModal ? '' : 'rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)] md:p-6'}>
      {!inModal && (
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
          Add a swimmer
        </h2>
      )}
      {inModal && (
        <p className="mb-4 text-sm text-text-secondary">
          Add this swimmer to your family account to manage their profile, results, and pathway.
        </p>
      )}
      <div className={inModal ? 'grid gap-4 sm:grid-cols-2' : 'mt-4 grid gap-4 sm:grid-cols-2'}>
        <div>
          <label className="mb-1 block text-xs text-text-muted">First name</label>
          <input
            type="text"
            value={form.firstName}
            onChange={(e) => onChange({ ...form, firstName: e.target.value })}
            className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-text-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-text-muted">Last name</label>
          <input
            type="text"
            value={form.lastName}
            onChange={(e) => onChange({ ...form, lastName: e.target.value })}
            className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-text-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-text-muted">Date of birth</label>
          <input
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => onChange({ ...form, dateOfBirth: e.target.value })}
            className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-text-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-text-muted">Gender</label>
          <select
            value={form.gender}
            onChange={(e) => onChange({ ...form, gender: e.target.value })}
            className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-text-primary"
          >
            {GENDERS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-text-muted">Club or program</label>
          <input
            type="text"
            value={form.program}
            onChange={(e) => onChange({ ...form, program: e.target.value })}
            placeholder="e.g. City Dolphins"
            className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-text-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-text-muted">State</label>
          <select
            value={form.state}
            onChange={(e) => onChange({ ...form, state: e.target.value })}
            className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-text-primary"
          >
            <option value="">Select</option>
            {STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs text-text-muted">Pathway stage</label>
          <select
            value={form.pathwayStageId}
            onChange={(e) => onChange({ ...form, pathwayStageId: e.target.value })}
            className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-text-primary"
          >
            {PATHWAY_STAGES.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs text-text-muted">Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => onChange({ ...form, notes: e.target.value })}
            rows={2}
            className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-text-primary"
          />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onSave}
          className="rounded-[var(--radius-button)] bg-accent px-4 py-2 text-sm font-medium text-bg"
        >
          Add swimmer
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-[var(--radius-button)] border border-border px-4 py-2 text-sm font-medium text-text-secondary"
        >
          Cancel
        </button>
      </div>
    </section>
  )
}

function ClubProfileView() {
  const { teamProfile, user, clubClasses, clubSwimmers, clubPayments } = useApp()
  if (!teamProfile) return null
  const orgTypeLabel = ORG_TYPE_LABELS[teamProfile.organisationType] ?? teamProfile.organisationType
  const pathwayLabelsFromClasses = [...new Set(clubClasses.map((c) => c.pathwayStageIdId))]
    .map((id) => PATHWAY_STAGES.find((s) => s.id === id)?.label ?? id.replace(/-/g, ' '))
    .filter(Boolean)
  const pathwaySummary = pathwayLabelsFromClasses.length > 1
    ? pathwayLabelsFromClasses.join(' · ')
    : pathwayLabelsFromClasses[0] ?? null
  const totalCollected = clubPayments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  const activeClasses = clubClasses.filter((c) => c.status === 'active').length
  return (
    <PageSection title="Profile" subtitle="Organisation and account summary.">
      <div className="space-y-6">
        <section className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)] md:p-6">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">Organisation</h2>
          <p className="mt-2 font-display text-2xl font-semibold text-text-primary">{teamProfile.organisationName}</p>
          <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-text-secondary">
            <span>{orgTypeLabel}</span>
            <span className="text-text-muted">·</span>
            <span>{teamProfile.state}</span>
            {pathwaySummary && (
              <>
                <span className="text-text-muted">·</span>
                <span className="text-success">{pathwaySummary}</span>
              </>
            )}
          </dl>
          <p className="mt-3 text-sm text-text-secondary">{teamProfile.description}</p>
        </section>
        {user && (
          <section className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)] md:p-6">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">Account contact</h2>
            <p className="mt-2 font-medium text-text-primary">{user.name}</p>
            <p className="text-sm text-text-secondary">{user.email}</p>
          </section>
        )}
        <div className="grid gap-4 sm:grid-cols-3">
          <ClubMetricCard label="Active classes" value={activeClasses} />
          <ClubMetricCard label="Roster size" value={clubSwimmers.length} />
          <ClubMetricCard label="Payments collected" value={`$${totalCollected}`} />
        </div>
        <section className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)] md:p-6">
          <Link to={ROUTES.app.profileSettings} className="inline-block rounded-[var(--radius-button)] bg-accent/20 px-3 py-2 text-sm font-medium text-accent hover:bg-accent/30">
            Manage settings
          </Link>
        </section>
      </div>
    </PageSection>
  )
}

export function SwimmerProfile() {
  const {
    user,
    accountType,
    swimmers,
    activeSwimmerId,
    swimmerProfile,
    setSwimmerProfile,
    setActiveSwimmerId,
    addSwimmer,
    removeSwimmer,
    isFamilyAccount,
  } = useApp()
  const [editing, setEditing] = useState<null | 'name' | 'personal' | 'club'>(null)
  const [editForm, setEditForm] = useState<Partial<SwimmerProfile>>({})
  const [showAddSwimmer, setShowAddSwimmer] = useState(false)
  const [newSwimmer, setNewSwimmer] = useState<Omit<SwimmerProfile, 'id'>>(emptyNewSwimmer)

  if (accountType === 'club') {
    return <ClubProfileView />
  }

  const handleAddSwimmer = () => {
    if (!newSwimmer.firstName?.trim() || !newSwimmer.lastName?.trim()) return
    addSwimmer({ ...newSwimmer, pathwayStageId: newSwimmer.pathwayStageId || 'learn-to-swim' })
    setNewSwimmer(emptyNewSwimmer)
    setShowAddSwimmer(false)
  }

  if (swimmers.length === 0) {
    return (
      <PageSection title="Swimmer profile" subtitle="Add your swimmers to get started.">
        <Card className="p-6">
          <p className="text-text-muted">No swimmers on your account yet.</p>
          <p className="mt-2 text-sm text-text-secondary">
            Add a swimmer to your family account to manage their profile, results, and pathway.
          </p>
          <button
            type="button"
            onClick={() => setShowAddSwimmer(true)}
            className="mt-4 rounded-[var(--radius-button)] bg-accent px-4 py-2 text-sm font-medium text-bg"
          >
            Add a swimmer
          </button>
        </Card>
        <Modal
          open={showAddSwimmer}
          onClose={() => setShowAddSwimmer(false)}
          title="Sign up to your family account"
        >
          <AddSwimmerForm
            form={newSwimmer}
            onChange={setNewSwimmer}
            onSave={handleAddSwimmer}
            onCancel={() => setShowAddSwimmer(false)}
            inModal
          />
        </Modal>
      </PageSection>
    )
  }

  if (!swimmerProfile) {
    return (
      <PageSection title="Swimmer profile">
        <Card>
          <p className="text-text-muted">Select a swimmer or add one.</p>
          <button
            type="button"
            onClick={() => setShowAddSwimmer(true)}
            className="mt-4 rounded-[var(--radius-button)] bg-accent px-4 py-2 text-sm font-medium text-bg"
          >
            Add a swimmer
          </button>
        </Card>
        <Modal
          open={showAddSwimmer}
          onClose={() => setShowAddSwimmer(false)}
          title="Sign up to your family account"
        >
          <AddSwimmerForm
            form={newSwimmer}
            onChange={setNewSwimmer}
            onSave={handleAddSwimmer}
            onCancel={() => setShowAddSwimmer(false)}
            inModal
          />
        </Modal>
      </PageSection>
    )
  }

  const isParentManaged = accountType === 'parent'
  const fullName = [swimmerProfile.firstName, swimmerProfile.lastName].filter(Boolean).join(' ') || 'Swimmer'

  const startEdit = (section: 'name' | 'personal' | 'club') => {
    setEditing(section)
    if (section === 'name') {
      setEditForm({ firstName: swimmerProfile.firstName, lastName: swimmerProfile.lastName })
    } else if (section === 'personal') {
      setEditForm({
        dateOfBirth: swimmerProfile.dateOfBirth,
        gender: swimmerProfile.gender,
        pathwayStageId: swimmerProfile.pathwayStageId,
        notes: swimmerProfile.notes,
      })
    } else {
      setEditForm({ program: swimmerProfile.program, state: swimmerProfile.state })
    }
  }

  const saveEdit = () => {
    if (editing && Object.keys(editForm).length) {
      setSwimmerProfile({ ...swimmerProfile, ...editForm })
    }
    setEditing(null)
    setEditForm({})
  }

  const cancelEdit = () => {
    setEditing(null)
    setEditForm({})
  }

  return (
    <PageSection title="Swimmer profile" subtitle="Profile and details.">
      <div className="space-y-6">
        {swimmers.length > 1 && (
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm font-medium text-text-muted">Viewing</label>
            <select
              value={activeSwimmerId ?? ''}
              onChange={(e) => setActiveSwimmerId(e.target.value || null)}
              className="rounded-[var(--radius-button)] border border-border bg-bg-elevated px-3 py-2 text-sm text-text-primary"
            >
              {swimmers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName}
                </option>
              ))}
            </select>
          </div>
        )}

        <Modal
          open={showAddSwimmer}
          onClose={() => setShowAddSwimmer(false)}
          title="Sign up to your family account"
        >
          <AddSwimmerForm
            form={newSwimmer}
            onChange={setNewSwimmer}
            onSave={handleAddSwimmer}
            onCancel={() => setShowAddSwimmer(false)}
            inModal
          />
        </Modal>

        {/* Name and ID — stacked list layout */}
        <section className="rounded-[var(--radius-card)] border border-border bg-bg-elevated p-5 shadow-[var(--shadow-card)] md:p-6">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
            Name and ID
          </h2>
          {editing === 'name' ? (
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs text-text-muted">First name</label>
                <input
                  type="text"
                  value={editForm.firstName ?? ''}
                  onChange={(e) => setEditForm((f) => ({ ...f, firstName: e.target.value }))}
                  className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-text-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-text-muted">Last name</label>
                <input
                  type="text"
                  value={editForm.lastName ?? ''}
                  onChange={(e) => setEditForm((f) => ({ ...f, lastName: e.target.value }))}
                  className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-text-primary"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={saveEdit}
                  className="rounded-[var(--radius-button)] bg-accent px-3 py-2 text-sm font-medium text-bg"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-[var(--radius-button)] border border-border px-3 py-2 text-sm font-medium text-text-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="mt-2 font-display text-2xl font-semibold text-text-primary md:text-3xl">
                {fullName}
              </p>
              <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2 border-b border-border/60 py-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Member ID</p>
                  <p className="mt-0.5 font-medium text-text-primary">{swimmerProfile.memberId || '—'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => startEdit('name')}
                  className="text-sm font-medium text-accent hover:underline"
                >
                  Change name
                </button>
              </div>
            </>
          )}
        </section>

        <section className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)] md:p-6">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
            Personal details
          </h2>
          {editing === 'personal' ? (
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs text-text-muted">Date of birth</label>
                <input
                  type="date"
                  value={editForm.dateOfBirth ?? ''}
                  onChange={(e) => setEditForm((f) => ({ ...f, dateOfBirth: e.target.value }))}
                  className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-text-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-text-muted">Gender</label>
                <select
                  value={editForm.gender ?? ''}
                  onChange={(e) => setEditForm((f) => ({ ...f, gender: e.target.value }))}
                  className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-text-primary"
                >
                  {GENDERS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-text-muted">Pathway stage</label>
                <select
                  value={editForm.pathwayStageId ?? ''}
                  onChange={(e) => setEditForm((f) => ({ ...f, pathwayStageId: e.target.value }))}
                  className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-text-primary"
                >
                  {PATHWAY_STAGES.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-text-muted">Notes</label>
                <textarea
                  value={editForm.notes ?? ''}
                  onChange={(e) => setEditForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={2}
                  className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-text-primary"
                />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={saveEdit} className="rounded-[var(--radius-button)] bg-accent px-3 py-2 text-sm font-medium text-bg">Save</button>
                <button type="button" onClick={cancelEdit} className="rounded-[var(--radius-button)] border border-border px-3 py-2 text-sm font-medium text-text-secondary">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="mt-2 space-y-0">
              <ProfileRow
                label="Date of birth"
                value={formatDoB(swimmerProfile.dateOfBirth)}
                onEdit={() => startEdit('personal')}
              />
              <ProfileRow
                label="Gender"
                value={swimmerProfile.gender}
                onEdit={() => startEdit('personal')}
              />
              <ProfileRow
                label="Pathway stage"
                value={PATHWAY_STAGES.find((s) => s.id === swimmerProfile.pathwayStageId)?.label ?? swimmerProfile.pathwayStageId ?? '—'}
                onEdit={() => startEdit('personal')}
              />
              <ProfileRow
                label="Notes"
                value={swimmerProfile.notes}
                onEdit={() => startEdit('personal')}
              />
            </div>
          )}
        </section>

        {/* Progress: timeline, badges, next step */}
        <section className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)] md:p-6">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
            Your progress
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            Milestones and pathway progress for {fullName}.
          </p>

          {/* Milestone badges */}
          {(() => {
            const badges = getMilestoneBadges(swimmerProfile)
            if (badges.length === 0) return null
            return (
              <div className="mt-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-muted">Milestones</p>
                <div className="flex flex-wrap gap-2">
                  {badges.map((b) => (
                    <span
                      key={b.id}
                      className="inline-flex items-center rounded-full bg-accent/15 px-3 py-1 text-sm font-medium text-accent"
                      title={b.description}
                    >
                      {b.label}
                    </span>
                  ))}
                </div>
              </div>
            )
          })()}

          {/* Next pathway step */}
          {(() => {
            const content = getPathwayStageContent(swimmerProfile.pathwayStageId)
            const next = content?.nextStep
            if (!next || swimmerProfile.pathwayStageId === 'recreation') return null
            return (
              <div className="mt-4">
                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-text-muted">Next step</p>
                <p className="text-sm text-text-primary">
                  {next.stageLabel} — {next.description.slice(0, 80)}
                  {next.description.length > 80 ? '…' : ''}
                </p>
                <Link
                  to={ROUTES.app.pathway}
                  className="mt-2 inline-block text-sm font-medium text-accent hover:underline"
                >
                  {next.ctaLabel} →
                </Link>
              </div>
            )
          })()}

          {/* Progression timeline */}
          {(() => {
            const timeline = getProgressionTimeline(swimmerProfile)
            if (timeline.length === 0) return null
            return (
              <div className="mt-6">
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">Progression timeline</p>
                <ul className="space-y-0 border-l-2 border-border pl-4">
                  {timeline.map((evt, i) => (
                    <li key={`${evt.date}-${i}`} className="relative pb-4 last:pb-0">
                      <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-accent" />
                      <p className="text-sm font-medium text-text-primary">{evt.label}</p>
                      <p className="text-xs text-text-muted">
                        {new Date(evt.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })()}
        </section>

        {isParentManaged && user && (
          <section className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)] md:p-6">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
              Linked member / guardian
            </h2>
            <div className="mt-2 space-y-0">
              <div className="border-b border-border/60 py-3 first:pt-0 last:border-0">
                <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Name</p>
                <p className="mt-0.5 font-medium text-text-primary">{user.name}</p>
              </div>
              <div className="border-b border-border/60 py-3 last:border-0">
                <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Email</p>
                <p className="mt-0.5 font-medium text-text-primary">{user.email}</p>
              </div>
            </div>
          </section>
        )}

        <section className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)] md:p-6">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
            Club / program
          </h2>
          {editing === 'club' ? (
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs text-text-muted">Club or program</label>
                <input
                  type="text"
                  value={editForm.program ?? ''}
                  onChange={(e) => setEditForm((f) => ({ ...f, program: e.target.value }))}
                  placeholder="e.g. City Dolphins"
                  className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-text-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-text-muted">State</label>
                <select
                  value={editForm.state ?? ''}
                  onChange={(e) => setEditForm((f) => ({ ...f, state: e.target.value }))}
                  className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-text-primary"
                >
                  <option value="">Select</option>
                  {STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={saveEdit} className="rounded-[var(--radius-button)] bg-accent px-3 py-2 text-sm font-medium text-bg">Save</button>
                <button type="button" onClick={cancelEdit} className="rounded-[var(--radius-button)] border border-border px-3 py-2 text-sm font-medium text-text-secondary">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="mt-2 space-y-0">
              <ProfileRow
                label="Club or program"
                value={swimmerProfile.program}
                onEdit={() => startEdit('club')}
              />
              <ProfileRow
                label="State"
                value={swimmerProfile.state}
                onEdit={() => startEdit('club')}
              />
            </div>
          )}
        </section>

        {isParentManaged && (
          <section
            className={`rounded-[var(--radius-card)] border p-5 shadow-[var(--shadow-card)] md:p-6 ${
              isFamilyAccount
                ? 'border-success/40 bg-success/[0.08] ring-1 ring-success/20'
                : 'border-border bg-card'
            }`}
          >
            <h2 className="flex flex-wrap items-center gap-2 font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
              <span>Family</span>
              {isFamilyAccount && (
                <span className="rounded-full bg-success/20 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-success">
                  Family account
                </span>
              )}
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              {isFamilyAccount ? (
                <>
                  This login is a <strong className="font-medium text-success">family account</strong> — several swimmers
                  are linked here (the app treats this as one household). Swimmers on your account are listed below; use{' '}
                  <strong className="font-medium text-text-primary">View</strong> to switch the profile you&apos;re editing, or add
                  another family member.
                </>
              ) : (
                <>
                  Swimmers on your account. Select who to view above, or add another. When you add a second swimmer, this
                  section highlights as a <strong className="font-medium text-text-primary">family account</strong> for your
                  household.
                </>
              )}
            </p>
            <ul className="mt-4 space-y-2">
              {swimmers.map((s) => (
                <li
                  key={s.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-[var(--radius-button)] border border-border/60 bg-bg-elevated/50 px-3 py-2"
                >
                  <span className="font-medium text-text-primary">
                    {s.firstName} {s.lastName}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveSwimmerId(s.id)}
                      className="text-sm font-medium text-accent hover:underline"
                    >
                      View
                    </button>
                    {swimmers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSwimmer(s.id)}
                        className="text-sm text-text-muted hover:text-red-500"
                        title="Remove from account"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setShowAddSwimmer(true)}
              className="mt-4 rounded-[var(--radius-button)] border border-border border-dashed bg-transparent px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
            >
              Add another swimmer
            </button>
          </section>
        )}

        <section className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)] md:p-6">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
            Settings
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Notification preferences, contact details, and privacy.
          </p>
          <Link
            to={ROUTES.app.profileSettings}
            className="mt-3 inline-block rounded-[var(--radius-button)] bg-accent/20 px-3 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/30"
          >
            Manage settings
          </Link>
        </section>
      </div>
    </PageSection>
  )
}
