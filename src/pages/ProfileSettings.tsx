import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { PageSection } from '../components/layout/PageSection'
import { ROUTES } from '../routes'
import { Check } from 'lucide-react'

function SavedBanner() {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
      <Check className="h-3.5 w-3.5" /> Saved
    </span>
  )
}

export function ProfileSettings() {
  const { user } = useApp()

  // Account details form state
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [accountSaved, setAccountSaved] = useState(false)

  // Data & privacy toggles
  const [consentPathwayAnalytics, setConsentPathwayAnalytics] = useState(true)
  const [consentClubDataSharing, setConsentClubDataSharing] = useState(true)
  const [consentResearchAggregated, setConsentResearchAggregated] = useState(false)
  const [privacySaved, setPrivacySaved] = useState(false)
  const [exportRequested, setExportRequested] = useState(false)

  const handleAccountSave = (e: React.FormEvent) => {
    e.preventDefault()
    setAccountSaved(true)
    setCurrentPassword('')
    setNewPassword('')
    setTimeout(() => setAccountSaved(false), 3000)
  }

  const handlePrivacySave = (e: React.FormEvent) => {
    e.preventDefault()
    setPrivacySaved(true)
    setTimeout(() => setPrivacySaved(false), 3000)
  }

  const handleExportRequest = () => {
    setExportRequested(true)
  }

  const inputClass =
    'w-full rounded-[var(--radius-button)] border border-border bg-bg-elevated px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent'

  const labelClass = 'mb-1 block text-sm font-medium text-text-secondary'

  const Toggle = ({
    checked,
    onChange,
    id,
  }: {
    checked: boolean
    onChange: (v: boolean) => void
    id: string
  }) => (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-10 shrink-0 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg-elevated ${
        checked ? 'border-accent bg-accent/30' : 'border-border bg-bg-elevated'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full shadow-sm transition-transform ${
          checked ? 'translate-x-4 bg-accent' : 'translate-x-0.5 bg-text-muted'
        }`}
      />
    </button>
  )

  return (
    <PageSection
      title="Settings"
      subtitle="Manage your account details and privacy preferences."
    >
      <div className="space-y-6 max-w-2xl">

        {/* Account details */}
        <div className="rounded-[var(--radius-card)] border border-border/80 bg-card p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-base font-semibold text-text-primary">Account details</h2>
            {accountSaved && <SavedBanner />}
          </div>
          <form onSubmit={handleAccountSave} className="space-y-4">
            <div>
              <label htmlFor="settings-name" className={labelClass}>Full name</label>
              <input
                id="settings-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="settings-email" className={labelClass}>Email address</label>
              <input
                id="settings-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@example.com"
              />
            </div>
            <div className="border-t border-border/60 pt-4">
              <p className="text-xs font-medium uppercase tracking-wider text-text-muted mb-3">Change password</p>
              <div className="space-y-3">
                <div>
                  <label htmlFor="settings-current-pw" className={labelClass}>Current password</label>
                  <input
                    id="settings-current-pw"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={inputClass}
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label htmlFor="settings-new-pw" className={labelClass}>New password</label>
                  <input
                    id="settings-new-pw"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={inputClass}
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                className="rounded-[var(--radius-button)] bg-accent px-4 py-2 text-sm font-medium text-bg transition-colors hover:bg-accent-bright"
              >
                Save changes
              </button>
              <Link to={ROUTES.app.profile} className="text-sm text-text-muted hover:text-text-primary">
                ← Back to profile
              </Link>
            </div>
          </form>
        </div>

        {/* Data & privacy */}
        <div className="rounded-[var(--radius-card)] border border-border/80 bg-card p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-base font-semibold text-text-primary">Data & privacy</h2>
            {privacySaved && <SavedBanner />}
          </div>
          <form onSubmit={handlePrivacySave} className="space-y-5">
            <p className="text-sm text-text-secondary">
              Control how your data and your swimmers' data is used within the Swimming Australia platform.
            </p>

            {/* Consent toggles */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <label htmlFor="consent-pathway" className="text-sm font-medium text-text-primary">Pathway analytics</label>
                  <p className="mt-0.5 text-xs text-text-muted">Allow your swimmers' progression data to be used to personalise pathway recommendations and stage transitions.</p>
                </div>
                <Toggle id="consent-pathway" checked={consentPathwayAnalytics} onChange={setConsentPathwayAnalytics} />
              </div>
              <div className="border-t border-border/60 pt-4 flex items-start justify-between gap-4">
                <div>
                  <label htmlFor="consent-club" className="text-sm font-medium text-text-primary">Club data sharing</label>
                  <p className="mt-0.5 text-xs text-text-muted">Allow your club and assigned coaches to view your swimmers' profile data, results, and pathway stage.</p>
                </div>
                <Toggle id="consent-club" checked={consentClubDataSharing} onChange={setConsentClubDataSharing} />
              </div>
              <div className="border-t border-border/60 pt-4 flex items-start justify-between gap-4">
                <div>
                  <label htmlFor="consent-research" className="text-sm font-medium text-text-primary">Anonymised research</label>
                  <p className="mt-0.5 text-xs text-text-muted">Opt in to contribute anonymised, aggregated data to Swimming Australia research programs. No personally identifiable information is shared.</p>
                </div>
                <Toggle id="consent-research" checked={consentResearchAggregated} onChange={setConsentResearchAggregated} />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1 border-t border-border/60">
              <button
                type="submit"
                className="rounded-[var(--radius-button)] bg-accent px-4 py-2 text-sm font-medium text-bg transition-colors hover:bg-accent-bright"
              >
                Save preferences
              </button>
            </div>
          </form>

          {/* Data held + export */}
          <div className="mt-6 border-t border-border/60 pt-5 space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Data held on your account</p>
            <ul className="space-y-1.5 text-sm text-text-secondary">
              <li className="flex justify-between">
                <span>Account details</span>
                <span className="text-text-muted">Name, email</span>
              </li>
              <li className="flex justify-between">
                <span>Swimmer profiles</span>
                <span className="text-text-muted">Name, DOB, gender, pathway stage, program</span>
              </li>
              <li className="flex justify-between">
                <span>Calendar events</span>
                <span className="text-text-muted">Training sessions, competitions, assessments</span>
              </li>
              <li className="flex justify-between">
                <span>Payment records</span>
                <span className="text-text-muted">Fee history for your swimmers</span>
              </li>
            </ul>
            <div className="pt-2">
              {exportRequested ? (
                <p className="text-sm text-success">
                  Export requested. You'll receive a download link at your registered email within 24 hours.
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleExportRequest}
                  className="rounded-[var(--radius-button)] border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
                >
                  Request data export
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </PageSection>
  )
}
