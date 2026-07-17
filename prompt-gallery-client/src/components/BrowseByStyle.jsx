import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { getCategories } from '../api'
import CategoryPill from './CategoryPill'

function PillSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
      <div className="h-8 w-8 shrink-0 animate-pulse rounded-lg bg-[var(--color-surface-muted)]" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3.5 w-24 animate-pulse rounded bg-[var(--color-surface-muted)]" />
        <div className="h-3 w-16 animate-pulse rounded bg-[var(--color-surface-muted)]" />
      </div>
    </div>
  )
}

export default function BrowseByStyle() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="border-t border-[var(--color-border)] bg-[var(--color-surface-muted)]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[var(--color-text)]">
              Browse by Style
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Explore prompts organized by category and aesthetic
            </p>
          </div>
          <Link
            to="/libraries"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
          >
            View all libraries
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {loading
            ? Array.from({ length: 10 }).map((_, i) => <PillSkeleton key={i} />)
            : categories.map((cat, i) => (
                <CategoryPill key={cat.slug} {...cat} index={i} />
              ))}
        </div>
      </div>
    </section>
  )
}
