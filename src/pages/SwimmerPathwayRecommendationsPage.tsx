import { Navigate, useParams } from 'react-router-dom'
import { ROUTES } from '../routes'

/** Legacy URL: `/swimmers/:id/pathway` → same page, pathway block under Details. */
export function SwimmerPathwayRecommendationsPage() {
  const { id } = useParams<{ id: string }>()
  if (!id) return <Navigate to={ROUTES.app.classes} replace />
  return <Navigate to={`${ROUTES.app.swimmerDetail(id)}#pathway`} replace />
}
