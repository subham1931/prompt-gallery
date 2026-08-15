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
      setIsSticky(scrollY > 320)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="sticky top-4 sm:top-6 z-40 my-4 sm:my-6 flex justify-center px-2 pointer-events-none transition-all duration-300">
      <div
        className={`pointer-events-auto inline-flex max-w-full items-center gap-1 sm:gap-2 rounded-full p-1.5 transition-all duration-500 ${
          isSticky
            ? 'bg-[#090d16]/95 dark:bg-[#090d16]/95 backdrop-blur-2xl border border-orange-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.7)] scale-[1.02]'
            : 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl scale-100'
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
              className={`relative flex items-center gap-2 shrink-0 rounded-full px-5 sm:px-7 py-2.5 sm:py-3 text-xs font-extrabold uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'text-white shadow-lg'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-900/5 dark:hover:bg-white/5'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="active-tab-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 shadow-md shadow-orange-500/40"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                size={15}
                className={`relative z-10 ${
                  isActive ? 'text-white' : 'text-slate-400'
                }`}
              />
              <span className="relative z-10">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
