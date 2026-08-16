import { useEffect, useRef, useState } from 'react'
import { Eye, EyeOff, Sparkles, X, Loader2, ShieldAlert } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function AuthModal({ isOpen, onClose, mode: initialMode = 'signin' }) {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState(initialMode)
  const isSignup = mode === 'signup'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const modalRef = useRef(null)

  useEffect(() => {
    setMode(initialMode)
  }, [initialMode])

  useEffect(() => {
    if (!isOpen) return
    setError('')
    setName('')
    setEmail('')
    setPassword('')

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    const handlePointerDown = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (isSignup) {
        if (!name.trim()) throw new Error('Please enter your full name')
        await signUp({ name: name.trim(), email: email.trim(), password })
      } else {
        await signIn({ email: email.trim(), password })
      }
      onClose()
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const toggleMode = () => {
    setError('')
    setMode(isSignup ? 'signin' : 'signup')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 dark:border-slate-800 bg-[#090d16]/95 text-white shadow-2xl p-6 sm:p-8 relative scrollbar-hide"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white shadow-inner">
            <Sparkles size={20} className="text-orange-400 animate-pulse" />
          </div>
          <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="mt-1.5 text-xs font-semibold text-slate-400">
            {isSignup
              ? 'Sign up to like, bookmark, and save AI prompts'
              : 'Sign in to access your curated prompt collection'}
          </p>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isSignup && (
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Full Name
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
                placeholder="Enter your name"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold text-white placeholder:text-slate-500 outline-none focus:border-orange-500 focus:bg-white/10 transition-colors"
              />
            </label>
          )}

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Email Address
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus={!isSignup}
              placeholder="name@company.com"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold text-white placeholder:text-slate-500 outline-none focus:border-orange-500 focus:bg-white/10 transition-colors"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Password
            </span>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder={isSignup ? 'At least 6 characters' : 'Enter your password'}
                className="w-full rounded-2xl border border-white/10 bg-white/5 pl-4 pr-11 py-3 text-xs font-semibold text-white placeholder:text-slate-500 outline-none focus:border-orange-500 focus:bg-white/10 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((open) => !open)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          {error && (
            <div className="flex items-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-semibold text-rose-400">
              <ShieldAlert size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-6 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 transition-all hover:-translate-y-0.5 disabled:opacity-60 cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>{isSignup ? 'Create Account' : 'Sign In'}</span>
            )}
          </button>
        </form>

        {/* Footer Toggle */}
        <p className="mt-6 text-center text-xs font-semibold text-slate-400">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={toggleMode}
            className="font-extrabold text-orange-400 hover:underline cursor-pointer border-none bg-transparent"
          >
            {isSignup ? 'Sign in' : 'Create account'}
          </button>
        </p>
      </div>
    </div>
  )
}
