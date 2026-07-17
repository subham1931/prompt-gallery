import { useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Calendar } from 'lucide-react'
import PageTransition from '../components/PageTransition'

const PROFILE = {
  name: 'Alex Rivera',
  handle: '@alexrivera',
  bio: 'Photographer and prompt curator exploring cinematic light, editorial fashion, and everyday moments.',
  joined: 'November 2025',
  email: 'alex@example.com',
}

export default function Profile() {
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    name: PROFILE.name,
    handle: PROFILE.handle,
    email: PROFILE.email,
    bio: PROFILE.bio,
  })

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setSaved(false)
  }

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="relative shrink-0">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--color-text)] text-2xl font-bold text-accent sm:h-24 sm:w-24 sm:text-3xl">
                {form.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--color-surface)] bg-accent text-white">
                <Camera size={14} />
              </span>
            </div>

            <div className="min-w-0 pt-1">
              <h1 className="font-display text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
                {form.name}
              </h1>
              <p className="mt-0.5 text-sm text-[var(--color-text-muted)]">{form.handle}</p>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--color-text-muted)] sm:text-base">
                {form.bio}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.06, ease: 'easeOut' }}
          className="mt-8 flex flex-wrap gap-6 border-y border-[var(--color-border)] py-5 sm:gap-10"
        >
          <div className="flex items-center gap-2.5">
            <Calendar size={16} className="text-accent" />
            <div>
              <p className="font-display text-lg font-semibold text-[var(--color-text)]">
                {PROFILE.joined}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">Joined</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.12, ease: 'easeOut' }}
          className="mt-10"
        >
          <h2 className="font-display text-xl font-semibold text-[var(--color-text)]">
            Settings
          </h2>

          <form onSubmit={handleSave} className="mt-6 max-w-xl space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-[var(--color-text)]"
              >
                Display name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div>
              <label
                htmlFor="handle"
                className="mb-1.5 block text-sm font-medium text-[var(--color-text)]"
              >
                Handle
              </label>
              <input
                id="handle"
                name="handle"
                type="text"
                required
                value={form.handle}
                onChange={handleChange}
                className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-[var(--color-text)]"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div>
              <label
                htmlFor="bio"
                className="mb-1.5 block text-sm font-medium text-[var(--color-text)]"
              >
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={form.bio}
                onChange={handleChange}
                className="w-full resize-y rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            {saved && (
              <p className="rounded-lg border border-accent/20 bg-accent/5 px-3 py-2 text-sm text-[var(--color-text)]">
                Profile updated.
              </p>
            )}

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              Save changes
            </button>
          </form>
        </motion.div>
      </div>
    </PageTransition>
  )
}
