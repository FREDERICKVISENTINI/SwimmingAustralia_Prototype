import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { ROUTES } from '../routes'
import { Card } from '../components/ui/Card'

export function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signUp } = useApp()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    signUp(name, email, password)
    // Defer navigation so context has updated before RequireAuth runs on /account-type
    setTimeout(() => navigate(ROUTES.accountType), 0)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg p-4 sm:p-6 sm:py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="font-display text-2xl font-semibold text-text-primary md:text-3xl">
            Swimming Australia
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Create your account
          </p>
        </div>
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-text-secondary">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-[var(--radius-button)] border border-border bg-bg-elevated px-3 py-2 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-text-secondary">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-[var(--radius-button)] border border-border bg-bg-elevated px-3 py-2 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-text-secondary">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-[var(--radius-button)] border border-border bg-bg-elevated px-3 py-2 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-[var(--radius-button)] bg-accent px-4 py-2.5 font-medium text-bg transition-colors hover:bg-accent-bright"
            >
              Continue
            </button>
          </form>
        </Card>
        <p className="mt-4 text-center text-sm text-text-muted">
          Already have an account?{' '}
          <Link to={ROUTES.signIn} className="font-medium text-accent hover:text-accent-bright">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
