import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, Send } from 'lucide-react'
import StaticPageLayout from '../components/StaticPageLayout'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <StaticPageLayout
      title="Contact Platform Team"
      subtitle="Have a question, suggestion, or custom prompt integration inquiry? Reach out directly."
      breadcrumb="Contact"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-start gap-3.5 rounded-2xl border border-white/80 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-4 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
            <Mail size={18} />
          </div>
          <div>
            <p className="font-display text-sm font-extrabold text-slate-900 dark:text-white">Direct Email</p>
            <p className="mt-0.5 text-xs text-slate-500 font-mono">support@promptgallery.com</p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 rounded-2xl border border-white/80 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-4 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
            <MessageSquare size={18} />
          </div>
          <div>
            <p className="font-display text-sm font-extrabold text-slate-900 dark:text-white">Response Latency</p>
            <p className="mt-0.5 text-xs text-slate-500">Replies within 1–2 business hours.</p>
          </div>
        </div>
      </div>

      {submitted ? (
        <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
          <h3 className="font-display text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            Message Transmitted
          </h3>
          <p className="mt-2 text-xs font-semibold text-slate-400">
            Thank you for contacting Prompt Gallery. Our support team will process your message promptly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Your Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="glass-input h-11 w-full rounded-2xl py-0 px-4 text-xs font-semibold"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@company.com"
              className="glass-input h-11 w-full rounded-2xl py-0 px-4 text-xs font-semibold"
            />
          </div>
          <div>
            <label htmlFor="message" className="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Message Details
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={form.message}
              onChange={handleChange}
              placeholder="Describe your inquiry..."
              className="glass-input w-full resize-none rounded-2xl p-4 text-xs font-semibold"
            />
          </div>
          <motion.button
            type="submit"
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3 text-xs font-extrabold uppercase tracking-wider text-white shadow-xl hover:bg-slate-800 dark:bg-orange-500 dark:text-white dark:hover:bg-orange-600 transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Transmit Message</span>
            <Send size={13} />
          </motion.button>
        </form>
      )}
    </StaticPageLayout>
  )
}
