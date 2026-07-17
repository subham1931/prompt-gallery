import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageSquare } from 'lucide-react'
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
      title="Contact Us"
      subtitle="Have a question, suggestion, or partnership inquiry? We'd love to hear from you."
      breadcrumb="Contact"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4">
          <Mail size={18} className="mt-0.5 shrink-0 text-accent" />
          <div>
            <p className="font-medium text-[var(--color-text)]">Email</p>
            <p className="mt-1 text-sm">hello@promptgallery.com</p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4">
          <MessageSquare size={18} className="mt-0.5 shrink-0 text-accent" />
          <div>
            <p className="font-medium text-[var(--color-text)]">Response time</p>
            <p className="mt-1 text-sm">We typically reply within 1–2 business days.</p>
          </div>
        </div>
      </div>

      {submitted ? (
        <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6 text-center">
          <p className="font-display text-lg font-semibold text-[var(--color-text)]">
            Message sent!
          </p>
          <p className="mt-2 text-sm">
            Thanks for reaching out. We'll get back to you soon.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <div>
            <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={form.message}
              onChange={handleChange}
              className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            className="rounded-xl bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Send message
          </motion.button>
        </form>
      )}
    </StaticPageLayout>
  )
}
