import { Link } from 'react-router-dom'
import type { PaymentRecord } from '../../types/club'

type Props = {
  status: PaymentRecord['status']
  /** When set, the badge links to the fees/payments page. */
  to?: string
}

const STYLES: Record<PaymentRecord['status'], string> = {
  paid: 'bg-success/20 text-success',
  due: 'bg-accent/20 text-accent',
  overdue: 'bg-red-500/20 text-red-400',
  partial: 'bg-amber-500/20 text-amber-400',
}

const baseClass = (status: PaymentRecord['status']) =>
  `rounded px-2 py-0.5 text-xs font-medium transition-colors hover:opacity-90 ${STYLES[status]}`

export function PaymentStatusBadge({ status, to }: Props) {
  const label = status.charAt(0).toUpperCase() + status.slice(1)
  if (to) {
    return (
      <Link to={to} className={`inline-block ${baseClass(status)}`} title="View fees">
        {label}
      </Link>
    )
  }
  return <span className={baseClass(status)}>{label}</span>
}
