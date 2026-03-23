import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { PageSection } from '../components/layout/PageSection'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { CreditCard, Building2, Check, ArrowLeft, Plus, Trash2 } from 'lucide-react'

type View = 'main' | 'manage-cards'

type SavedCard = {
  id: string
  brand: string
  last4: string
  expiry: string
  isDefault: boolean
}

/** Mock fee item for member (prototype: no backend). */
type MemberFeeItem = {
  id: string
  swimmerName: string
  description: string
  amount: number
  dueDate: string
  status: 'due' | 'overdue'
}

type PaymentMethod = 'saved-card' | 'new-card' | 'bank'

function getMockFeesForSwimmers(swimmerNames: string[]): MemberFeeItem[] {
  if (swimmerNames.length === 0) return []
  const items: MemberFeeItem[] = []
  swimmerNames.forEach((name, i) => {
    items.push({
      id: `fee-${i}-term`,
      swimmerName: name,
      description: 'Term fee',
      amount: 320,
      dueDate: '2026-04-15',
      status: 'due',
    })
    if (i === 0) {
      items.push({
        id: `fee-${i}-analytics`,
        swimmerName: name,
        description: 'Enhanced Data Analytics Subscription',
        amount: 45,
        dueDate: '2026-03-01',
        status: 'overdue',
      })
    }
  })
  return items
}

const inputClass =
  'w-full rounded-[var(--radius-button)] border border-border bg-bg-elevated px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent'

