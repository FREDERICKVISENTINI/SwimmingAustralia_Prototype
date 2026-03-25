import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { PageSection } from '../components/layout/PageSection'
import { EventForm } from '../components/events/EventForm'
import { ROUTES } from '../routes'

export function EditEventPage() {
  const { id } = useParams<{ id: string }>()
  const { accountType, clubEvents, clubClasses, updateClubEvent, teamProfile } = useApp()
  const navigate = useNavigate()

  if (accountType !== 'club') return <Navigate to={ROUTES.app.events} replace />

  const event = clubEvents.find((e) => e.id === id)
  if (!event) return <Navigate to={ROUTES.app.events} replace />

  return (
    <PageSection title="Edit event" subtitle={event.title}>
      <div className="max-w-2xl">
        <EventForm
          squads={clubClasses}
          homePool={teamProfile?.homePool}
          initial={event}
          onSave={(values) => {
            updateClubEvent(event.id, values)
            navigate(ROUTES.app.eventDetail(event.id))
          }}
          onCancel={() => navigate(ROUTES.app.eventDetail(event.id))}
        />
      </div>
    </PageSection>
  )
}
