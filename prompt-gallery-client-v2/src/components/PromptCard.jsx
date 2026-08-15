import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart, Copy, Check, Share2, Sparkles } from 'lucide-react'
import { togglePromptLike } from '../api'
import { useAuth } from '../context/AuthContext'

const aspectClasses = {
  square: 'aspect-[4/5] sm:aspect-square',
  portrait: 'aspect-[4/5]',
  tall: 'aspect-[4/5] sm:aspect-[3/4]',
}

export default function PromptCard({
  id,
  image,
  title,
  category,
  likeCount,
  slug,
  promptText,
  excerpt,
  tags = [],
  aspect = 'portrait',
  index = 0,
}) {
  const { user, requireAuth, updateUser } = useAuth()
  const ratioClass = aspectClasses[aspect] || aspectClasses.portrait
  const [likes, setLikes] = useState(likeCount || 0)
  const [liked, setLiked] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)
  const [liking, setLiking] = useState(false)

  const copyText = promptText || excerpt || ''

  useEffect(() => {
    setLikes(likeCount || 0)
  }, [likeCount])

  useEffect(() => {
    setLiked(Boolean(id && user?.likedPromptIds?.includes(String(id))))
  }, [id, user])

  const handleLike = (e) => {
    e.preventDefault()
    e.stopPropagation()
    requireAuth(async () => {
      if (!id || liking) return
      setLiking(true)
      try {
        const data = await togglePromptLike(id)
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

  const handleCopy = (e) => {
    e.preventDefault()
    e.stopPropagation()
    requireAuth(async () => {
      try {
        await navigator.clipboard.writeText(copyText)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      } catch {
        setCopied(false)
      }
    })
  }

  const handleShare = (e) => {
    e.preventDefault()
    e.stopPropagation()
    requireAuth(async () => {
      const url = `${window.location.origin}/prompt/${slug}`
      try {
        if (navigator.share) {
          await navigator.share({ title, text: excerpt, url })
        } else {
          await navigator.clipboard.writeText(url)
          setShared(true)
          setTimeout(() => setShared(false), 1500)
        }
      } catch {
        /* user cancelled share */
      }
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.4), ease: 'easeOut' }}
      className="w-full"
    >
      <div className="glass-card group relative overflow-hidden rounded-3xl border border-slate-200/90 dark:border-slate-800/80 transition-all duration-300 isolation-auto bg-white/90 dark:bg-slate-900/90">
        <div className={`relative w-full ${ratioClass} overflow-hidden`}>
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          <Link
            to={`/prompt/${slug}`}
            className="absolute inset-0 z-[1]"
            aria-label={`View ${title}`}
          />

          {/* Top Category Badge */}
          <span className="pointer-events-none absolute left-3 top-3 z-[2] inline-flex items-center gap-1 rounded-full bg-slate-900/80 dark:bg-white/90 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white dark:text-slate-900 shadow-md backdrop-blur-md">
            <Sparkles size={11} className="text-orange-400 dark:text-orange-500" />
            {category}
          </span>

          {/* Top Right Share Button */}
          <motion.button
            type="button"
            onClick={handleShare}
            whileTap={{ scale: 0.9 }}
            aria-label={shared ? 'Link copied' : 'Share prompt'}
            className="absolute right-3 top-3 z-[3] flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/60 text-white backdrop-blur-md hover:bg-slate-900 transition-all shadow-md"
          >
            {shared ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
          </motion.button>

          {/* Dark Overlay Gradient */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent px-4 pb-4 pt-16">
            <h3 className="font-display line-clamp-1 text-base font-extrabold tracking-tight text-white sm:text-lg">
              {title}
            </h3>
            {excerpt && (
              <p className="mt-1 line-clamp-2 text-xs font-normal leading-relaxed text-slate-300">
                {excerpt}
              </p>
            )}

            {/* Action Bar */}
            <div className="pointer-events-auto mt-3 flex items-center justify-between gap-2 border-t border-white/10 pt-3">
              <motion.button
                type="button"
                onClick={handleLike}
                whileTap={{ scale: 0.92 }}
                aria-label={liked ? 'Liked' : 'Like prompt'}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                  liked
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-md'
                }`}
              >
                <Heart
                  size={14}
                  className={liked ? 'fill-rose-500 text-rose-500' : 'text-white/90'}
                />
                <span>{likes.toLocaleString()}</span>
              </motion.button>

              <motion.button
                type="button"
                onClick={handleCopy}
                whileTap={{ scale: 0.95 }}
                aria-label={copied ? 'Copied' : 'Copy prompt'}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider transition-all shadow-md ${
                  copied
                    ? 'bg-emerald-500 text-white'
                    : 'bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-500 dark:text-white dark:hover:bg-orange-600'
                }`}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </motion.button>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  )
}
