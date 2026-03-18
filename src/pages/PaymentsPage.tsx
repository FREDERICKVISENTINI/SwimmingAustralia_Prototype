import { useApp } from '../context/AppContext'
import { ClubPayments } from './ClubPayments'
import { MemberPayments } from './MemberPayments'

/**
 * Routes to the correct payments view: club (manage records) vs member (pay fees).
 */
export function PaymentsPage() {
  const { accountType } = useApp()
  if (accountType === 'club') {
    return <ClubPayments />
  }
  if (accountType === 'parent') {
    return <MemberPayments />
  }
  return <ClubPayments />
}
