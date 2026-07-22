import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signIn, isStaff, booting } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!booting && isStaff) navigate('/', { replace: true })
  }, [booting, isStaff, navigate])

  if (!booting && isStaff) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signIn({ email, password })
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Sign in failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 text-ink">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-[9px] bg-orange">
            <LayoutDashboard size={18} color="#fff" />
          </div>
          <h1 className="m-0 text-xl font-bold tracking-[-0.02em]">Admin sign in</h1>
          <p className="mt-1.5 mb-0 text-[13px] text-mute">
            Sign in with an admin or superadmin account to manage the CMS.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-surface p-5 shadow-[0_1px_2px_rgba(16,24,40,0.03),0_1px_12px_rgba(16,24,40,0.04)] sm:p-6"
        >
          <label className="mb-3.5 block">
            <span className="mb-1.5 block text-[11.5px] font-bold tracking-[0.04em] text-mute-light uppercase">
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="admin@example.com"
              className="h-11 w-full rounded-[10px] border border-border bg-surface-muted px-3.5 text-[13.5px] text-ink outline-none placeholder:text-mute-light focus:border-orange focus:shadow-[0_0_0_3px_var(--color-orange-tint)]"
            />
          </label>

          <label className="mb-3.5 block">
            <span className="mb-1.5 block text-[11.5px] font-bold tracking-[0.04em] text-mute-light uppercase">
              Password
            </span>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="current-password"
                placeholder="Enter your password"
                className="h-11 w-full rounded-[10px] border border-border bg-surface-muted py-0 pr-11 pl-3.5 text-[13.5px] text-ink outline-none placeholder:text-mute-light focus:border-orange focus:shadow-[0_0_0_3px_var(--color-orange-tint)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((open) => !open)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent text-mute hover:text-ink"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          {error && (
            <p className="mb-3.5 rounded-lg bg-[#FEF3F2] px-3 py-2 text-[13px] text-red">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting || booting}
            className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-lg border-none bg-orange text-[13px] font-bold text-white shadow-[0_2px_8px_rgba(255,122,0,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
