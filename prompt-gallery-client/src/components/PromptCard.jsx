import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart, Copy, Check, Share2 } from 'lucide-react'
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
  aspect = 'portrait',
  index = 0,
}) {
  const { user, requireAuth, updateUser } = useAuth()
  const ratioClass = aspectClasses[aspect] || aspectClasses.portrait
  const [likes, setLikes] = useState(likeCount)
  const [liked, setLiked] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)
  const [liking, setLiking] = useState(false)

  const copyText = promptText || excerpt || ''

  useEffect(() => {
    setLikes(likeCount)
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3), ease: 'easeOut' }}
      className="w-full"
    >
      <div className="group relative overflow-hidden rounded-xl shadow-sm transition-all duration-200 ease-out sm:rounded-2xl sm:hover:-translate-y-1 sm:hover:scale-[1.01] sm:hover:shadow-xl">
        <div className={`relative w-full ${ratioClass}`}>
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out sm:group-hover:scale-[1.03]"
          />

          <Link
            to={`/prompt/${slug}`}
            className="absolute inset-0 z-[1]"
            aria-label={`View ${title}`}
          />

          <span className="pointer-events-none absolute left-2 top-2 z-[2] max-w-[calc(100%-3.5rem)] truncate rounded-md bg-black px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-md sm:left-3 sm:top-3 sm:max-w-[calc(100%-4rem)] sm:px-2.5 sm:py-1 sm:text-[10px] sm:tracking-wider">
            {category}
          </span>

          <motion.button
            type="button"
            onClick={handleShare}
            whileTap={{ scale: 0.92 }}
            aria-label={shared ? 'Link copied' : 'Share prompt'}
            className="absolute right-2 top-2 z-[3] flex h-7 w-7 items-center justify-center rounded-full bg-black/85 text-white shadow-md backdrop-blur-sm sm:right-3 sm:top-3 sm:h-8 sm:w-8"
          >
            {shared ? <Check size={13} /> : <Share2 size={13} />}
          </motion.button>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-black/95 via-black/80 to-transparent px-2.5 pb-2.5 pt-10 sm:px-3 sm:pb-3 sm:pt-16">
            <h3 className="font-display line-clamp-1 text-sm font-bold leading-snug text-white sm:text-base">
              {title}
            </h3>
            {excerpt && (
              <p className="mt-0.5 line-clamp-1 text-[11px] leading-relaxed text-white/65 sm:mt-1 sm:line-clamp-2 sm:text-xs">
                {excerpt}
              </p>
            )}

            <div className="pointer-events-auto mt-2 flex items-center gap-1.5 sm:mt-2.5 sm:gap-2">
              <motion.button
                type="button"
                onClick={handleLike}
                whileTap={{ scale: 0.92 }}
                aria-label={liked ? 'Liked' : 'Like prompt'}
                className="inline-flex min-h-[28px] items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm sm:px-3 sm:py-1.5 sm:text-xs"
              >
                <Heart
                  size={12}
                  className={liked ? 'fill-accent text-accent' : 'text-white/90'}
                />
                {likes.toLocaleString()}
              </motion.button>

              <motion.button
                type="button"
                onClick={handleCopy}
                whileTap={{ scale: 0.96 }}
                aria-label={copied ? 'Copied' : 'Copy prompt'}
                className="inline-flex min-h-[28px] items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-white sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
