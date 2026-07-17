import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function CategoryPill({ name, slug, count, icon, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.3, delay: index * 0.03, ease: 'easeOut' }}
    >
      <Link
        to={`/library/${slug}`}
        className="group flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-md"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-xs font-bold text-accent transition-colors group-hover:bg-accent group-hover:text-white">
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-[var(--color-text)] transition-colors group-hover:text-accent">
            {name}
          </span>
          <span className="mt-0.5 block text-xs text-[var(--color-text-muted)]">
            {count.toLocaleString()} prompts
          </span>
        </span>
      </Link>
    </motion.div>
  )
}