export function MemberPayments() {
  const { swimmers } = useApp()
  const swimmerNames = swimmers.map((s) => `${s.firstName} ${s.lastName}`)
  const [feeItems, setFeeItems] = useState<MemberFeeItem[]>(() => getMockFeesForSwimmers(swimmerNames))
  const [paySuccessOpen, setPaySuccessOpen] = useState(false)
  const [payModalItem, setPayModalItem] = useState<MemberFeeItem | null>(null)
  const [processing, setProcessing] = useState(false)
  const [view, setView] = useState<View>('main')

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('saved-card')
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [bsb, setBsb] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')

  // Saved cards state
  const [savedCards, setSavedCards] = useState<SavedCard[]>([
    { id: 'card-1', brand: 'Visa', last4: '4242', expiry: '09/27', isDefault: true },
  ])
  const [showAddCard, setShowAddCard] = useState(false)
  const [newCard, setNewCard] = useState({ number: '', name: '', expiry: '', cvc: '' })
  const [addCardSuccess, setAddCardSuccess] = useState(false)

  const dueItems = feeItems.filter((f) => f.status === 'due' || f.status === 'overdue')
  const totalDue = dueItems.reduce((s, f) => s + f.amount, 0)

  const openPayModal = (item: MemberFeeItem) => {
    setPayModalItem(item)
    setPaymentMethod('saved-card')
    setCardNumber('')
    setCardName('')
    setCardExpiry('')
    setCardCvc('')
    setBsb('')
    setAccountNumber('')
    setAccountName('')
  }

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!payModalItem) return
    setProcessing(true)
    setTimeout(() => {
      setFeeItems((prev) => prev.filter((f) => f.id !== payModalItem.id))
      setProcessing(false)
      setPayModalItem(null)
      setPaySuccessOpen(true)
    }, 900)
  }

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCard.number || !newCard.name || !newCard.expiry || !newCard.cvc) return
    const last4 = newCard.number.replace(/\D/g, '').slice(-4)
    setSavedCards((prev) => [
      ...prev,
      { id: `card-${Date.now()}`, brand: 'Card', last4, expiry: newCard.expiry, isDefault: false },
    ])
    setNewCard({ number: '', name: '', expiry: '', cvc: '' })
    setShowAddCard(false)
    setAddCardSuccess(true)
    setTimeout(() => setAddCardSuccess(false), 3000)
  }

  const handleRemoveCard = (id: string) => {
    setSavedCards((prev) => prev.filter((c) => c.id !== id))
  }

  const handleSetDefault = (id: string) => {
    setSavedCards((prev) => prev.map((c) => ({ ...c, isDefault: c.id === id })))
  }

  // ── Manage cards view ────────────────────────────────────────────────────
  if (view === 'manage-cards') {
    return (
      <PageSection
        title="Payment details"
        subtitle="Manage your saved cards and billing information."
        headerAction={
          <button
            type="button"
            onClick={() => { setView('main'); setShowAddCard(false) }}
            className="flex items-center gap-1.5 rounded-[var(--radius-button)] border border-border px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-accent/40 hover:text-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to payments
          </button>
        }
      >
        <div className="max-w-xl space-y-6">
          {/* Saved cards */}
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">Saved cards</h2>
            {addCardSuccess && (
              <div className="mb-3 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-4 py-2.5 text-sm text-success">
                <Check className="h-4 w-4" /> Card added successfully.
              </div>
            )}
            <div className="space-y-2">
              {savedCards.length === 0 && (
                <Card><p className="text-sm text-text-muted">No saved cards. Add one below.</p></Card>
              )}
              {savedCards.map((card) => (
                <Card key={card.id} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 shrink-0 text-text-muted" />
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {card.brand} ending ···· {card.last4}
                      </p>
                      <p className="text-xs text-text-muted">Expires {card.expiry}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {card.isDefault ? (
                      <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-medium text-accent">Default</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetDefault(card.id)}
                        className="text-xs text-text-muted underline-offset-2 hover:text-accent hover:underline"
                      >
                        Set default
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveCard(card.id)}
                      disabled={card.isDefault}
                      className="rounded p-1 text-text-muted transition-colors hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30"
                      title="Remove card"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Add new card */}
          {!showAddCard ? (
            <button
              type="button"
              onClick={() => setShowAddCard(true)}
              className="flex items-center gap-2 rounded-[var(--radius-button)] border border-dashed border-border px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-accent/50 hover:text-accent"
            >
              <Plus className="h-4 w-4" /> Add new card
            </button>
          ) : (
            <form onSubmit={handleAddCard} className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)] space-y-4">
              <h3 className="text-sm font-semibold text-text-primary">New card</h3>
              <div>
                <label className="mb-1 block text-xs font-medium text-text-muted">Card number</label>
                <input
                  type="text"
                  value={newCard.number}
                  onChange={(e) => setNewCard((p) => ({ ...p, number: e.target.value.replace(/\D/g, '').slice(0, 16) }))}
                  placeholder="1234 5678 9012 3456"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-text-muted">Name on card</label>
                <input
                  type="text"
                  value={newCard.name}
                  onChange={(e) => setNewCard((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Full name"
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-muted">Expiry</label>
                  <input
                    type="text"
                    value={newCard.expiry}
                    onChange={(e) => setNewCard((p) => ({ ...p, expiry: e.target.value }))}
                    placeholder="MM/YY"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-muted">CVC</label>
                  <input
                    type="text"
                    value={newCard.cvc}
                    onChange={(e) => setNewCard((p) => ({ ...p, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                    placeholder="123"
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button type="submit" className="rounded-[var(--radius-button)] bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent-bright">
                  Save card
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAddCard(false); setNewCard({ number: '', name: '', expiry: '', cvc: '' }) }}
                  className="rounded-[var(--radius-button)] border border-border px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary"
                >
                  Cancel
                </button>
              </div>
              <p className="text-xs text-text-muted">Prototype only — no real card is stored.</p>
            </form>
          )}
        </div>
      </PageSection>
    )
  }

  // ── Main payments view ───────────────────────────────────────────────────
  return (
    <PageSection
      title="Payments"
      subtitle="View and pay fees for your swimmers."
      headerAction={
        <button
          type="button"
          onClick={() => setView('manage-cards')}
          className="flex items-center gap-1.5 rounded-[var(--radius-button)] border border-border px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-accent/40 hover:text-accent"
        >
          <CreditCard className="h-3.5 w-3.5" />
          Manage cards
        </button>
      }
    >
      {dueItems.length === 0 ? (
        <Card>
          <p className="text-text-secondary">No fees due. When your club assigns fees, they will appear here for you to pay.</p>
        </Card>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <p className="text-sm font-medium text-text-primary">
              Total due: <span className="text-accent">${totalDue}</span>
            </p>
          </div>
          <ul className="space-y-3">
            {dueItems.map((item) => (
              <li key={item.id}>
                <Card className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-text-primary">{item.description} · {item.swimmerName}</p>
                    <p className="text-sm text-text-muted">
                      Due {item.dueDate}
                      {item.status === 'overdue' && (
                        <span className="ml-2 text-xs font-medium text-amber-400">Overdue</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-text-primary">${item.amount}</span>
                    <button
                      type="button"
                      onClick={() => openPayModal(item)}
                      className="rounded-[var(--radius-button)] bg-accent px-4 py-2 text-sm font-medium text-bg transition-colors hover:bg-accent-bright"
                    >
                      Pay now
                    </button>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Payment modal */}
      {payModalItem && (
        <Modal
          open={!!payModalItem}
          onClose={() => !processing && setPayModalItem(null)}
          title="Complete payment"
        >
          {/* Summary */}
          <div className="mb-5 rounded-lg border border-border/80 bg-bg-elevated px-4 py-3">
            <p className="text-sm text-text-secondary">{payModalItem.description} · {payModalItem.swimmerName}</p>
            <p className="mt-1 text-2xl font-display font-semibold text-text-primary">${payModalItem.amount}</p>
          </div>

          {/* Payment method tabs */}
          <div className="mb-5 flex gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('saved-card')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                paymentMethod === 'saved-card'
                  ? 'bg-accent/15 text-accent border border-accent/30'
                  : 'border border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              <CreditCard className="h-4 w-4" /> Saved card
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('new-card')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                paymentMethod === 'new-card'
                  ? 'bg-accent/15 text-accent border border-accent/30'
                  : 'border border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              <CreditCard className="h-4 w-4" /> New card
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('bank')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                paymentMethod === 'bank'
                  ? 'bg-accent/15 text-accent border border-accent/30'
                  : 'border border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              <Building2 className="h-4 w-4" /> Bank transfer
            </button>
          </div>

          <form onSubmit={handleConfirmPayment} className="space-y-4">
            {paymentMethod === 'saved-card' && (
              <div className="space-y-2">
                {savedCards.length === 0 ? (
                  <p className="text-sm text-text-muted">No saved cards. Add one via <button type="button" onClick={() => { setPayModalItem(null); setView('manage-cards') }} className="text-accent underline">Manage cards</button>.</p>
                ) : savedCards.map((card) => (
                  <div key={card.id} className="rounded-lg border border-border/80 bg-bg-elevated px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-text-muted" />
                      <div>
                        <p className="text-sm font-medium text-text-primary">{card.brand} ending ···· {card.last4}</p>
                        <p className="text-xs text-text-muted">Expires {card.expiry}</p>
                      </div>
                    </div>
                    {card.isDefault && (
                      <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-medium text-accent">Default</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {paymentMethod === 'new-card' && (
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-text-secondary">Card number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                    placeholder="1234 5678 9012 3456"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-text-secondary">Name on card</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Full name"
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-text-secondary">Expiry</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-text-secondary">CVC</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="123"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'bank' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-text-secondary">BSB</label>
                    <input
                      type="text"
                      value={bsb}
                      onChange={(e) => setBsb(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000-000"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-text-secondary">Account number</label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="12345678"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-text-secondary">Account name</label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="Account holder name"
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={processing}
                className="flex-1 rounded-[var(--radius-button)] bg-accent px-4 py-2.5 text-sm font-medium text-bg transition-opacity hover:bg-accent-bright disabled:opacity-60"
              >
                {processing ? 'Processing…' : `Confirm payment · $${payModalItem.amount}`}
              </button>
              <button
                type="button"
                onClick={() => setPayModalItem(null)}
                disabled={processing}
                className="rounded-[var(--radius-button)] border border-border px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
            <p className="text-xs text-text-muted text-center">Prototype only — no real payment is processed.</p>
          </form>
        </Modal>
      )}

      {/* Success modal */}
      <Modal open={paySuccessOpen} onClose={() => setPaySuccessOpen(false)} title="Payment complete">
        <div className="flex flex-col items-center gap-3 py-2 text-center">
          <div className="rounded-full bg-success/15 p-3">
            <Check className="h-6 w-6 text-success" />
          </div>
          <p className="font-display text-lg font-semibold text-text-primary">Payment received</p>
          <p className="text-sm text-text-secondary">Your payment has been confirmed. A receipt would be sent to your registered email in a live system.</p>
          <button
            type="button"
            onClick={() => setPaySuccessOpen(false)}
            className="mt-2 rounded-[var(--radius-button)] bg-accent px-6 py-2 text-sm font-medium text-bg hover:bg-accent-bright"
          >
            Done
          </button>
        </div>
      </Modal>
    </PageSection>
  )
}
