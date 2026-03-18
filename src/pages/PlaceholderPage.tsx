import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { PageSection } from '../components/layout/PageSection'
import { ROUTES } from '../routes'

const PAGE_CONFIG: Record<string, {
  title: string
  subtitle: string
  sections: { heading: string; body: string }[]
  backLabel?: string
  backTo?: string
}> = {
  Assessments: {
    title: 'Assessments',
    subtitle: 'Track swimmer assessments, technique evaluations, and progression checkpoints.',
    sections: [
      {
        heading: 'Technique assessments',
        body: 'Coach-led evaluations of stroke technique, turns, and starts. Results feed into the pathway engine and talent identification system.',
      },
      {
        heading: 'Progression checkpoints',
        body: 'Milestone assessments that confirm a swimmer is ready to advance to the next pathway stage. Linked to your swimmer\'s profile history.',
      },
      {
        heading: 'Assessment history',
        body: 'A full timeline of past assessments — who conducted them, the outcome, and any coach notes. Parents and swimmers can view their record; clubs manage their own assessment logs.',
      },
    ],
    backLabel: 'Back to dashboard',
    backTo: ROUTES.app.dashboard,
  },
  'Profile settings': {
    title: 'Profile settings',
    subtitle: 'Manage account details, notification preferences, and privacy controls.',
    sections: [
      {
        heading: 'Account details',
        body: 'Update your email address, password, and contact information. Changes take effect immediately.',
      },
      {
        heading: 'Notification preferences',
        body: 'Choose how you receive updates — in-app, email, or both — for pathway milestones, payment reminders, and club communications.',
      },
      {
        heading: 'Data & privacy',
        body: 'View what data is held about your account and swimmers, manage consent preferences, and request data exports or deletion.',
      },
    ],
    backLabel: 'Back to profile',
    backTo: ROUTES.app.profile,
  },
  Services: {
    title: 'Services',
    subtitle: 'Explore specialist services and development programs available at your pathway stage.',
    sections: [
      {
        heading: 'Biomechanics & technique analysis',
        body: 'Video-based stroke analysis and expert feedback from accredited practitioners. Available at competitive and state pathway stages.',
      },
      {
        heading: 'Strength & conditioning',
        body: 'Sport-specific conditioning programs designed for swimmers, matched to your current pathway stage and training load.',
      },
      {
        heading: 'Nutrition & performance',
        body: 'Accredited sports dietitian consultations and meal planning resources for swimmers in squad and competitive programs.',
      },
      {
        heading: 'Mental performance coaching',
        body: 'Pre-competition preparation, goal-setting frameworks, and resilience tools for athletes moving through the pathway.',
      },
    ],
    backLabel: 'Back to dashboard',
    backTo: ROUTES.app.dashboard,
  },
}

type Props = {
  name?: string
}

export function PlaceholderPage({ name = 'Page' }: Props) {
  const { accountType } = useApp()
  const config = PAGE_CONFIG[name]

  if (!config) {
    return (
      <PageSection title={name} subtitle="This section is being built.">
        <div className="rounded-[var(--radius-card)] border border-dashed border-border/80 bg-card/60 p-8 text-center">
          <p className="text-text-secondary">Coming soon for {accountType ?? 'your account'} accounts.</p>
          <Link to={ROUTES.app.dashboard} className="mt-3 inline-block text-sm font-medium text-accent hover:text-accent-bright">
            ← Back to dashboard
          </Link>
        </div>
      </PageSection>
    )
  }

  return (
    <PageSection title={config.title} subtitle={config.subtitle}>
      <div className="space-y-4">
        {config.sections.map((s) => (
          <div
            key={s.heading}
            className="rounded-[var(--radius-card)] border border-border/80 bg-card p-5 shadow-[var(--shadow-card)]"
          >
            <h3 className="font-display text-sm font-semibold text-text-primary">{s.heading}</h3>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">{s.body}</p>
          </div>
        ))}
        <div className="rounded-[var(--radius-card)] border border-dashed border-border/60 bg-card/40 p-5">
          <p className="text-sm text-text-muted">Full functionality for this section is on the roadmap. The structure and data model are in place — this view will be built out in the next product phase.</p>
          {config.backTo && (
            <Link to={config.backTo} className="mt-3 inline-block text-sm font-medium text-accent hover:text-accent-bright">
              ← {config.backLabel}
            </Link>
          )}
        </div>
      </div>
    </PageSection>
  )
}
