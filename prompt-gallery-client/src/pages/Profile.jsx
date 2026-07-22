import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, LogOut } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const navigate = useNavigate()
  const { user, isAuthenticated, signOut, booting } = useAuth()

  useEffect(() => {
    if (!booting && !isAuthenticated) {
      navigate('/signin?next=/profile', { replace: true })
    }
  }, [booting, isAuthenticated, navigate])

  if (booting) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-7xl px-4 py-24 text-center text-[var(--color-text-muted)]">
          Loading…
        </div>
      </PageTransition>
    )
  }

  if (!user) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="font-display text-2xl font-bold text-[var(--color-text)]">Sign in required</h1>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Create an account or sign in to view your profile.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <Link
              to="/signin?next=/profile"
              className="inline-flex h-10 items-center rounded-xl border border-[var(--color-border)] px-4 text-sm font-semibold text-[var(--color-text)]"
            >
              Sign in
            </Link>
            <Link
              to="/signup?next=/profile"
              className="inline-flex h-10 items-center rounded-xl bg-accent px-4 text-sm font-semibold text-white"
            >
              Sign up
            </Link>
          </div>
        </div>
      </PageTransition>
    )
  }

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const joined = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      })
    : ''

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
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--color-text)] text-2xl font-bold text-accent sm:h-24 sm:w-24 sm:text-3xl">
              {initials}
            </div>
            <div className="min-w-0 pt-1">
              <h1 className="font-display text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
                {user.name}
              </h1>
              <p className="mt-0.5 text-sm text-[var(--color-text-muted)]">{user.email}</p>
              {joined && (
                <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
                  <Calendar size={13} />
                  Joined {joined}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={signOut}
            className="inline-flex h-10 items-center gap-2 self-start rounded-xl border border-[var(--color-border)] px-4 text-sm font-semibold text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-muted)]"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05, ease: 'easeOut' }}
          className="mt-10 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-6"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            Activity
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text)]">
            Liked prompts: {(user.likedPromptIds || []).length}
          </p>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Copy, like, and share stay unlocked while you&apos;re signed in.
          </p>
        </motion.div>
      </div>
    </PageTransition>
  )
}
