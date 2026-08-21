import SeoHead from '../components/SeoHead'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, ArrowRight, Sparkles, User, Calendar } from 'lucide-react'
import { getBlogs } from '../api'
import Breadcrumb from '../components/Breadcrumb'
import PageTransition from '../components/PageTransition'

export default function Blogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBlogs()
      .then((data) => setBlogs(data || []))
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageTransition>
      <SeoHead
        title="AI Guides & Prompt Engineering Articles — PromptGallery"
        metaTitle="AI Guides & Prompt Engineering Articles — PromptGallery"
        description="Read latest articles, tutorials, and guides on AI photo generation, Midjourney prompts, and ChatGPT prompt engineering."
        metaDesc="Read latest articles, tutorials, and guides on AI photo generation, Midjourney prompts, and ChatGPT prompt engineering."
        canonicalUrl="https://prompt-gallery-v2.vercel.app/blogs"
        robots="index, follow"
        type="website"
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Blogs & Guides' }]} />

        <div className="mt-8 mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-orange-500 mb-4">
            <Sparkles size={13} />
            <span>AI INSIGHTS & GUIDES</span>
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Latest AI Articles & Prompt Engineering Guides.
          </h1>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
            Deep dives, parameter breakdowns, and battle-tested prompt systems written for AI creators and engineers.
          </p>
        </div>

        {loading ? (
          <div className="py-24 text-center text-sm font-semibold text-slate-400">Loading blog articles...</div>
        ) : blogs.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center text-slate-400">
            <FileText size={36} className="mx-auto mb-3 text-orange-500" />
            <p className="text-base font-bold text-slate-900 dark:text-white">No articles published yet.</p>
            <p className="mt-1 text-xs">Check back soon for new AI prompt guides!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((b, index) => {
              const formattedDate = new Date(b.createdAt || b.date || Date.now()).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })

              return (
                <motion.article
                  key={b._id || b.id || b.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="glass-card group flex flex-col overflow-hidden rounded-3xl border border-slate-200/90 dark:border-slate-800/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <Link to={'/blogs/' + b.slug} className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={b.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'}
                      alt={b.imageAltText || b.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 rounded-full bg-slate-900/80 backdrop-blur-md px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-orange-400 border border-orange-500/20">
                      {b.category}
                    </span>
                  </Link>

                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <div className="flex items-center gap-3 text-xs font-semibold text-slate-400 mb-3">
                        <span className="flex items-center gap-1">
                          <User size={13} className="text-orange-500" />
                          {b.author}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar size={13} />
                          {formattedDate}
                        </span>
                      </div>

                      <h2 className="font-display text-xl font-extrabold tracking-tight text-slate-900 dark:text-white line-clamp-2 group-hover:text-orange-500 transition-colors">
                        <Link to={'/blogs/' + b.slug} className="no-underline text-inherit">
                          {b.title}
                        </Link>
                      </h2>

                      <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-3">
                        {b.shortDescription || b.metaDesc}
                      </p>
                    </div>

                    <div className="mt-6 border-t border-slate-200/60 dark:border-slate-800/80 pt-4 flex items-center justify-between">
                      <Link
                        to={'/blogs/' + b.slug}
                        className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-orange-500 hover:text-orange-600 no-underline transition-all"
                      >
                        <span>Read Article</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        )}
      </div>
    </PageTransition>
  )
}
