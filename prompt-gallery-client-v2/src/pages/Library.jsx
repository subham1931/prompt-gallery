import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Layers } from 'lucide-react'
import { getCategoryBySlug, getPromptsByCategorySlug } from '../api'
import Breadcrumb from '../components/Breadcrumb'
import PromptMasonryGrid from '../components/PromptMasonryGrid'
import PageTransition from '../components/PageTransition'

export default function Library() {
  const { categorySlug } = useParams()
  const [category, setCategory] = useState(null)
  const [prompts, setPrompts] = useState([])

  useEffect(() => {
    getCategoryBySlug(categorySlug).then(setCategory)
    getPromptsByCategorySlug(categorySlug).then(setPrompts)
  }, [categorySlug])

  const displayName =
    category?.name ||
    categorySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: 'Home', to: '/' },
            { label: 'Libraries', to: '/libraries' },
            { label: displayName },
          ]}
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="mt-6 text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/80 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-orange-600 dark:border-orange-900/50 dark:bg-orange-950/50 dark:text-orange-400 mb-3">
            <Layers size={13} />
            <span>LIBRARY MODULE</span>
          </div>

          <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            {displayName} Collection.
          </h1>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            Explore studio-tested AI prompts engineered for the {displayName} aesthetic. Click copy on any prompt to deploy in ChatGPT, Midjourney, or Gemini.
          </p>
        </motion.div>

        {prompts.length > 0 ? (
          <div className="mt-12">
            <PromptMasonryGrid prompts={prompts} />
          </div>
        ) : (
          <div className="mt-20 text-center py-16">
            <p className="text-slate-400">No prompts found in this library category yet.</p>
            <Link
              to="/"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-2.5 text-xs font-bold text-white hover:bg-orange-600"
            >
              <Sparkles size={14} />
              Return to All Prompts
            </Link>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
