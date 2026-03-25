import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { PageSection } from '../components/layout/PageSection'
import { ClubMetricCard, PaymentRecordRow, ClubEmptyState } from '../components/club'
import { Modal } from '../components/ui/Modal'
import type { FeeType, OutgoingCategory } from '../types/club'

type Tab = 'incoming' | 'outgoing'

const FEE_TYPES: { value: FeeType; label: string }[] = [
  { value: 'term', label: 'Term fee' },
  { value: 'assessment', label: 'Assessment' },
  { value: 'camp', label: 'Camp' },
  { value: 'competition', label: 'Competition' },
  { value: 'squad', label: 'Squad' },
  { value: 'other', label: 'Other' },
]

const OUTGOING_CATEGORIES: { value: OutgoingCategory; label: string }[] = [
  { value: 'staff', label: 'Staff pay' },
  { value: 'hp-product', label: 'HP product / subscription' },
  { value: 'other', label: 'Other' },
]

const CATEGORY_STYLES: Record<OutgoingCategory, string> = {
  staff:        'bg-accent/10 text-accent',
  'hp-product': 'bg-success/10 text-success',
  other:        'bg-border/60 text-text-muted',
}

const CATEGORY_LABELS: Record<OutgoingCategory, string> = {
  staff:        'Staff',
  'hp-product': 'HP / Platform',
  other:        'Other',
}

const STATUS_STYLES: Record<string, string> = {
  paid:      'bg-success/10 text-success',
  pending:   'bg-amber-400/10 text-amber-500',
  scheduled: 'bg-accent/10 text-accent',
}

