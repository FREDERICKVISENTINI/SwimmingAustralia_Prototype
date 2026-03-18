import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { PageSection } from '../components/layout/PageSection'
import { ClubMetricCard, PaymentRecordRow, ClubEmptyState } from '../components/club'
import { Modal } from '../components/ui/Modal'
import type { FeeType } from '../types/club'

const FEE_TYPES: { value: FeeType; label: string }[] = [
  { value: 'term', label: 'Term fee' },
  { value: 'assessment', label: 'Assessment' },
  { value: 'camp', label: 'Camp' },
  { value: 'competition', label: 'Competition' },
  { value: 'squad', label: 'Squad' },
  { value: 'other', label: 'Other' },
]

export function ClubPayments() {
  const { accountType, clubPayments, clubSwimmers, addClubPayment } = useApp()
  const [recordOpen, setRecordOpen] = useState(false)
  const [feeOpen, setFeeOpen] = useState(false)
  const [form, setForm] = useState({ swimmerId: '', feeType: 'term' as FeeType, amount: 0, dueDate: '' })

  const totalCollected = clubPayments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  const outstanding = clubPayments.filter((p) => p.status === 'due' || p.status === 'overdue').reduce((s, p) => s + p.amount, 0)
  const overdueCount = clubPayments.filter((p) => p.status === 'overdue').length
  const dueCount = clubPayments.filter((p) => p.status === 'due').length

  if (accountType !== 'club') {
    return (
      <PageSection title="Payments">
        <p className="text-text-muted">This page is for club accounts.</p>
      </PageSection>
    )
  }

  const handleRecordPayment = () => {
    const swimmer = clubSwimmers.find((s) => s.id === form.swimmerId)
    if (!swimmer || form.amount <= 0 || !form.dueDate) return
    addClubPayment({
      swimmerId: swimmer.id,
      swimmerName: `${swimmer.firstName} ${swimmer.lastName}`,
      classId: swimmer.classId,
      className: swimmer.className,
      feeType: form.feeType,
      amount: form.amount,
      dueDate: form.dueDate,
      paidDate: new Date().toISOString().slice(0, 10),
      status: 'paid',
    })
    setForm({ swimmerId: '', feeType: 'term', amount: 0, dueDate: '' })
    setRecordOpen(false)
  }

  const handleCreateFee = () => {
    const swimmer = clubSwimmers.find((s) => s.id === form.swimmerId)
    if (!swimmer || form.amount <= 0 || !form.dueDate) return
    addClubPayment({
      swimmerId: swimmer.id,
      swimmerName: `${swimmer.firstName} ${swimmer.lastName}`,
      classId: swimmer.classId,
      className: swimmer.className,
      feeType: form.feeType,
      amount: form.amount,
      dueDate: form.dueDate,
      paidDate: null,
      status: 'due',
    })
    setForm({ swimmerId: '', feeType: 'term', amount: 0, dueDate: '' })
    setFeeOpen(false)
  }

  return (
    <PageSection
      title="Payments"
      subtitle="Manage payment records and fee visibility."
    >
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          type="button"
          onClick={() => setRecordOpen(true)}
          className="rounded-[var(--radius-button)] bg-accent px-4 py-2 text-sm font-medium text-bg"
        >
          Record payment
        </button>
        <button
          type="button"
          onClick={() => setFeeOpen(true)}
          className="rounded-[var(--radius-button)] border border-border px-4 py-2 text-sm font-medium text-text-secondary"
        >
          Create fee
        </button>
        <button
          type="button"
          className="rounded-[var(--radius-button)] border border-border px-4 py-2 text-sm font-medium text-text-muted"
        >
          Send reminder
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <ClubMetricCard label="Total collected" value={`$${totalCollected}`} />
        <ClubMetricCard label="Outstanding" value={`$${outstanding}`} subtext={`${dueCount + overdueCount} items`} />
        <ClubMetricCard label="Upcoming / due" value={dueCount} />
        <ClubMetricCard label="Overdue" value={overdueCount} />
      </div>

      {clubPayments.length === 0 ? (
        <ClubEmptyState
          title="No payment records"
          description="Record a payment or create a fee to get started."
          ctaLabel="Record payment"
          onCtaClick={() => setRecordOpen(true)}
        />
      ) : (
        <div className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-card shadow-[var(--shadow-card)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-elevated/80">
                  <th className="px-4 py-3 font-medium text-text-muted">Swimmer</th>
                  <th className="px-4 py-3 font-medium text-text-muted">Class</th>
                  <th className="px-4 py-3 font-medium text-text-muted">Fee type</th>
                  <th className="px-4 py-3 font-medium text-text-muted">Amount</th>
                  <th className="px-4 py-3 font-medium text-text-muted">Due date</th>
                  <th className="px-4 py-3 font-medium text-text-muted">Status</th>
                </tr>
              </thead>
              <tbody>
                {clubPayments.map((r) => (
                  <PaymentRecordRow key={r.id} record={r} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={recordOpen} onClose={() => setRecordOpen(false)} title="Record payment">
        <PaymentForm
          form={form}
          setForm={setForm}
          swimmers={clubSwimmers}
          onSave={handleRecordPayment}
          onCancel={() => setRecordOpen(false)}
        />
      </Modal>
      <Modal open={feeOpen} onClose={() => setFeeOpen(false)} title="Create fee">
        <PaymentForm
          form={form}
          setForm={setForm}
          swimmers={clubSwimmers}
          onSave={handleCreateFee}
          onCancel={() => setFeeOpen(false)}
        />
      </Modal>
    </PageSection>
  )
}

function PaymentForm({
  form,
  setForm,
  swimmers,
  onSave,
  onCancel,
}: {
  form: { swimmerId: string; feeType: FeeType; amount: number; dueDate: string }
  setForm: (f: typeof form) => void
  swimmers: { id: string; firstName: string; lastName: string }[]
  onSave: () => void
  onCancel: () => void
}) {
  return (
    <div className="space-y-4">
      <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
        Squad
      </h3>
      <div>
        <label className="mb-1 block text-xs text-text-muted">Swimmer</label>
        <select
          value={form.swimmerId}
          onChange={(e) => setForm({ ...form, swimmerId: e.target.value })}
          className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-text-primary"
        >
          <option value="">Select</option>
          {swimmers.map((s) => (
            <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs text-text-muted">Fee type</label>
        <select
          value={form.feeType}
          onChange={(e) => setForm({ ...form, feeType: e.target.value as FeeType })}
          className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-text-primary"
        >
          {FEE_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs text-text-muted">Amount ($)</label>
        <input
          type="number"
          min={0}
          step={0.01}
          value={form.amount || ''}
          onChange={(e) => setForm({ ...form, amount: Number(e.target.value) || 0 })}
          className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-text-primary"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-text-muted">Due date</label>
        <input
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          className="w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-text-primary"
        />
      </div>
      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onSave} className="rounded-[var(--radius-button)] bg-accent px-4 py-2 text-sm font-medium text-bg">Save</button>
        <button type="button" onClick={onCancel} className="rounded-[var(--radius-button)] border border-border px-4 py-2 text-sm font-medium text-text-secondary">Cancel</button>
      </div>
    </div>
  )
}
