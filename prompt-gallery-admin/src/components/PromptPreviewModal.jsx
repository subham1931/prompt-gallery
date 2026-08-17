import { useEffect, useRef, useState } from 'react'
import {
  Calendar,
  Check,
  Copy,
  ExternalLink,
  Eye,
  Heart,
  ImageIcon,
  Sparkles,
  Tag,
  X,
} from 'lucide-react'
import { Badge } from './ui/Badge'

export function PromptPreviewModal({ prompt, isOpen, onClose, isEdit = false }) {
  const [copied, setCopied] = useState(false)
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const onPointerDown = (e) => {
      if (!dialogRef.current?.contains(e.target)) onClose()
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, onClose])

  if (!prompt || !isOpen) return null

  const image = prompt.image || prompt.images?.[0]?.url || ''
  const isScheduled = prompt.status === 'scheduled'
  const isPublished = prompt.status === 'published'

  const handleCopy = () => {
    if (!prompt.promptText) return
    navigator.clipboard.writeText(prompt.promptText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const clientUrl = `http://localhost:5173/prompt/${prompt.slug}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div
        ref={dialogRef}
        className="w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange/10 text-orange">
              <Eye size={16} />
            </div>
            <div>
              <h3 className="m-0 text-sm font-bold text-ink">Prompt Preview</h3>
              <p className="m-0 text-[11px] text-mute-light">
                Live preview of gallery card & details
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface-muted text-mute transition-colors hover:bg-surface-subtle hover:text-ink"
          >
            <X size={15} />
          </button>
        </div>

        {/* Modal Content Grid */}
        <div className="grid grid-cols-1 gap-6 p-5 sm:p-6 md:grid-cols-2">
          {/* Left: Image Container */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl border border-border/80 bg-surface-subtle shadow-md">
              {image ? (
                <img
                  src={image}
                  alt={prompt.images?.[0]?.altText || prompt.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-mute-light">
                  <ImageIcon size={32} />
                  <span className="text-xs">No Image Uploaded</span>
                </div>
              )}

              {/* Badges Overlay */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                {String(prompt.tool || 'ChatGPT')
                  .split(',')
                  .map((m) => m.trim())
                  .filter(Boolean)
                  .map((m) => (
                    <Badge key={m} tone="default">
                      {m}
                    </Badge>
                  ))}
                {prompt.trending && <Badge tone="orange">Trending</Badge>}
              </div>

              <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 backdrop-blur-md">
                <span className="flex items-center gap-1 text-[11.5px] font-semibold text-white">
                  <Heart size={12} className="fill-orange text-orange" />
                  {prompt.likeCount || 0}
                </span>
              </div>
            </div>

            {/* Status Banner */}
            <div className="flex items-center justify-between rounded-xl border border-border/80 bg-surface-subtle/50 px-3.5 py-2.5 text-xs">
              <span className="font-semibold text-mute">Status:</span>
              {isScheduled ? (
                <span className="font-bold text-purple-400">
                  • Scheduled for {prompt.scheduledAt ? new Date(prompt.scheduledAt).toLocaleDateString() : 'Later'}
                </span>
              ) : isPublished ? (
                <span className="font-bold text-emerald-400">• Published</span>
              ) : (
                <span className="font-bold text-mute-light">• Draft</span>
              )}
            </div>
          </div>

          {/* Right: Details & Prompt Text */}
          <div className="flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-3">
              {/* Category & Slug */}
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-orange-tint px-2.5 py-0.5 text-[11px] font-bold text-orange-dark">
                  {prompt.category || 'General'}
                </span>
                <span className="truncate text-xs font-medium text-mute-light">
                  /prompts/{prompt.slug}
                </span>
              </div>

              {/* Title */}
              <h2 className="m-0 text-base font-extrabold leading-snug text-ink">
                {prompt.title || 'Untitled Prompt'}
              </h2>

              {/* Excerpt if present */}
              {prompt.excerpt && (
                <p className="m-0 text-xs leading-relaxed text-mute line-clamp-2">
                  {prompt.excerpt}
                </p>
              )}

              {/* Prompt Box */}
              <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-surface-muted p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-mute-light">
                    Prompt Code
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex cursor-pointer items-center gap-1 border-none bg-transparent text-[11px] font-bold text-orange hover:underline"
                  >
                    {copied ? (
                      <>
                        <Check size={12} /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={12} /> Copy
                      </>
                    )}
                  </button>
                </div>
                <p className="m-0 max-h-36 overflow-y-auto whitespace-pre-wrap text-xs font-mono leading-relaxed text-ink">
                  {prompt.promptText || 'No prompt text provided.'}
                </p>
              </div>

              {/* Tags */}
              {prompt.tags?.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <Tag size={12} className="text-mute-light shrink-0" />
                  {prompt.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-border/80 bg-surface-subtle px-2 py-0.5 text-[11px] font-medium text-mute"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="text-[11px] font-medium text-mute-light flex items-center gap-1">
                <Calendar size={12} />
                {prompt.createdAt ? new Date(prompt.createdAt).toLocaleDateString() : 'Recently'}
              </span>

              {isEdit && prompt?.slug && prompt.slug !== 'untitled' && (
                <a
                  href={clientUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-200 no-underline transition-colors hover:bg-zinc-800 hover:text-zinc-50"
                >
                  <ExternalLink size={13} />
                  Open Live Page
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