function fmtDate(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('en-AU', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export function ClubPayments() {
  const { accountType, clubPayments, clubSwimmers, addClubPayment, outgoingPayments, addOutgoingPayment } = useApp()
  const [activeTab, setActiveTab] = useState<Tab>('incoming')

  // — Incoming —
  const [recordOpen, setRecordOpen] = useState(false)
  const [feeOpen, setFeeOpen] = useState(false)
  const [inForm, setInForm] = useState({ swimmerId: '', feeType: 'term' as FeeType, amount: 0, dueDate: '' })

  const totalCollected = clubPayments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  const outstanding = clubPayments.filter((p) => p.status === 'due' || p.status === 'overdue').reduce((s, p) => s + p.amount, 0)
  const overdueCount = clubPayments.filter((p) => p.status === 'overdue').length
  const dueCount = clubPayments.filter((p) => p.status === 'due').length

  const handleRecordPayment = () => {
    const swimmer = clubSwimmers.find((s) => s.id === inForm.swimmerId)
    if (!swimmer || inForm.amount <= 0 || !inForm.dueDate) return
    addClubPayment({
      swimmerId: swimmer.id, swimmerName: `${swimmer.firstName} ${swimmer.lastName}`,
      classId: swimmer.classId, className: swimmer.className,
      feeType: inForm.feeType, amount: inForm.amount,
      dueDate: inForm.dueDate, paidDate: new Date().toISOString().slice(0, 10), status: 'paid',
    })
    setInForm({ swimmerId: '', feeType: 'term', amount: 0, dueDate: '' })
    setRecordOpen(false)
  }

  const handleCreateFee = () => {
    const swimmer = clubSwimmers.find((s) => s.id === inForm.swimmerId)
    if (!swimmer || inForm.amount <= 0 || !inForm.dueDate) return
    addClubPayment({
      swimmerId: swimmer.id, swimmerName: `${swimmer.firstName} ${swimmer.lastName}`,
      classId: swimmer.classId, className: swimmer.className,
      feeType: inForm.feeType, amount: inForm.amount,
      dueDate: inForm.dueDate, paidDate: null, status: 'due',
    })
    setInForm({ swimmerId: '', feeType: 'term', amount: 0, dueDate: '' })
    setFeeOpen(false)
  }

  // — Outgoing —
  const [outOpen, setOutOpen] = useState(false)
  const [outForm, setOutForm] = useState({
    category: 'staff' as OutgoingCategory, recipient: '', description: '',
    amount: 0, date: '', status: 'pending' as 'paid' | 'pending' | 'scheduled', reference: '',
  })

  const handleAddOutgoing = () => {
    if (!outForm.recipient.trim() || outForm.amount <= 0 || !outForm.date) return
    addOutgoingPayment({
      category: outForm.category, recipient: outForm.recipient.trim(),
      description: outForm.description.trim(), amount: outForm.amount,
      date: outForm.date, status: outForm.status,
      reference: outForm.reference.trim() || undefined,
    })
    setOutForm({ category: 'staff', recipient: '', description: '', amount: 0, date: '', status: 'pending', reference: '' })
    setOutOpen(false)
  }

  const outTotals = useMemo(() => {
    const paid    = outgoingPayments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
    const pending = outgoingPayments.filter((p) => p.status === 'pending').reduce((s, p) => s + p.amount, 0)
    const sched   = outgoingPayments.filter((p) => p.status === 'scheduled').reduce((s, p) => s + p.amount, 0)
    return { paid, pending, sched }
  }, [outgoingPayments])

  if (accountType !== 'club') {
    return (
      <PageSection title="Payments">
        <p className="text-text-muted">This page is for club accounts.</p>
      </PageSection>
    )
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'incoming', label: 'Incoming' },
    { id: 'outgoing', label: 'Outgoing' },
  ]

  return (
    <PageSection title="Payments" subtitle="Manage fee collection and club expenditure.">
      {/* Tab bar */}
      <div className="border-b border-border bg-bg-elevated/50" role="tablist">
        <div className="flex gap-0">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={`shrink-0 border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-text-muted hover:border-border hover:text-text-secondary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Incoming tab ── */}
      {activeTab === 'incoming' && (
        <>
          <div className="flex flex-wrap gap-3">
            <button
              type="button" onClick={() => setRecordOpen(true)}
              className="rounded-[var(--radius-button)] bg-accent px-4 py-2 text-sm font-medium text-bg"
            >
              Record payment
            </button>
            <button
              type="button" onClick={() => setFeeOpen(true)}
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

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ClubMetricCard label="Total collected" value={`$${totalCollected.toLocaleString()}`} />
            <ClubMetricCard label="Outstanding" value={`$${outstanding.toLocaleString()}`} subtext={`${dueCount + overdueCount} items`} />
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
                      <th className="px-4 py-3 font-medium text-text-muted">Squad</th>
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
            <IncomingForm form={inForm} setForm={setInForm} swimmers={clubSwimmers} onSave={handleRecordPayment} onCancel={() => setRecordOpen(false)} />
          </Modal>
          <Modal open={feeOpen} onClose={() => setFeeOpen(false)} title="Create fee">
            <IncomingForm form={inForm} setForm={setInForm} swimmers={clubSwimmers} onSave={handleCreateFee} onCancel={() => setFeeOpen(false)} />
          </Modal>
        </>
      )}

      {/* ── Outgoing tab ── */}
      {activeTab === 'outgoing' && (
        <>
          <div className="flex flex-wrap gap-3">
            <button
              type="button" onClick={() => setOutOpen(true)}
              className="rounded-[var(--radius-button)] bg-accent px-4 py-2 text-sm font-medium text-bg"
            >
              Record outgoing
            </button>
          </div>

          {/* Summary metrics */}
          <div className="grid gap-4 sm:grid-cols-3">
            <ClubMetricCard label="Total paid out" value={`$${outTotals.paid.toLocaleString()}`} />
            <ClubMetricCard label="Pending" value={`$${outTotals.pending.toLocaleString()}`} subtext="awaiting processing" />
            <ClubMetricCard label="Scheduled" value={`$${outTotals.sched.toLocaleString()}`} subtext="upcoming payments" />
          </div>

          {outgoingPayments.length === 0 ? (
            <ClubEmptyState
              title="No outgoing payments yet"
              description="Record staff pay, platform costs, facilities, or equipment."
              ctaLabel="Record outgoing"
              onCtaClick={() => setOutOpen(true)}
            />
          ) : (
            <div className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-card shadow-[var(--shadow-card)]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-bg-elevated/80">
                      <th className="px-4 py-3 font-medium text-text-muted">Category</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Recipient</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Description</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Amount</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Date</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outgoingPayments.map((p) => (
                      <tr key={p.id} className="border-b border-border/40 last:border-0 hover:bg-bg-elevated/40">
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${CATEGORY_STYLES[p.category]}`}>
                            {CATEGORY_LABELS[p.category]}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-text-primary">{p.recipient}</td>
                        <td className="px-4 py-3 text-text-secondary max-w-xs truncate">{p.description}</td>
                        <td className="px-4 py-3 font-medium text-text-primary">${p.amount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-text-muted">{fmtDate(p.date)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[p.status] ?? ''}`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <Modal open={outOpen} onClose={() => setOutOpen(false)} title="Record outgoing payment">
            <OutgoingForm form={outForm} setForm={setOutForm} onSave={handleAddOutgoing} onCancel={() => setOutOpen(false)} />
          </Modal>
        </>
      )}
    </PageSection>
  )
}

