import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  label: string
  onPrev: () => void
  onNext: () => void
}

export function CalendarMiniHeader({ label, onPrev, onNext }: Props) {
  return (
    <div className="flex items-center justify-between gap-2">
      <button
        type="button"
        onClick={onPrev}
        className="rounded-lg p-2 text-text-muted transition-colors hover:bg-card hover:text-text-primary"
        aria-label="Previous"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <span className="font-display font-semibold text-text-primary">{label}</span>
      <button
        type="button"
        onClick={onNext}
        className="rounded-lg p-2 text-text-muted transition-colors hover:bg-card hover:text-text-primary"
        aria-label="Next"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}
