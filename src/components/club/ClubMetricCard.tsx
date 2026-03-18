import { Link } from 'react-router-dom'

type Props = {
  label: string
  value: string | number
  subtext?: string
  /** When set, the card is a link (e.g. to Premium data). */
  to?: string
}

export function ClubMetricCard({ label, value, subtext, to }: Props) {
  const content = (
    <>
      <p className="text-xs font-medium uppercase tracking-wider text-text-muted">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-text-primary group-hover:text-accent transition-colors duration-200">{value}</p>
      {subtext && <p className="mt-0.5 text-xs text-text-muted">{subtext}</p>}
    </>
  )
  const className = "rounded-[var(--radius-card)] border border-border/80 bg-card p-4 shadow-[var(--shadow-card)] transition-all duration-200 hover:shadow-[var(--shadow-card-hover)] hover:border-accent/30 group"
  if (to) {
    return (
      <Link to={to} className={`block ${className}`}>
        {content}
      </Link>
    )
  }
  return <div className={className}>{content}</div>
}
