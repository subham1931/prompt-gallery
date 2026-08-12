import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import Breadcrumb from './Breadcrumb'
import PageTransition from './PageTransition'

export default function StaticPageLayout({ title, subtitle, breadcrumb, children }) {
  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: breadcrumb }]} />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="mt-6 text-center max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/80 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-orange-600 dark:border-orange-900/50 dark:bg-orange-950/50 dark:text-orange-400 mb-3">
            <Sparkles size={13} />
            <span>PROMPT GALLERY PLATFORM</span>
          </div>

          <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
              {subtitle}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08, ease: 'easeOut' }}
          className="mt-12 glass-panel rounded-3xl border border-white/80 dark:border-slate-800 p-6 sm:p-10 space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300 shadow-2xl"
        >
          {children}
        </motion.div>
      </div>
    </PageTransition>
  )
}
