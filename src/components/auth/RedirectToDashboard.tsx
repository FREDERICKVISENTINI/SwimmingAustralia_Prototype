import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { ROUTES } from '../../routes'

export function RedirectToDashboard() {
  const { accountType } = useApp()
  const navigate = useNavigate()
  const to =
    accountType == null
      ? ROUTES.signIn
      : accountType === 'club'
        ? ROUTES.app.teamDashboard
        : accountType === 'federation'
          ? ROUTES.app.federationDashboard
          : ROUTES.app.dashboard

  useEffect(() => {
    navigate(to, { replace: true })
  }, [navigate, to])

  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <p className="text-text-secondary">Taking you to your dashboard…</p>
    </div>
  )
}
