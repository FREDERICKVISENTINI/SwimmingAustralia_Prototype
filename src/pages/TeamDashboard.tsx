import { useApp } from '../context/AppContext'
import type { TeamProfile } from '../context/AppContext'
import { PageSection } from '../components/layout/PageSection'
import { Card } from '../components/ui/Card'
import { PATHWAY_STAGES } from '../theme/tokens'

const ORG_TYPE_LABELS: Record<TeamProfile['organisationType'], string> = {
  club: 'Club',
  'swim school': 'Swim school',
  'squad program': 'Squad program',
  'state program': 'State program',
}

const FUTURE_PLACEHOLDERS = {
  assessments: 'Team-level assessments and development tracking will appear here.',
  squadInsights: 'Squad insights and progression analytics will be available here.',
  clubServices: 'Club services and premium offerings will be listed here.',
}

export function TeamDashboard() {
  const { teamProfile } = useApp()

  if (!teamProfile) {
    return (
      <PageSection title="Team dashboard">
        <Card>
          <p className="text-text-muted">No team profile yet.</p>
          <p className="mt-2 text-sm text-text-secondary">
            Complete club onboarding to set up your team dashboard.
          </p>
        </Card>
      </PageSection>
    )
  }

  const orgTypeLabel = ORG_TYPE_LABELS[teamProfile.organisationType] ?? teamProfile.organisationType
  const pathwayStageLabel =
    PATHWAY_STAGES.find((s) => s.id === teamProfile.primaryPathwayStageServed)?.label ??
    teamProfile.primaryPathwayStageServed

  return (
    <PageSection
      title={teamProfile.organisationName}
      subtitle="Manage your organisation and swimmers on the pathway."
    >
      {/* Team hero */}
      <div className="rounded-[var(--radius-card)] border border-border bg-bg-elevated p-6 shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-block rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-medium text-accent">
              Team account
            </span>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-text-primary md:text-3xl">
              {teamProfile.organisationName}
            </h2>
            <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
              <span className="text-text-secondary">{orgTypeLabel}</span>
              <span className="text-text-muted">·</span>
              <span className="text-text-secondary">{teamProfile.state}</span>
              <span className="text-text-muted">·</span>
              <span className="font-medium text-success">{pathwayStageLabel}</span>
            </dl>
          </div>
        </div>
      </div>

      {/* Team summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
            Linked swimmers
          </p>
          <p className="mt-1 font-display text-2xl font-semibold text-text-primary">0</p>
          <p className="mt-0.5 text-xs text-text-muted">Profiles will appear when linked</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
            Pathway stage served
          </p>
          <p className="mt-1 font-medium text-success">{pathwayStageLabel}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
            Onboarding status
          </p>
          <p className="mt-1 font-medium text-success">Complete</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
            Profile completeness
          </p>
          <p className="mt-1 font-medium text-text-primary">Setup complete</p>
        </Card>
      </div>

      {/* Roster placeholder */}
      <Card>
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
          Swimmer Profiles
        </h3>
        <p className="mt-2 text-sm text-text-secondary">
          Linked swimmer profiles will appear here. You will be able to view progression, manage roster, and support pathway visibility.
        </p>
        <div className="mt-4 space-y-2">
          <div className="rounded-lg border border-dashed border-border bg-bg-elevated/50 py-8 text-center">
            <p className="text-sm text-text-muted">No swimmers linked yet</p>
            <p className="mt-1 text-xs text-text-secondary">Linking and roster tools will be available here.</p>
          </div>
        </div>
      </Card>

      {/* Pathway support */}
      <Card className="border-success/30">
        <p className="text-sm text-text-secondary">
          This team account will support swimmer progression, profile visibility, and future access to performance services.
        </p>
      </Card>

      {/* Future modules */}
      <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
        Coming soon
      </h3>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card variant="dashed">
          <h4 className="font-display text-sm font-semibold text-text-primary">
            Assessments
          </h4>
          <p className="mt-2 text-sm text-text-muted">
            {FUTURE_PLACEHOLDERS.assessments}
          </p>
        </Card>
        <Card variant="dashed">
          <h4 className="font-display text-sm font-semibold text-text-primary">
            Squad insights
          </h4>
          <p className="mt-2 text-sm text-text-muted">
            {FUTURE_PLACEHOLDERS.squadInsights}
          </p>
        </Card>
        <Card variant="dashed">
          <h4 className="font-display text-sm font-semibold text-text-primary">
            Club services
          </h4>
          <p className="mt-2 text-sm text-text-muted">
            {FUTURE_PLACEHOLDERS.clubServices}
          </p>
        </Card>
      </div>
    </PageSection>
  )
}