// ─── Forms ────────────────────────────────────────────────────────────────────

function IncomingForm({
  form, setForm, swimmers, onSave, onCancel,
}: {
  form: { swimmerId: string; feeType: FeeType; amount: number; dueDate: string }
  setForm: (f: typeof form) => void
  swimmers: { id: string; firstName: string; lastName: string }[]
  onSave: () => void
  onCancel: () => void
}) {
  const inp = 'w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-text-primary'
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-xs text-text-muted">Swimmer</label>
        <select value={form.swimmerId} onChange={(e) => setForm({ ...form, swimmerId: e.target.value })} className={inp}>
          <option value="">Select swimmer</option>
          {swimmers.map((s) => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs text-text-muted">Fee type</label>
        <select value={form.feeType} onChange={(e) => setForm({ ...form, feeType: e.target.value as FeeType })} className={inp}>
          {FEE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs text-text-muted">Amount ($)</label>
        <input type="number" min={0} step={0.01} value={form.amount || ''} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) || 0 })} className={inp} />
      </div>
      <div>
        <label className="mb-1 block text-xs text-text-muted">Due date</label>
        <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className={inp} />
      </div>
      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onSave} className="rounded-[var(--radius-button)] bg-accent px-4 py-2 text-sm font-medium text-bg">Save</button>
        <button type="button" onClick={onCancel} className="rounded-[var(--radius-button)] border border-border px-4 py-2 text-sm font-medium text-text-secondary">Cancel</button>
      </div>
    </div>
  )
}

function OutgoingForm({
  form, setForm, onSave, onCancel,
}: {
  form: { category: OutgoingCategory; recipient: string; description: string; amount: number; date: string; status: 'paid' | 'pending' | 'scheduled'; reference: string }
  setForm: (f: typeof form) => void
  onSave: () => void
  onCancel: () => void
}) {
  const inp = 'w-full rounded-[var(--radius-button)] border border-border bg-bg px-3 py-2 text-text-primary text-sm'
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs text-text-muted">Category</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as OutgoingCategory })} className={inp}>
            {OUTGOING_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-text-muted">Status</label>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as typeof form.status })} className={inp}>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs text-text-muted">Recipient *</label>
        <input type="text" value={form.recipient} onChange={(e) => setForm({ ...form, recipient: e.target.value })} placeholder="e.g. Mike Torres or City Aquatic Centre" className={inp} />
      </div>
      <div>
        <label className="mb-1 block text-xs text-text-muted">Description</label>
        <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description" className={inp} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs text-text-muted">Amount ($) *</label>
          <input type="number" min={0} step={0.01} value={form.amount || ''} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) || 0 })} className={inp} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-text-muted">Date *</label>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inp} />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs text-text-muted">Reference (optional)</label>
        <input type="text" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} placeholder="e.g. PAY-2026-040" className={inp} />
      </div>
      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onSave} className="rounded-[var(--radius-button)] bg-accent px-4 py-2 text-sm font-medium text-bg">Save</button>
        <button type="button" onClick={onCancel} className="rounded-[var(--radius-button)] border border-border px-4 py-2 text-sm font-medium text-text-secondary">Cancel</button>
      </div>
    </div>
  )
}
