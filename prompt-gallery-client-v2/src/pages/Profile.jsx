import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, KeyRound, LogOut, Heart, Sparkles } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import ChangePasswordModal from '../components/ChangePasswordModal'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const navigate = useNavigate()
  const { user, isAuthenticated, signOut, booting } = useAuth()
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

  useEffect(() => {
    if (!booting && !isAuthenticated) {
      navigate('/signin?next=/profile', { replace: true })
    }
  }, [booting, isAuthenticated, navigate])

  if (booting) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-7xl px-4 py-24 text-center text-slate-400">
          <div className="inline-flex items-center gap-2 rounded-full glass-pill px-6 py-3 font-bold text-orange-500 animate-pulse">
            <Sparkles size={16} /> Loading Profile Data...
          </div>
        </div>
      </PageTransition>
    )
  }

  if (!user) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-lg px-4 py-24 text-center">
          <div className="glass-card rounded-3xl p-8 border border-white/80 dark:border-slate-800 shadow-2xl">
            <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">Sign In Required</h1>
            <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              Create an account or sign in to view your saved prompts and profile settings.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Link
                to="/signin?next=/profile"
                className="inline-flex h-10 items-center rounded-full glass-card px-6 text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-white"
              >
                Sign In
              </Link>
              <Link
                to="/signup?next=/profile"
                className="inline-flex h-10 items-center rounded-full bg-orange-500 px-6 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg hover:bg-orange-600"
              >
                Sign Up
              </Link>
            </div>
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
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Profile Glass Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="glass-card rounded-3xl border border-white/80 dark:border-slate-800 p-6 sm:p-8 shadow-2xl flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-500 text-2xl font-extrabold text-white shadow-xl">
              {initials}
            </div>
            <div>
              <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">
                {user.name}
              </h1>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">{user.email}</p>
              {joined && (
                <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-orange-500 dark:text-orange-400">
                  <Calendar size={12} />
                  Member Since {joined}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(true)}
              className="glass-card inline-flex h-10 items-center gap-2 rounded-full px-5 text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-white hover:bg-white/60 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <KeyRound size={14} className="text-orange-500 dark:text-orange-400" />
              <span>Security</span>
            </button>

            <button
              type="button"
              onClick={signOut}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-rose-500/10 px-5 text-xs font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </motion.div>

        {/* Activity Glass Panel */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05, ease: 'easeOut' }}
          className="mt-8 glass-panel rounded-3xl border border-white/80 dark:border-slate-800 p-6 sm:p-8 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
                <Heart size={20} className="fill-rose-500" />
              </div>
              <div>
                <h2 className="font-display text-lg font-extrabold text-slate-900 dark:text-white">
                  Saved Prompt Bookmarks
                </h2>
                <p className="text-xs text-slate-400">
                  Synchronized across your session profile
                </p>
              </div>
            </div>

            <span className="rounded-full bg-orange-500 px-4 py-1.5 text-xs font-extrabold text-white shadow-md">
              {(user.likedPromptIds || []).length} Saved
            </span>
          </div>

          <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Every prompt you like or copy is linked to your account session for fast access.
          </p>
        </motion.div>

        {/* Change Password Modal */}
        <ChangePasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
        />
      </div>
    </PageTransition>
  )
}
