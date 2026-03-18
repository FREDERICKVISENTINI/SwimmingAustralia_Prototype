import { flushSync } from 'react-dom'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { ROUTES } from '../routes'

export function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn, signInAsClubDemo, signInAsFederationDemo } = useApp()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    flushSync(() => {
      signIn(email || 'demo@ausswim.com', password || '')
    })
    navigate(ROUTES.app.dashboard, { replace: true })
    window.scrollTo(0, 0)
  }

  const handleClubDemo = () => {
    flushSync(() => {
      signInAsClubDemo()
    })
    navigate(ROUTES.app.teamDashboard, { replace: true })
  }

  const handleFederationDemo = () => {
    flushSync(() => {
      signInAsFederationDemo()
    })
    // Ensure federation users land on the Federation Dashboard (national oversight page).
    navigate(ROUTES.app.federationDashboard, { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 sm:py-12" style={{ backgroundColor: '#031B34' }}>
      <div className="w-full max-w-md" style={{ color: '#F4F8FC' }}>
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl font-semibold md:text-3xl" style={{ color: '#F4F8FC', fontFamily: 'Outfit, system-ui, sans-serif' }}>
            Swimming Australia
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#8FB2C9' }}>
            Sign in to your account
          </p>
        </div>
        <div style={{ backgroundColor: '#0D3558', border: '1px solid #1D4C73', borderRadius: '0.75rem', padding: '1.25rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.15)' }}>
          <button
            type="button"
            className="w-full rounded-lg border px-4 py-2.5 font-medium transition-colors hover:opacity-90"
            style={{ backgroundColor: 'transparent', borderColor: '#1D4C73', color: '#F4F8FC' }}
          >
            Log in via Swim Central
          </button>
          <p className="my-4 text-center text-xs" style={{ color: '#8FB2C9' }}>
            or sign in with email
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium" style={{ color: '#D7E6F2' }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2"
                style={{ backgroundColor: '#06294A', borderColor: '#1D4C73', color: '#F4F8FC' }}
                placeholder="demo@ausswim.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium" style={{ color: '#D7E6F2' }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2"
                style={{ backgroundColor: '#06294A', borderColor: '#1D4C73', color: '#F4F8FC' }}
                placeholder="demo123"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg px-4 py-2.5 font-medium transition-colors hover:opacity-90"
              style={{ backgroundColor: '#35C7F3', color: '#031B34' }}
            >
              Sign in
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-sm" style={{ color: '#8FB2C9' }}>
          Don&apos;t have an account?{' '}
          <Link to={ROUTES.signUp} style={{ color: '#35C7F3', fontWeight: 500 }}>
            Sign up
          </Link>
        </p>
        <div className="mt-6 space-y-4 rounded-lg border border-[#1D4C73] bg-[#06294A]/50 p-4">
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#8FB2C9' }}>
            Demo sign-in
          </p>
          <div>
            <p className="text-sm" style={{ color: '#D7E6F2' }}>
              <strong style={{ color: '#F4F8FC' }}>Member:</strong> demo@ausswim.com / demo123
            </p>
            <p className="mt-1 text-xs" style={{ color: '#8FB2C9' }}>
              Use the form above and sign in, or leave fields blank and click Sign in.
            </p>
            <button
              type="button"
              onClick={() => {
                flushSync(() => signIn('demo@ausswim.com', 'demo123'))
                navigate(ROUTES.app.dashboard, { replace: true })
                window.scrollTo(0, 0)
              }}
              className="mt-3 w-full rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:opacity-90"
              style={{ borderColor: '#1D4C73', color: '#F4F8FC', backgroundColor: '#0D3558' }}
            >
              Sign in as Member (demo)
            </button>
          </div>
          <div className="border-t border-[#1D4C73] pt-4">
            <p className="text-sm" style={{ color: '#D7E6F2' }}>
              <strong style={{ color: '#F4F8FC' }}>Club / team admin:</strong> clubdemo@ausswim.com / demo123
            </p>
            <p className="mt-1 text-xs" style={{ color: '#8FB2C9' }}>
              City Dolphins Swim Club — team dashboard and club management.
            </p>
            <button
              type="button"
              onClick={handleClubDemo}
              className="mt-3 w-full rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:opacity-90"
              style={{ borderColor: '#1D4C73', color: '#F4F8FC', backgroundColor: '#0D3558' }}
            >
              Sign in as Club / Team Admin (demo)
            </button>
          </div>
          <div className="border-t border-[#1D4C73] pt-4">
            <p className="text-sm" style={{ color: '#D7E6F2' }}>
              <strong style={{ color: '#F4F8FC' }}>Federation:</strong> federationdemo@ausswim.com / demo123
            </p>
            <p className="mt-1 text-xs" style={{ color: '#8FB2C9' }}>
              National oversight — takes you to the Federation Dashboard (participation, talent, pipeline, club performance, events, commercial).
            </p>
            <button
              type="button"
              onClick={handleFederationDemo}
              className="mt-3 w-full rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:opacity-90"
              style={{ borderColor: '#1D4C73', color: '#F4F8FC', backgroundColor: '#0D3558' }}
            >
              Sign in as Federation (demo)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
