import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { PageSection } from '../components/layout/PageSection'
import { EventForm } from '../components/events/EventForm'
import { ROUTES } from '../routes'

export function CreateEventPage() {
  const { accountType, addClubEvent, clubClasses, user, teamProfile } = useApp()
  const navigate = useNavigate()

  if (accountType !== 'club') {
    return (
      <PageSection title="Create event">
        <p className="text-text-muted">Only club accounts can create events.</p>
      </PageSection>
    )
  }

  return (
    <PageSection title="Create event" subtitle="Fill in the details below to create and publish a new event.">
      <div className="max-w-2xl">
        <EventForm
          squads={clubClasses}
          homePool={teamProfile?.homePool}
          initial={{ coachName: user?.name ?? '' }}
          onSave={(values) => {
            addClubEvent(values)
            navigate(ROUTES.app.events)
          }}
          onCancel={() => navigate(ROUTES.app.events)}
        />
      </div>
    </PageSection>
  )
}
