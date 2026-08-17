import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { User, Calendar, ShieldCheck, Tag, ArrowLeft, Share2, Check, Sparkles } from 'lucide-react'
import { getBlogBySlug, getBlogs } from '../api'
import Breadcrumb from '../components/Breadcrumb'
import PageTransition from '../components/PageTransition'

export default function BlogDetail() {
  const { slug } = useParams()
  const [blog, setBlog] = useState(null)
  const [recentBlogs, setRecentBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [shared, setShared] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([getBlogBySlug(slug), getBlogs({ limit: 4 })]).then(([data, recent]) => {
      if (cancelled) return
      setBlog(data)
      setRecentBlogs((recent || []).filter((b) => b.slug !== slug))
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [slug])

  const handleShare = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: blog?.title, url })
      } else {
        await navigator.clipboard.writeText(url)
        setShared(true)
        setTimeout(() => setShared(false), 1500)
      }
    } catch {
      /* ignore */
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center text-sm font-semibold text-slate-400">
        Loading article details...
      </div>
    )
  }

  if (!blog) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-4xl px-4 py-24 text-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Article not found</h2>
          <p className="mt-2 text-xs text-slate-500">The blog post you requested does not exist or has been removed.</p>
          <Link to="/blogs" className="mt-4 inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2 text-xs font-bold text-white no-underline">
            <ArrowLeft size={14} /> Return to Blogs
          </Link>
        </div>
      </PageTransition>
    )
  }

  const formattedDate = new Date(blog.createdAt || blog.date || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <PageTransition>
      <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: 'Home', to: '/' },
            { label: 'Blogs', to: '/blogs' },
            { label: blog.title },
          ]}
        />

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-orange-500">
              <Sparkles size={12} />
              {blog.category}
            </span>
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <Calendar size={13} />
              {formattedDate}
            </span>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/10 dark:bg-white/10 px-4 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-orange-500 hover:text-white transition-colors cursor-pointer border-none"
          >
            {shared ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
            <span>{shared ? 'Link Copied' : 'Share Article'}</span>
          </button>
        </div>

        <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl leading-tight">
          {blog.h1 || blog.title}
        </h1>

        <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 p-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-white font-extrabold text-xs">
              {blog.author.charAt(0)}
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-900 dark:text-white">{blog.author}</div>
              <div className="text-[10px] text-slate-400">Author & Content Strategist</div>
            </div>
          </div>

          {blog.factCheckBy && (
            <div className="flex items-center gap-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-500">
              <ShieldCheck size={14} />
              <span>Fact checked by {blog.factCheckBy}</span>
            </div>
          )}
        </div>

        {blog.coverImage && (
          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl">
            <img
              src={blog.coverImage}
              alt={blog.imageAltText || blog.title}
              className="w-full max-h-[500px] object-cover"
            />
          </div>
        )}

        {blog.shortDescription && (
          <div className="mt-8 rounded-2xl bg-orange-500/5 border-l-4 border-orange-500 p-5 text-base font-semibold leading-relaxed text-slate-800 dark:text-slate-200">
            {blog.shortDescription}
          </div>
        )}

        <div
          className="mt-8 prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed text-sm sm:text-base space-y-4"
          dangerouslySetInnerHTML={{ __html: blog.description }}
        />

        {Array.isArray(blog.keywords) && blog.keywords.length > 0 && (
          <div className="mt-12 border-t border-slate-200/60 dark:border-slate-800/80 pt-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1 mr-2">
                <Tag size={13} /> Keywords:
              </span>
              {blog.keywords.map((kw) => (
                <span
                  key={kw}
                  className="rounded-full bg-slate-900/5 dark:bg-white/10 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  #{kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {recentBlogs.length > 0 && (
          <div className="mt-16 border-t border-slate-200/60 dark:border-slate-800/80 pt-10">
            <h3 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white mb-6">
              More AI Guides & Articles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {recentBlogs.map((b) => (
                <Link
                  key={b.slug}
                  to={'/blogs/' + b.slug}
                  className="glass-card flex items-center gap-4 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 no-underline hover:-translate-y-0.5 transition-all"
                >
                  {b.coverImage && (
                    <img src={b.coverImage} alt={b.title} className="h-16 w-20 shrink-0 rounded-xl object-cover" />
                  )}
                  <div>
                    <h4 className="line-clamp-2 font-bold text-sm text-slate-900 dark:text-white">{b.title}</h4>
                    <span className="text-[11px] font-semibold text-orange-500 mt-1 block">Read Guide →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </PageTransition>
  )
}
