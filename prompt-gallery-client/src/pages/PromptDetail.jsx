import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Share2, Check } from 'lucide-react'
import { getPromptBySlug, getRelatedPrompts, getCategorySlug, togglePromptLike } from '../api'
import { useAuth } from '../context/AuthContext'
import Breadcrumb from '../components/Breadcrumb'
import CopyButton from '../components/CopyButton'
import PromptCard from '../components/PromptCard'
import BrowseByStyle from '../components/BrowseByStyle'
import PageTransition from '../components/PageTransition'

export default function PromptDetail() {
  const { slug } = useParams()
  const { user, requireAuth, updateUser } = useAuth()
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
        setLikes(data.likeCount)
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
    if (!prompt?.id || !user) {
      setLiked(false)
      return
    }
    setLiked(Boolean(user.likedPromptIds?.includes(String(prompt.id))))
  }, [prompt?.id, user])

  if (loading) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-7xl px-4 py-24 text-center text-[var(--color-text-muted)]">
          Loading…
        </div>
      </PageTransition>
    )
  }

  if (!prompt) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-7xl px-4 py-24 text-center text-[var(--color-text-muted)]">
          Prompt not found.{' '}
          <Link to="/" className="text-accent hover:underline">
            Go home
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

  const handleLike = () => {
    requireAuth(async () => {
      if (!prompt.id || liking) return
      setLiking(true)
      try {
        const data = await togglePromptLike(prompt.id)
        setLiked(data.liked)
        setLikes(data.likeCount)
        if (data.user) updateUser(data.user)
      } catch {
        /* keep prior UI */
      } finally {
        setLiking(false)
      }
    })
  }

  const handleShare = () => {
    requireAuth(async () => {
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
    })
  }

  return (
    <PageTransition>
      <div>
        <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Home', to: '/' },
              { label: 'Libraries', to: '/libraries' },
              { label: prompt.category, to: `/library/${categorySlug}` },
              { label: prompt.title },
            ]}
          />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="mt-6 overflow-hidden rounded-2xl shadow-sm"
          >
            <img
              src={prompt.image}
              alt={prompt.title}
              className="aspect-square w-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
            className="mt-8"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
                  {prompt.title}
                </h1>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                  {formattedDate}
                </p>
              </div>
              <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                {prompt.tool}
              </span>
            </div>

            <div className="relative mt-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Prompt — Optimized for {prompt.tool}
                </span>
                <CopyButton text={prompt.promptText} />
              </div>
              <div className="rounded-xl bg-[var(--color-surface)] p-4">
                <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-[var(--color-text)]">
                  {prompt.promptText}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <motion.button
                type="button"
                onClick={handleLike}
                whileTap={{ scale: 0.96 }}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  liked
                    ? 'border-accent/30 bg-accent/10 text-accent'
                    : 'border-[var(--color-border)] text-[var(--color-text)] hover:border-accent/30 hover:text-accent'
                }`}
              >
                <Heart size={16} className={liked ? 'fill-current' : ''} />
                {likes.toLocaleString()}
              </motion.button>
              <motion.button
                type="button"
                onClick={handleShare}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition-all duration-200 hover:border-accent/30 hover:text-accent"
              >
                {shared ? <Check size={16} /> : <Share2 size={16} />}
                {shared ? 'Copied link' : 'Share'}
              </motion.button>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {prompt.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/library/${getCategorySlug(tag)}`}
                  className="rounded-full bg-[var(--color-surface-muted)] px-3 py-1 text-xs font-medium text-[var(--color-text-muted)] transition-colors duration-200 hover:bg-accent/10 hover:text-accent"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </motion.div>

          {related.length > 0 && (
            <section className="mt-16">
              <h2 className="font-display mb-6 text-xl font-semibold text-[var(--color-text)]">
                You might also like
              </h2>
              <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide snap-x snap-mandatory sm:-mx-0 sm:px-0">
                {related.map((p, i) => (
                  <div key={p.id} className="w-56 shrink-0 snap-start sm:w-64">
                    <PromptCard {...p} index={i} />
                  </div>
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
