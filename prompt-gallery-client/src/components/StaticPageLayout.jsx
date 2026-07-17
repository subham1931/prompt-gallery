import { motion } from 'framer-motion'
import Breadcrumb from './Breadcrumb'
import PageTransition from './PageTransition'

export default function StaticPageLayout({ title, subtitle, breadcrumb, children }) {
  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: breadcrumb }]} />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="mt-6"
        >
          <h1 className="font-display text-3xl font-bold text-[var(--color-text)] sm:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 text-base leading-relaxed text-[var(--color-text-muted)] sm:text-lg">
              {subtitle}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08, ease: 'easeOut' }}
          className="mt-10 space-y-6 text-sm leading-relaxed text-[var(--color-text-muted)] sm:text-base"
        >
          {children}
        </motion.div>
      </div>
    </PageTransition>
  )
}
