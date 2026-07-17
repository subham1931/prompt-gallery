import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
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
            className="mt-6"
          >
            <h1 className="font-display text-3xl font-bold text-[var(--color-text)]">
              {displayName}
            </h1>
            <p className="mt-2 max-w-2xl text-[var(--color-text-muted)]">
              Explore {prompts.length} curated AI photo-editing prompts in the {displayName}{' '}
              collection. Copy any prompt and use it with Gemini, ChatGPT, or Midjourney.
            </p>
            {category && (
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                {category.count.toLocaleString()} prompts in library
              </p>
            )}
          </motion.div>

          {prompts.length > 0 ? (
            <div className="mt-10">
              <PromptMasonryGrid prompts={prompts} />
            </div>
          ) : (
            <div className="mt-16 text-center">
              <p className="text-[var(--color-text-muted)]">No prompts found in this category yet.</p>
              <Link
                to="/"
                className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
              >
                Browse all prompts
              </Link>
            </div>
          )}
      </div>
    </PageTransition>
  )
}
