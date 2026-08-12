import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, CheckCircle2, Eye, EyeOff, KeyRound, Loader2, LogOut, ShieldAlert } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import { useAuth } from '../context/AuthContext'
import { changePassword } from '../api'

export default function Profile() {
  const navigate = useNavigate()
  const { user, isAuthenticated, signOut, booting } = useAuth()

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all password fields.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.')
      return
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.')
      return
    }

    try {
      setLoading(true)
      const res = await changePassword({ oldPassword, newPassword, confirmPassword })
      setSuccess(res.message || 'Your password has been successfully updated!')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err.message || 'Failed to update password. Please check your current password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Profile Card Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
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
            className="inline-flex h-10 items-center gap-2 self-start rounded-xl border border-[var(--color-border)] px-4 text-sm font-semibold text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-muted)] cursor-pointer"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </motion.div>

        {/* Activity Box */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05, ease: 'easeOut' }}
          className="mt-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)]/60 p-6"
        >
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
            Account Activity
          </h2>
          <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">
            Liked prompts: {(user.likedPromptIds || []).length}
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            Copying, liking, and bookmarking prompts stay synchronized across all your devices.
          </p>
        </motion.div>

        {/* Security & Password Change Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' }}
          className="mt-8 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs p-6"
        >
          <div className="flex items-center gap-2.5 border-b border-[var(--color-border)] pb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <KeyRound size={16} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--color-text)]">Security & Password</h2>
              <p className="text-xs text-[var(--color-text-muted)]">
                Update your account password using your current password verification.
              </p>
            </div>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs font-medium text-red-500">
              <ShieldAlert size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs font-medium text-emerald-500">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="mt-5 flex flex-col gap-4">
            {/* Old Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--color-text)]">Current Password</label>
              <div className="relative">
                <input
                  type={showOld ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter your current password"
                  required
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3.5 py-2.5 pr-10 text-xs font-medium text-[var(--color-text)] outline-none transition-colors focus:border-accent focus:bg-[var(--color-surface)]"
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 border-none bg-transparent text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)] cursor-pointer"
                >
                  {showOld ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Grid for New & Confirm Passwords */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* New Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[var(--color-text)]">New Password</label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3.5 py-2.5 pr-10 text-xs font-medium text-[var(--color-text)] outline-none transition-colors focus:border-accent focus:bg-[var(--color-surface)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 border-none bg-transparent text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)] cursor-pointer"
                  >
                    {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[var(--color-text)]">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                    minLength={6}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3.5 py-2.5 pr-10 text-xs font-medium text-[var(--color-text)] outline-none transition-colors focus:border-accent focus:bg-[var(--color-surface)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 border-none bg-transparent text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)] cursor-pointer"
                  >
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-accent-hover disabled:opacity-60"
              >
                {loading ? <Loader2 size={15} className="animate-spin" /> : <KeyRound size={15} />}
                <span>{loading ? 'Updating Password…' : 'Update Password'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </PageTransition>
  )
}

