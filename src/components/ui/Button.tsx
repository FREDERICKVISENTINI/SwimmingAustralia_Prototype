import type { ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = {
  children: ReactNode
  variant?: ButtonVariant
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
  onClick?: () => void
}

const base =
  'inline-flex items-center justify-center rounded-[var(--radius-button)] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg disabled:pointer-events-none disabled:opacity-50'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-bg hover:bg-accent-bright px-4 py-2.5',
  secondary: 'border border-border bg-transparent text-text-secondary hover:bg-card hover:text-text-primary px-4 py-2.5',
  ghost: 'text-text-secondary hover:bg-card hover:text-text-primary px-3 py-1.5',
}

export function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  className = '',
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
