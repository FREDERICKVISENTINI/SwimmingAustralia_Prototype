import { useParams, Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { PageSection } from '../components/layout/PageSection'
import { Card } from '../components/ui/Card'
import { ROUTES } from '../routes'

export function InstructorDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { accountType, clubInstructors, clubClasses } = useApp()

  const instructor = id ? (clubInstructors.find((i) => i.id === id) ?? null) : null
  const assignedClasses = instructor
    ? clubClasses.filter((c) => instructor.classIds.includes(c.id))
    : []

  if (accountType !== 'club') {
    return (
      <PageSection title="Instructor">
        <p className="text-text-muted">This page is for club accounts.</p>
      </PageSection>
    )
  }

  if (!instructor) {
    return (
      <PageSection title="Instructor not found">
        <Card className="p-6">
          <p className="text-text-muted">This instructor could not be found.</p>
          <Link to={ROUTES.app.classes} className="mt-3 inline-block text-sm font-medium text-accent hover:underline">
            ← Back to Class management
          </Link>
        </Card>
      </PageSection>
    )
  }

  return (
    <PageSection
      title={instructor.fullName}
      subtitle="Instructor profile and compliance."
    >
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(ROUTES.app.classes)}
          className="text-sm font-medium text-accent hover:underline"
        >
          ← Back to Class management
        </button>
      </div>

      <div className="space-y-6">
        {/* Contact & identity */}
        <section className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
            Contact & identity
          </h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-xs text-text-muted">Member number</dt>
              <dd className="font-mono font-medium text-text-primary">{instructor.memberNumber}</dd>
            </div>
            <div>
              <dt className="text-xs text-text-muted">Email</dt>
              <dd>
                <a
                  href={`mailto:${instructor.email}`}
                  className="font-medium text-accent hover:underline"
                >
                  {instructor.email}
                </a>
              </dd>
            </div>
            {instructor.phone && (
              <div>
                <dt className="text-xs text-text-muted">Phone</dt>
                <dd>
                  <a
                    href={`tel:${instructor.phone.replace(/\s/g, '')}`}
                    className="font-medium text-accent hover:underline"
                  >
                    {instructor.phone}
                  </a>
                </dd>
              </div>
            )}
            {instructor.accreditationLevel && (
              <div>
                <dt className="text-xs text-text-muted">Accreditation</dt>
                <dd className="font-medium text-text-primary">{instructor.accreditationLevel}</dd>
              </div>
            )}
          </dl>
        </section>

        {/* Compliance */}
        <section className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
            Compliance
          </h2>
          <ul className="mt-4 space-y-2">
            <li className="flex items-center justify-between rounded-lg border border-border/60 bg-bg-elevated/30 px-4 py-3">
              <span className="text-sm font-medium text-text-primary">Bank details</span>
              {instructor.bankDetailsComplete ? (
                <span className="text-xs font-medium text-success">Completed</span>
              ) : (
                <span className="text-xs font-medium text-amber-500">Not completed</span>
              )}
            </li>
            <li className="flex items-center justify-between rounded-lg border border-border/60 bg-bg-elevated/30 px-4 py-3">
              <span className="text-sm font-medium text-text-primary">Working with Children</span>
              {instructor.workingWithChildrenComplete ? (
                <span className="text-xs font-medium text-success">Verified</span>
              ) : (
                <span className="text-xs font-medium text-amber-500">Not verified</span>
              )}
            </li>
          </ul>
        </section>

        {/* Assigned classes */}
        <section className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
            Assigned classes
          </h2>
          {assignedClasses.length === 0 ? (
            <p className="mt-4 text-sm text-text-muted">Not assigned to any classes yet.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {assignedClasses.map((c) => (
                <li key={c.id}>
                  <Link
                    to={ROUTES.app.classDetail(c.id)}
                    className="block rounded-lg border border-border/60 bg-bg-elevated/30 px-4 py-3 text-sm font-medium text-text-primary transition-colors hover:border-accent/40 hover:bg-bg-elevated/50"
                  >
                    {c.name}
                    <span className="ml-2 text-xs text-text-muted">· {c.trainingDays} · {c.trainingTimes}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Notes */}
        {instructor.notes && (
          <section className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
              Notes
            </h2>
            <p className="mt-4 text-sm text-text-primary whitespace-pre-wrap">{instructor.notes}</p>
          </section>
        )}
      </div>
    </PageSection>
  )
}
