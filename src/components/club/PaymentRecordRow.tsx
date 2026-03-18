import type { PaymentRecord } from '../../types/club'
import { PaymentStatusBadge } from './PaymentStatusBadge'

const FEE_TYPE_LABELS: Record<PaymentRecord['feeType'], string> = {
  term: 'Term fee',
  assessment: 'Assessment',
  camp: 'Camp',
  competition: 'Competition',
  squad: 'Squad',
  other: 'Other',
}

type Props = { record: PaymentRecord }

export function PaymentRecordRow({ record }: Props) {
  return (
    <tr className="border-b border-border/70 last:border-0">
      <td className="px-4 py-3 font-medium text-text-primary">{record.swimmerName}</td>
      <td className="px-4 py-3 text-sm text-text-secondary">{record.className ?? '—'}</td>
      <td className="px-4 py-3 text-sm text-text-secondary">{FEE_TYPE_LABELS[record.feeType]}</td>
      <td className="px-4 py-3 text-text-primary">${record.amount}</td>
      <td className="px-4 py-3 text-sm text-text-secondary">{record.dueDate}</td>
      <td className="px-4 py-3">
        <PaymentStatusBadge status={record.status} />
      </td>
    </tr>
  )
}
