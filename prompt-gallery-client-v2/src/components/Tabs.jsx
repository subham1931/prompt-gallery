import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Flame, Sparkles } from 'lucide-react'

const TAB_ICONS = {
  latest: Clock,
  trending: Flame,
  popular: Sparkles,
}

export default function Tabs({ tabs, activeTab, onChange }) {
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsSticky(scrollY > 380)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="sticky top-3 sm:top-5 z-40 my-4 sm:my-6 flex justify-center px-2 pointer-events-none transition-all duration-300">
      <div
        className={`pointer-events-auto inline-flex max-w-full items-center gap-1 sm:gap-1.5 rounded-full p-1.5 transition-all duration-500 ${
          isSticky
            ? 'bg-slate-950/90 dark:bg-slate-950/95 backdrop-blur-2xl border border-orange-500/30 dark:border-orange-500/40 shadow-[0_10px_35px_rgba(249,115,22,0.25)] scale-[1.02]'
            : 'glass-pill border border-white/80 dark:border-slate-800/80 shadow-2xl scale-100'
        } overflow-x-auto scrollbar-hide`}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = TAB_ICONS[tab.id] || Sparkles

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`relative flex items-center gap-1.5 shrink-0 rounded-full px-4 sm:px-6 py-2 sm:py-2.5 text-xs font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'text-white dark:text-white shadow-md'
                  : isSticky
                    ? 'text-slate-300 hover:text-white hover:bg-white/10'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-900/5 dark:hover:bg-white/5'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="active-tab-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30"
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
              )}
              <Icon size={14} className={`relative z-10 ${isActive ? 'text-white' : isSticky ? 'text-orange-400' : 'text-slate-400'}`} />
              <span className="relative z-10">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
