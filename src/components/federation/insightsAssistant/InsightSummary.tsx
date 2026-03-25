type Props = { children: string; className?: string }

export function InsightSummary({ children, className = '' }: Props) {
  return (
    <p className={`text-sm leading-relaxed text-text-secondary ${className}`}>{children}</p>
  )
}
