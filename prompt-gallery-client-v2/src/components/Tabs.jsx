import { motion } from 'framer-motion'

export default function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="flex justify-center my-6">
      <div className="inline-flex items-center gap-1.5 rounded-full glass-pill p-1.5 border border-white/80 dark:border-slate-800 shadow-xl">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`relative rounded-full px-5 py-2 text-xs font-extrabold uppercase tracking-wider transition-all duration-300 ${
                isActive
                  ? 'text-white dark:text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-full bg-orange-500"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
