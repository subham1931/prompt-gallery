import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowDown } from 'lucide-react'
import { getPrompts, searchPrompts } from '../api'
import HeroSection from '../components/HeroSection'
import PromptMasonryGrid from '../components/PromptMasonryGrid'
import Tabs from '../components/Tabs'
import BrowseByStyle from '../components/BrowseByStyle'
import FAQSection from '../components/FAQSection'
import PageTransition from '../components/PageTransition'

const TABS = [
  { id: 'latest', label: 'Latest' },
  { id: 'trending', label: 'Trending' },
  { id: 'popular', label: 'Popular' },
]

const PAGE_SIZE = 8

export default function Home() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') || ''
  const sortParam = searchParams.get('sort') || 'latest'

  const [allPrompts, setAllPrompts] = useState([])
  const [activeTab, setActiveTab] = useState(sortParam)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setActiveTab(sortParam)
  }, [sortParam])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const load = searchQuery.trim()
      ? searchPrompts(searchQuery)
      : getPrompts({ sort: activeTab })

    load
      .then((data) => {
        if (!cancelled) {
          setAllPrompts(data || [])
          setVisibleCount(PAGE_SIZE)
        }
      })
      .catch(() => {
        if (!cancelled) setAllPrompts([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [activeTab, searchQuery])

  const visiblePrompts = allPrompts.slice(0, visibleCount)
  const hasMore = visibleCount < allPrompts.length

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setVisibleCount(PAGE_SIZE)
    const params = new URLSearchParams(searchParams)
    if (tab === 'latest') {
      params.delete('sort')
    } else {
      params.set('sort', tab)
    }
    navigate({ search: params.toString() }, { replace: true })
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        
        {/* Liquid Systems Hero Section with 3D Prompt Stack */}
        <HeroSection />

        {/* Gallery Grid Container */}
        <section id="gallery-grid" className="mx-auto max-w-7xl px-3 pt-6 sm:pt-12 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/80 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-orange-600 dark:border-orange-900/50 dark:bg-orange-950/50 dark:text-orange-400 mb-3">
              <Sparkles size={13} />
              <span>PROMPT REPOSITORY</span>
            </div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Curated Prompt Index.
            </h2>
          </div>

          <Tabs tabs={TABS} activeTab={activeTab} onChange={handleTabChange} />

          <div className="mt-8 min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab + searchQuery}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                {loading ? (
                  <div className="py-20 text-center text-orange-500 font-bold animate-pulse">
                    <Sparkles className="inline-block mr-2" size={18} />
                    Loading {activeTab} prompt collection...
                  </div>
                ) : visiblePrompts.length > 0 ? (
                  <PromptMasonryGrid prompts={visiblePrompts} />
                ) : (
                  <div className="py-20 text-center text-slate-400 font-medium">
                    No prompts found for "{searchQuery}". Try another keyword or reset search.
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {hasMore && (
            <div className="mt-12 flex justify-center pb-8">
              <motion.button
                type="button"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-xl hover:bg-slate-800 dark:bg-orange-500 dark:text-white dark:hover:bg-orange-600 transition-all hover:-translate-y-0.5"
              >
                <span>Load Additional Prompts</span>
                <ArrowDown size={14} />
              </motion.button>
            </div>
          )}
        </section>

        {/* Category Index & FAQs */}
        <BrowseByStyle />
        <FAQSection />

      </div>
    </PageTransition>
  )
}
