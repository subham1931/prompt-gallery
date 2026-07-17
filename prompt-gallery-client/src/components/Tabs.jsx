import { motion } from 'framer-motion'

export default function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="flex gap-1 border-b border-[var(--color-border)]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`relative px-4 py-3 text-sm font-medium transition-colors duration-200 ${
            activeTab === tab.id
              ? 'text-accent'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <motion.span
              layoutId="tab-underline"
              className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-accent"
              transition={{ duration: 0.2, ease: 'easeOut' }}
            />
          )}
        </button>
      ))}
    </div>
  )
}
