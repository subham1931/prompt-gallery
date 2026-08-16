import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Sparkles, Eye, EyeOff } from 'lucide-react'
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
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-lg">
              <Sparkles size={22} className="text-orange-500 dark:text-orange-500 animate-pulse" />
            </div>
            <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
              {isSignup ? 'Create Account' : 'Access Prompt Gallery'}
            </h1>
            <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              {isSignup
                ? 'Sign up to bookmark and like studio prompts.'
                : 'Sign in to access your curated prompt gallery.'}
            </p>
          </div>

          <div className="glass-card rounded-3xl border border-white/80 dark:border-slate-800 p-6 sm:p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {isSignup && (
                <label className="block">
                  <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Full Name
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                    placeholder="Enter your name"
                    className="glass-input h-11 w-full rounded-2xl py-0 px-4 text-xs font-semibold"
                  />
                </label>
              )}

              <label className="block">
                <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Email Address
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="name@company.com"
                  className="glass-input h-11 w-full rounded-2xl py-0 px-4 text-xs font-semibold"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-slate-400">
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
                    className="glass-input h-11 w-full rounded-2xl py-0 pl-4 pr-11 text-xs font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((open) => !open)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>

              {error && (
                <p className="rounded-xl bg-rose-500/10 p-3 text-xs font-bold text-rose-600 dark:text-rose-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-slate-900 px-6 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg hover:bg-slate-800 dark:bg-orange-500 dark:text-white dark:hover:bg-orange-600 transition-all hover:-translate-y-0.5 disabled:opacity-60 cursor-pointer"
              >
                {submitting ? 'Authenticating...' : isSignup ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <p className="mt-6 text-center text-xs font-semibold text-slate-400">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <Link
                to={`${switchTo}${switchSearch}`}
                className="font-extrabold text-orange-500 dark:text-orange-400 hover:underline"
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
