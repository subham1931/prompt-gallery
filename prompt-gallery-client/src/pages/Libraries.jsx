import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getCategories, getPromptsByCategorySlug } from '../api'
import Breadcrumb from '../components/Breadcrumb'
import PageTransition from '../components/PageTransition'

export default function Libraries() {
  const [categories, setCategories] = useState([])
  const [thumbnails, setThumbnails] = useState({})

  useEffect(() => {
    getCategories().then(async (cats) => {
      setCategories(cats)
      const thumbs = {}
      await Promise.all(
        cats.map(async (cat) => {
          const prompts = await getPromptsByCategorySlug(cat.slug)
          if (prompts.length > 0) {
            thumbs[cat.slug] = prompts[0].image
          }
        })
      )
      setThumbnails(thumbs)
    })
  }, [])

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Home', to: '/' },
              { label: 'Libraries' },
            ]}
          />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="mt-6"
          >
            <h1 className="font-display text-3xl font-bold text-[var(--color-text)]">
              All Libraries
            </h1>
            <p className="mt-2 max-w-2xl text-[var(--color-text-muted)]">
              Browse prompts organized by style and category. Each library contains curated
              prompts for a specific aesthetic or use case.
            </p>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.04, ease: 'easeOut' }}
              >
                <Link
                  to={`/library/${cat.slug}`}
                  className="group block overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-200 hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-[var(--color-surface-muted)]">
                    {thumbnails[cat.slug] ? (
                      <img
                        src={thumbnails[cat.slug]}
                        alt={cat.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="font-display flex h-full items-center justify-center text-4xl font-bold text-accent/30">
                        {cat.icon}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <h2 className="font-display text-lg font-semibold text-[var(--color-text)] transition-colors duration-200 group-hover:text-accent">
                        {cat.name}
                      </h2>
                      <span className="rounded-full bg-[var(--color-surface-muted)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-text-muted)]">
                        {cat.count}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                      {cat.count} prompts available
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
      </div>
    </PageTransition>
  )
}
