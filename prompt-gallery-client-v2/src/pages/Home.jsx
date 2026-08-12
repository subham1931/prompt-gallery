import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
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
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') || ''

  const [allPrompts, setAllPrompts] = useState([])
  const [activeTab, setActiveTab] = useState('latest')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    let cancelled = false
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

    return () => {
      cancelled = true
    }
  }, [activeTab, searchQuery])

  const visiblePrompts = allPrompts.slice(0, visibleCount)
  const hasMore = visibleCount < allPrompts.length

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        
        {/* Liquid Systems Hero Section with 3D Prompt Stack */}
        <HeroSection />

        {/* Gallery Grid Container */}
        <section id="gallery-grid" className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
          
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

          <div className="mt-8">
            {visiblePrompts.length > 0 ? (
              <PromptMasonryGrid prompts={visiblePrompts} />
            ) : (
              <div className="py-20 text-center text-slate-400 font-medium">
                No prompts found for "{searchQuery}". Try another keyword or reset search.
              </div>
            )}
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
