import { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import type { ClubSwimmer } from '../../types/club'

export type InvitePayload = {
  email: string
  memberId: string
  name: string
  swimmerId?: string
}

type Props = {
  open: boolean
  onClose: () => void
  swimmer: ClubSwimmer | null
  onSend?: (payload: InvitePayload) => void
}

export function InviteSwimmerModal({ open, onClose, swimmer, onSend }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [memberId, setMemberId] = useState('')

  useEffect(() => {
    if (swimmer) {
      setName(`${swimmer.firstName} ${swimmer.lastName}`.trim())
      setEmail(swimmer.contactEmail ?? '')
      setMemberId(swimmer.id)
    } else {
      setName('')
      setEmail('')
      setMemberId('')
    }
  }, [swimmer])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    onSend?.({
      name: name.trim(),
      email: email.trim(),
      memberId: memberId.trim(),
      ...(swimmer ? { swimmerId: swimmer.id } : {}),
    })
    onClose()
  }

  if (!open) return null

  return (
    <Modal open={open} onClose={onClose} title="Send invitation">
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <p className="text-sm text-text-secondary">
          {swimmer
            ? 'Send an invitation to this swimmer. Their details are pre-filled; you can edit the email and member ID.'
            : 'Invite a swimmer to join your club. Enter their details below.'}
        </p>
        <div>
          <label htmlFor="invite-name" className="mb-1 block text-xs font-medium text-text-muted">
            Name
          </label>
          <input
            id="invite-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="First and last name"
            className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            readOnly={!!swimmer}
          />
        </div>
        <div>
          <label htmlFor="invite-email" className="mb-1 block text-xs font-medium text-text-muted">
            Email
          </label>
          <input
            id="invite-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="swimmer@example.com"
            className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        <div>
          <label htmlFor="invite-member-id" className="mb-1 block text-xs font-medium text-text-muted">
            Member ID / number
          </label>
          <input
            id="invite-member-id"
            type="text"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            placeholder="Optional"
            className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[var(--radius-button)] px-4 py-2 text-sm font-medium text-text-secondary hover:bg-bg-elevated"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!email.trim()}
            className="rounded-[var(--radius-button)] bg-accent px-4 py-2 text-sm font-medium text-bg disabled:opacity-50"
          >
            Send invitation
          </button>
        </div>
      </form>
    </Modal>
  )
}
