import { motion } from 'framer-motion'
import { Clock, Flame, Sparkles } from 'lucide-react'

const TAB_ICONS = {
  latest: Clock,
  trending: Flame,
  popular: Sparkles,
}

export default function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="flex justify-center my-4 sm:my-6 px-2">
      <div className="inline-flex max-w-full items-center gap-1 sm:gap-1.5 rounded-full glass-pill p-1.5 border border-white/80 dark:border-slate-800 shadow-2xl overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = TAB_ICONS[tab.id] || Sparkles

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`relative flex items-center gap-1.5 shrink-0 rounded-full px-4 sm:px-6 py-2 text-xs font-extrabold uppercase tracking-wider transition-all duration-300 ${
                isActive
                  ? 'text-white dark:text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-900/5 dark:hover:bg-white/5'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="active-tab-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-500/25"
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
              )}
              <Icon size={14} className={`relative z-10 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="relative z-10">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
