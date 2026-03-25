import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { ROUTES } from '../routes'
import { PageSection } from '../components/layout/PageSection'
import { ClubSwimmerRow, ClubEmptyState } from '../components/club'
import { PATHWAY_STAGES } from '../theme/tokens'

export function ClubSwimmers() {
  const navigate = useNavigate()
  const { accountType, clubSwimmers, clubClasses } = useApp()
  const [search, setSearch] = useState('')
  const [filterAgeGroup, setFilterAgeGroup] = useState('')
  const [filterClassId, setFilterClassId] = useState('')
  const [filterPathwayStageId, setFilterPathwayStageId] = useState('')

  const ageGroupOptions = useMemo(
    () => [...new Set(clubSwimmers.map((s) => s.ageGroup).filter(Boolean))].sort(),
    [clubSwimmers]
  )

  const filtered = useMemo(() => {
    let list = clubSwimmers
    if (search.trim()) {
      list = list.filter((s) =>
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (filterAgeGroup) list = list.filter((s) => s.ageGroup === filterAgeGroup)
    if (filterClassId) list = list.filter((s) => s.classId === filterClassId)
    if (filterPathwayStageId) list = list.filter((s) => s.pathwayStageId === filterPathwayStageId)
    return list
  }, [clubSwimmers, search, filterAgeGroup, filterClassId, filterPathwayStageId])

  if (accountType !== 'club') {
    return (
      <PageSection title="Swimmers">
        <p className="text-text-muted">This page is for club accounts.</p>
      </PageSection>
    )
  }

  return (
    <PageSection
      title="Swimmers"
      subtitle="Manage your club roster."
    >
      <div className="flex flex-wrap items-center gap-4 mb-4">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name"
            className="rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-sm text-text-primary w-64"
          />
          <label className="flex items-center gap-2">
            <span className="text-xs font-medium text-text-muted">Age group</span>
            <select
              value={filterAgeGroup}
              onChange={(e) => setFilterAgeGroup(e.target.value)}
              className="rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-sm text-text-primary min-w-[6rem]"
            >
              <option value="">All</option>
              {ageGroupOptions.map((ag) => (
                <option key={ag} value={ag}>{ag}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span className="text-xs font-medium text-text-muted">Class</span>
            <select
              value={filterClassId}
              onChange={(e) => setFilterClassId(e.target.value)}
              className="rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-sm text-text-primary min-w-[8rem]"
            >
              <option value="">All</option>
              {clubClasses.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span className="text-xs font-medium text-text-muted">Pathway stage</span>
            <select
              value={filterPathwayStageId}
              onChange={(e) => setFilterPathwayStageId(e.target.value)}
              className="rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-sm text-text-primary min-w-[8rem]"
            >
              <option value="">All</option>
              {PATHWAY_STAGES.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </label>
          <span className="text-sm text-text-muted">{filtered.length} swimmers</span>
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
                  <th className="px-4 py-3 font-medium text-text-muted">Class</th>
                  <th className="px-4 py-3 font-medium text-text-muted">Pathway stage</th>
                  <th className="px-4 py-3 font-medium text-text-muted">Attendance</th>
                  <th className="px-4 py-3 font-medium text-text-muted">Latest stat</th>
                  <th className="px-4 py-3 font-medium text-text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
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

    </PageSection>
  )
}
