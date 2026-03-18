import { useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import type { InsightsTabId } from '../../types/insights'

const PARENT_TAB_CONFIG: { id: InsightsTabId; label: string }[] = [
  { id: 'pro-plan-prototype', label: 'Pro Plan Prototype' },
  { id: 'subscription', label: 'Subscription' },
  { id: 'expert-outputs', label: 'Expert Outputs' },
]

const FEDERATION_TAB_CONFIG: { id: InsightsTabId; label: string }[] = [
  { id: 'pro-plan-prototype', label: 'Pro Plan Prototype' },
  { id: 'subscription', label: 'Subscription' },
  { id: 'expert-outputs', label: 'Federation high-performance' },
]

const CLUB_TAB_CONFIG: { id: InsightsTabId; label: string }[] = [
  { id: 'pro-plan-prototype', label: 'Pro Plan Prototype' },
  { id: 'subscription', label: 'Subscription' },
]

type Props = {
  activeTab: InsightsTabId
  onTabChange: (tab: InsightsTabId) => void
}

export function InsightsTabs({ activeTab, onTabChange }: Props) {
  const { accountType } = useApp()
  const tabs =
    accountType === 'club'
      ? CLUB_TAB_CONFIG
      : accountType === 'federation'
        ? FEDERATION_TAB_CONFIG
        : PARENT_TAB_CONFIG
  const currentTabValid = tabs.some((t) => t.id === activeTab)

  useEffect(() => {
    if (!currentTabValid) onTabChange(tabs[0].id)
  }, [currentTabValid, accountType, onTabChange])

  const effectiveTab = currentTabValid ? activeTab : tabs[0].id

  return (
    <div
      className="border-b border-border bg-bg-elevated/50"
      role="tablist"
      aria-label="Insights sections"
    >
      <div className="flex gap-0 overflow-x-auto">
        {tabs.map(({ id, label }) => {
          const isActive = effectiveTab === id
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`insights-panel-${id}`}
              id={`tab-${id}`}
              onClick={() => onTabChange(id)}
              className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-accent text-accent'
                  : 'border-transparent text-text-muted hover:border-border hover:text-text-secondary'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
