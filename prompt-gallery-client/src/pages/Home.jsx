import { Sparkles } from 'lucide-react'
import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getPrompts } from '../api'
import PromptMasonryGrid from '../components/PromptMasonryGrid'
import Tabs from '../components/Tabs'
import BrowseByStyle from '../components/BrowseByStyle'
import PageTransition from '../components/PageTransition'

const TABS = [
  { id: 'latest', label: 'Latest' },
  { id: 'trending', label: 'Trending' },
  { id: 'popular', label: 'Popular' },
]

const PAGE_SIZE = 12

export default function Home() {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') || ''

  const [allPrompts, setAllPrompts] = useState([])
  const [activeTab, setActiveTab] = useState('latest')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    getPrompts({ sort: activeTab }).then(setAllPrompts)
  }, [activeTab])

  const filteredPrompts = useMemo(() => {
    let result = allPrompts

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
    }

    return result
  }, [allPrompts, searchQuery])

  const visiblePrompts = filteredPrompts.slice(0, visibleCount)
  const hasMore = visibleCount < filteredPrompts.length

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <PageTransition>
      <div>
        <section className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-medium tracking-wide text-accent sm:text-sm"
          >
            <Sparkles size={14} />
            Curated for Gemini · ChatGPT · Midjourney
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05, ease: 'easeOut' }}
            className="font-display mx-auto max-w-4xl text-3xl font-bold leading-[1.15] tracking-tight text-[var(--color-text)] sm:text-4xl lg:text-[3.25rem]"
          >
            Precision-built prompts
            <br />
            <span className="text-accent">
              for extraordinary AI imagery
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12, ease: 'easeOut' }}
            className="mx-auto mt-5 max-w-2xl"
          >
            <p className="text-base font-medium leading-relaxed text-[var(--color-text)] sm:text-lg">
              Every prompt is studio-tested and ready to paste.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)] sm:text-base">
              From hyper-real portraits to cinematic editorials — discover prompts engineered
              for Gemini, ChatGPT, and Midjourney.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {[
                { label: '18+ prompts', value: 'library' },
                { label: '15 categories', value: 'styles' },
                { label: '1-click copy', value: 'copy' },
              ].map((item) => (
                <span
                  key={item.value}
                  className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs font-medium text-[var(--color-text-muted)]"
                >
                  {item.label}
                </span>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <Tabs tabs={TABS} activeTab={activeTab} onChange={handleTabChange} />

          <div className="mt-8">
            {visiblePrompts.length > 0 ? (
              <PromptMasonryGrid prompts={visiblePrompts} />
            ) : (
              <p className="py-16 text-center text-[var(--color-text-muted)]">
                No prompts found. Try a different search term.
              </p>
            )}
          </div>

          {hasMore && (
            <div className="mt-10 flex justify-center pb-4">
              <motion.button
                type="button"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                whileTap={{ scale: 0.97 }}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-3 text-sm font-medium text-[var(--color-text)] transition-all duration-200 hover:border-accent/40 hover:shadow-md"
              >
                Load More
              </motion.button>
            </div>
          )}
        </section>

        <BrowseByStyle />
      </div>
    </PageTransition>
  )
}
