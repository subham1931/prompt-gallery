import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Layers } from 'lucide-react'
import { getCategories } from '../api'
import CategoryPill from './CategoryPill'

function PillSkeleton() {
  return (
    <div className="glass-card flex items-center gap-3 rounded-2xl border border-white/80 dark:border-slate-800 p-4">
      <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-3 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
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
      .catch(() => setCategories([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="relative py-16 lg:py-24 border-t border-slate-200/60 dark:border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/80 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-orange-600 dark:border-orange-900/50 dark:bg-orange-950/50 dark:text-orange-400 mb-2">
              <Layers size={12} />
              <span>CATEGORY INDEX</span>
            </div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Browse by Aesthetic & Style.
            </h2>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
              Explore specialized prompt collections organized by creative domain and renderer.
            </p>
          </div>

          <Link
            to="/libraries"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-all hover:-translate-y-0.5"
          >
            <span>All Libraries</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <PillSkeleton key={i} />)
            : categories.map((cat, i) => (
                <CategoryPill key={cat.slug} {...cat} index={i} />
              ))}
        </div>

      </div>
    </section>
  )
}
