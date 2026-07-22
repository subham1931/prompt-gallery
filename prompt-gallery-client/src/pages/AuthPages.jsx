import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Aperture, Eye, EyeOff } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import { useAuth } from '../context/AuthContext'

function AuthForm({ mode }) {
  const isSignup = mode === 'signup'
  const { signIn, signUp, isAuthenticated, booting } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const nextPath = searchParams.get('next') || '/'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!booting && isAuthenticated) {
      navigate(nextPath.startsWith('/') ? nextPath : '/', { replace: true })
    }
  }, [booting, isAuthenticated, navigate, nextPath])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (isSignup) {
        await signUp({ name, email, password }, nextPath)
      } else {
        await signIn({ email, password }, nextPath)
      }
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const switchTo = isSignup ? '/signin' : '/signup'
  const switchSearch = searchParams.get('next')
    ? `?next=${encodeURIComponent(searchParams.get('next'))}`
    : ''

  return (
    <PageTransition>
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-text)] text-accent">
              <Aperture size={22} strokeWidth={2} />
            </div>
            <h1 className="font-display text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
              {isSignup ? 'Create account' : 'Sign in'}
            </h1>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              {isSignup
                ? 'Sign up to copy, like, and share prompts.'
                : 'Sign in to copy, like, and share prompts.'}
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm sm:p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              {isSignup && (
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                    Name
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                    placeholder="Your name"
                    className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3.5 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </label>
              )}

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                  Email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3.5 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                  Password
                </span>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete={isSignup ? 'new-password' : 'current-password'}
                    placeholder={isSignup ? 'At least 6 characters' : 'Enter your password'}
                    className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] py-0 pr-11 pl-3.5 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((open) => !open)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>

              {error && (
                <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-1 inline-flex h-11 items-center justify-center rounded-xl bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Please wait…' : isSignup ? 'Create account' : 'Sign in'}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-[var(--color-text-muted)]">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <Link
                to={`${switchTo}${switchSearch}`}
                className="font-semibold text-accent hover:underline"
              >
                {isSignup ? 'Sign in' : 'Sign up'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export function SignIn() {
  return <AuthForm mode="signin" />
}

export function SignUp() {
  return <AuthForm mode="signup" />
}
