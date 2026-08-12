import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export default function CategoryPill({ name, slug, count, icon, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3), ease: 'easeOut' }}
    >
      <Link
        to={`/library/${slug}`}
        className="glass-card group flex items-center justify-between rounded-2xl border border-white/80 dark:border-slate-800 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-xl"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 font-bold text-sm transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white shadow-xs">
            {icon || name.charAt(0)}
          </div>
          <div className="min-w-0">
            <h4 className="truncate font-display text-sm font-extrabold text-slate-900 dark:text-white transition-colors group-hover:text-orange-600 dark:group-hover:text-orange-400">
              {name}
            </h4>
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {count.toLocaleString()} Prompts
            </p>
          </div>
        </div>

        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
          <ArrowUpRight size={14} />
        </div>
      </Link>
    </motion.div>
  )
}
