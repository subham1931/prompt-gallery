import SeoHead from '../components/SeoHead'
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Share2, Check, Sparkles, Cpu, Layers, FileText } from 'lucide-react'
import { getPromptBySlug, getRelatedPrompts, getCategorySlug, togglePromptLike } from '../api'
import { useAuth } from '../context/AuthContext'
import Breadcrumb from '../components/Breadcrumb'
import CopyButton from '../components/CopyButton'
import PromptCard from '../components/PromptCard'
import BrowseByStyle from '../components/BrowseByStyle'
import PageTransition from '../components/PageTransition'

export default function PromptDetail() {
  const { slug } = useParams()
  const { user, updateUser } = useAuth()
  const [prompt, setPrompt] = useState(null)
  const [related, setRelated] = useState([])
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)
  const [shared, setShared] = useState(false)
  const [liking, setLiking] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([getPromptBySlug(slug), getRelatedPrompts(slug, 6)]).then(([data, relatedPrompts]) => {
      if (cancelled) return
      if (data) {
        setPrompt(data)
        setLikes(data.likeCount || 0)
        setLiked(Boolean(data.liked))
      } else {
        setPrompt(null)
      }
      setRelated(relatedPrompts)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [slug])

  useEffect(() => {
    if (user && prompt?.id) {
      setLiked(Boolean(user.likedPromptIds?.includes(String(prompt.id))))
    } else if (prompt) {
      setLiked(Boolean(prompt.liked))
    }
  }, [prompt, user])

  if (loading) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-7xl px-4 py-24 text-center text-slate-400">
          <div className="inline-flex items-center gap-2 rounded-full glass-pill px-6 py-3 font-bold text-orange-500 animate-pulse">
            <Sparkles size={16} /> Loading Module Parameters...
          </div>
        </div>
      </PageTransition>
    )
  }

  if (!prompt) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-7xl px-4 py-24 text-center text-slate-500">
          Module parameters not found.{' '}
          <Link to="/" className="text-orange-500 dark:text-orange-400 underline font-bold">
            Return to Terminal
          </Link>
        </div>
      </PageTransition>
    )
  }

  const categorySlug = getCategorySlug(prompt.category)
  const formattedDate = new Date(prompt.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const handleLike = async () => {
    if (!prompt?.id || liking) return
    setLiking(true)
    try {
      const data = await togglePromptLike(prompt.id)
      setLiked(data.liked)
      setLikes(data.likeCount)
      if (data.user) updateUser(data.user)
    } catch {
      setLiked((prev) => !prev)
      setLikes((prev) => (liked ? Math.max(0, prev - 1) : prev + 1))
    } finally {
      setLiking(false)
    }
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/prompt/${prompt.slug}`
    try {
      if (navigator.share) {
        await navigator.share({ title: prompt.title, text: prompt.excerpt, url })
      } else {
        await navigator.clipboard.writeText(url)
        setShared(true)
        setTimeout(() => setShared(false), 1500)
      }
    } catch {
      /* cancelled */
    }
  }

  return (
    <PageTransition>
      <div>
        <SeoHead
          title={prompt.title}
          metaTitle={prompt.metaTitle}
          description={prompt.description || prompt.excerpt}
          metaDesc={prompt.metaDesc}
          canonicalUrl={prompt.canonicalUrl || ('https://prompt-gallery-v2.vercel.app/prompt/' + prompt.slug)}
          robots={prompt.robots || 'index, follow'}
          ogTitle={prompt.ogTitle}
          ogDesc={prompt.ogDesc}
          image={prompt.image}
          type="article"
          publishedTime={prompt.createdAt || prompt.date}
          author={prompt.author}
          faqs={prompt.faqs || []}
          schemaChecks={prompt.schemaChecks || { Article: true, FAQPage: true, Breadcrumb: true }}
          breadcrumbItems={[
            { label: 'Home', to: '/' },
            { label: 'Libraries', to: '/libraries' },
            { label: prompt.category, to: '/library/' + categorySlug },
            { label: prompt.title },
          ]}
        />
        <article className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Home', to: '/' },
              { label: 'Libraries', to: '/libraries' },
              { label: prompt.category, to: `/library/${categorySlug}` },
              { label: prompt.title },
            ]}
          />

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            
            {/* Left: High-Res Image Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-6"
            >
              <div className="glass-panel overflow-hidden rounded-3xl border border-white/80 dark:border-slate-800 p-2 shadow-2xl">
                <img
                  src={prompt.image}
                  alt={prompt.title}
                  className="aspect-square w-full rounded-2xl object-cover shadow-md"
                />
              </div>
            </motion.div>

            {/* Right: Technical Parameters & Terminal */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="lg:col-span-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800/60 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                    <Sparkles size={11} />
                    {prompt.category}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider">
                    <Cpu size={11} />
                    {prompt.tool}
                  </span>
                </div>

                <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                  {prompt.title}
                </h1>
                
                <p className="mt-2 text-xs font-semibold text-slate-400">
                  Published {formattedDate} • Verified Prompt Grade
                </p>

                {(prompt.description || prompt.excerpt) && (
                  <div className="mt-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 p-4">
                    <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                      <FileText size={12} className="text-orange-500 dark:text-orange-400" />
                      <span>Prompt Guidance & Overview</span>
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-normal">
                      {prompt.description || prompt.excerpt}
                    </p>
                  </div>
                )}

                {/* Prompt Terminal Box */}
                <div className="mt-6 rounded-3xl glass-card border border-white/80 dark:border-slate-800 p-3.5 sm:p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      OPTIMIZED AI COMMAND
                    </span>
                    <CopyButton text={prompt.promptText} />
                  </div>

                  <div className="rounded-2xl bg-slate-950 p-3.5 sm:p-4 font-mono text-xs text-slate-200 leading-relaxed shadow-inner border border-slate-800 break-words whitespace-pre-wrap">
                    {prompt.promptText}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex items-center gap-3">
                  <motion.button
                    type="button"
                    onClick={handleLike}
                    whileTap={{ scale: 0.95 }}
                    className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-all ${
                      liked
                        ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40'
                        : 'glass-card text-slate-700 dark:text-white hover:bg-white/60 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Heart size={15} className={liked ? 'fill-rose-500' : ''} />
                    <span>{likes.toLocaleString()} Likes</span>
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={handleShare}
                    whileTap={{ scale: 0.95 }}
                    className="glass-card inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-white hover:bg-white/60 dark:hover:bg-slate-800"
                  >
                    {shared ? <Check size={15} className="text-emerald-500" /> : <Share2 size={15} />}
                    <span>{shared ? 'Copied Link' : 'Share'}</span>
                  </motion.button>
                </div>
              </div>

              {/* Tag Cloud */}
              <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800/80">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-3">
                  PARAMETER TAGS
                </p>
                <div className="flex flex-wrap gap-2">
                  {prompt.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/library/${getCategorySlug(tag)}`}
                      className="rounded-full bg-slate-100 dark:bg-slate-800 px-3.5 py-1 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 dark:hover:text-white transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>

            </motion.div>

          </div>

          {/* Related Prompts Grid */}
          {related.length > 0 && (
            <section className="mt-20">
              <div className="flex items-center gap-2 mb-6">
                <Layers size={18} className="text-orange-500 dark:text-orange-400" />
                <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Related Prompt Modules
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p, i) => (
                  <PromptCard key={p.id} {...p} index={i} />
                ))}
              </div>
            </section>
          )}
        </article>

        <BrowseByStyle />
      </div>
    </PageTransition>
  )
}
