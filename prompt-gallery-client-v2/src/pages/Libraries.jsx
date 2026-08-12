import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Layers, ArrowRight } from 'lucide-react'
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
          className="mt-6 text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/80 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-orange-600 dark:border-orange-900/50 dark:bg-orange-950/50 dark:text-orange-400 mb-3">
            <Layers size={13} />
            <span>SPECIALIZED LIBRARIES</span>
          </div>

          <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Prompt Libraries Index.
          </h1>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            Browse prompts organized by style, category, and aesthetic. Each library contains studio-tested prompts for high-resolution AI visual generation.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.04, ease: 'easeOut' }}
            >
              <Link
                to={`/library/${cat.slug}`}
                className="glass-card group block overflow-hidden rounded-3xl border border-white/80 dark:border-slate-800 transition-all duration-300 hover:-translate-y-1.5 hover:border-orange-500/40 shadow-xl"
              >
                <div className="aspect-[16/9] overflow-hidden bg-slate-950 relative">
                  {thumbnails[cat.slug] ? (
                    <img
                      src={thumbnails[cat.slug]}
                      alt={cat.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="font-display flex h-full items-center justify-center text-4xl font-extrabold text-orange-400">
                      {cat.icon || cat.name.charAt(0)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  <span className="absolute bottom-3 left-3 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white border border-white/30">
                    {cat.count} Prompts
                  </span>
                </div>

                <div className="p-6 flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-xl font-extrabold text-slate-900 dark:text-white transition-colors duration-200 group-hover:text-orange-500 dark:group-hover:text-orange-400">
                      {cat.name}
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">
                      Curated library collection
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  )
}
