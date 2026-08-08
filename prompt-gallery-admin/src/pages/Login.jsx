import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Info,
  KeyRound,
  LayoutDashboard,
  Mail,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { ThemeToggle } from '../components/ThemeToggle'

export default function Login() {
  const { signIn, isStaff, isSuperadmin, booting } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showForgotModal, setShowForgotModal] = useState(false)

  useEffect(() => {
    if (!booting && isStaff) {
      navigate(isSuperadmin ? '/admins' : '/', { replace: true })
    }
  }, [booting, isStaff, isSuperadmin, navigate])

  if (!booting && isStaff) {
    return <Navigate to={isSuperadmin ? '/admins' : '/'} replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const user = await signIn({ email, password })
      const targetPath = user?.role === 'superadmin' ? '/admins' : '/'
      navigate(targetPath, { replace: true })
    } catch (err) {
      setError(err.message || 'Sign in failed. Please check your credentials.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-bg text-ink">
      {/* Left Form Section */}
      <div className="flex w-full flex-col justify-between p-6 sm:p-10 lg:w-1/2 xl:w-[45%]">
        {/* Top Bar with Brand & Theme Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange shadow-[0_2px_10px_rgba(255,122,0,0.3)]">
              <LayoutDashboard size={20} color="#fff" />
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-mute-light">
                CMS Portal
              </span>
              <span className="text-base font-extrabold tracking-tight">Prompt Gallery</span>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Form Container */}
        <div className="mx-auto my-auto w-full max-w-md py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Welcome back!
            </h1>
            <p className="mt-2 text-sm text-mute">
              Enter your admin credentials to manage prompts, categories, and system permissions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-mute-light">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-mute">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="admin@example.com"
                  className="h-12 w-full rounded-xl border border-border bg-surface-muted pl-10 pr-4 text-sm text-ink outline-none transition-all placeholder:text-mute-light focus:border-orange focus:bg-surface focus:ring-4 focus:ring-orange/15"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-mute-light">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-mute">
                  <KeyRound size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  className="h-12 w-full rounded-xl border border-border bg-surface-muted pl-10 pr-11 text-sm text-ink outline-none transition-all placeholder:text-mute-light focus:border-orange focus:bg-surface focus:ring-4 focus:ring-orange/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((open) => !open)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-mute hover:text-ink cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <label className="flex cursor-pointer items-center gap-2 font-medium text-mute hover:text-ink">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-orange focus:ring-orange accent-orange"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="cursor-pointer font-medium text-orange hover:text-orange-dark hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red/20 bg-red/10 p-3 text-xs font-semibold text-red">
                <Info size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || booting}
              className="group relative flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange text-sm font-bold text-white shadow-[0_4px_14px_rgba(255,122,0,0.35)] transition-all hover:bg-orange-dark hover:shadow-[0_6px_20px_rgba(255,122,0,0.45)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Additional Info / Security Footer */}
          <div className="mt-8 border-t border-border/60 pt-6 text-center">
            <p className="text-xs text-mute">
              Protected by Prompt Gallery Access Control Policy.{' '}
              <span className="font-semibold text-ink">Strictly for authorized staff.</span>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-mute-light">
          © {new Date().getFullYear()} Prompt Gallery Admin. All rights reserved.
        </div>
      </div>

      {/* Right Hero / Banner Section with Figma-style Illustration */}
      <div className="relative hidden flex-col items-center justify-center overflow-hidden border-l border-border bg-surface-subtle/50 p-6 lg:flex lg:w-1/2 lg:p-10 xl:w-[55%] dark:bg-surface-muted/30">
        {/* Soft Organic Blob Background */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-96 w-96 rounded-full bg-orange-tint/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-orange-tint/40 blur-3xl" />

        {/* Content Box */}
        <div className="relative z-10 flex w-full max-w-xl flex-col items-center text-center">
          {/* Vector Illustration matching the user's Figma PNG */}
          <div className="relative my-4 flex aspect-[4/3] w-full max-w-md items-center justify-center">
            {/* Organic Soft Backdrop Shape */}
            <div className="absolute inset-0 -rotate-1 transform rounded-3xl bg-[#E8F1FD] transition-all dark:bg-[#1E293B]" />

            {/* SVG Scene */}
            <svg
              viewBox="0 0 500 400"
              className="relative z-10 h-full w-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Floor Shadow Ellipses */}
              <ellipse cx="140" cy="340" rx="35" ry="10" fill="#000" fillOpacity="0.12" />
              <ellipse cx="280" cy="350" rx="70" ry="12" fill="#000" fillOpacity="0.08" />

              {/* Plant Pot on Floor (Left side) */}
              <g id="plant">
                <path d="M120 335 L125 295 L155 295 L160 335 Z" fill="#2B303A" />
                <path d="M115 295 L165 295 L165 290 L115 290 Z" fill="#3D4452" />
                {/* Leaves */}
                <path d="M140 290 C120 270 100 240 120 215 C135 240 140 270 140 290 Z" fill="#153E75" />
                <path
                  d="M140 290 C155 260 175 235 160 210 C145 235 140 270 140 290 Z"
                  fill="#0F2B52"
                />
                <path d="M140 290 C110 280 85 270 100 250 C120 260 135 275 140 290 Z" fill="#1C4B8C" />
              </g>

              {/* Desk with angled legs */}
              <g id="desk">
                {/* Desk Top */}
                <rect
                  x="220"
                  y="240"
                  width="200"
                  height="10"
                  rx="2"
                  fill="#FFFFFF"
                  stroke="#E2E8F0"
                  strokeWidth="2"
                />
                {/* Desk Legs */}
                <line
                  x1="230"
                  y1="250"
                  x2="210"
                  y2="350"
                  stroke="#CBD5E1"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <line
                  x1="410"
                  y1="250"
                  x2="435"
                  y2="350"
                  stroke="#CBD5E1"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </g>

              {/* Coffee Mug on Desk */}
              <g id="coffee">
                <rect x="390" y="222" width="14" height="18" rx="2" fill="#2B303A" />
                <path d="M404 226 C408 226 408 236 404 236" stroke="#2B303A" strokeWidth="2" fill="none" />
                {/* Steam */}
                <path
                  d="M394 216 C396 210 392 206 395 200"
                  stroke="#94A3B8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.6"
                />
                <path
                  d="M399 218 C401 212 397 208 400 202"
                  stroke="#94A3B8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.6"
                />
              </g>

              {/* Chair / Stool */}
              <g id="stool">
                {/* Cushion Seat */}
                <ellipse cx="270" cy="275" rx="30" ry="10" fill="#ff7a00" />
                <path d="M240 275 C240 285 300 285 300 275 Z" fill="#e56a00" />
                {/* Stool Legs */}
                <line x1="250" y1="282" x2="230" y2="340" stroke="#94A3B8" strokeWidth="3" />
                <line x1="290" y1="282" x2="310" y2="340" stroke="#94A3B8" strokeWidth="3" />
                <line x1="270" y1="283" x2="270" y2="345" stroke="#CBD5E1" strokeWidth="2.5" />
              </g>

              {/* Person Working */}
              <g id="person">
                {/* Sneakers */}
                <ellipse cx="305" cy="322" rx="14" ry="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
                <ellipse cx="335" cy="320" rx="14" ry="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />

                {/* Trousers / Legs */}
                <path
                  d="M265 270 L300 318"
                  stroke="#1E293B"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M275 270 L330 316"
                  stroke="#1E293B"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Torso / Jacket */}
                <path d="M255 200 Q270 190 285 205 L275 275 L245 275 Z" fill="#64748B" />
                {/* Inner shirt */}
                <path d="M268 200 L280 205 L272 245 L260 240 Z" fill="#ff7a00" />

                {/* Arms typing on laptop */}
                <path
                  d="M275 205 Q300 230 325 238"
                  stroke="#64748B"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                <path d="M320 235 L335 238" stroke="#FDBA74" strokeWidth="6" strokeLinecap="round" />

                {/* Head & Hair */}
                {/* Neck */}
                <rect x="272" y="180" width="10" height="15" fill="#FDBA74" />
                {/* Face */}
                <circle cx="282" cy="170" r="14" fill="#FDBA74" />
                {/* Curly Hair */}
                <path
                  d="M260 175 C250 140 285 130 292 155 C305 145 305 170 295 180 C285 195 255 190 260 175 Z"
                  fill="#1E293B"
                />
                {/* Glasses */}
                <circle cx="288" cy="168" r="4" fill="none" stroke="#000" strokeWidth="1.5" />
                <line x1="284" y1="168" x2="278" y2="168" stroke="#000" strokeWidth="1.5" />
              </g>

              {/* Laptop */}
              <g id="laptop">
                {/* Laptop Base */}
                <path d="M310 240 L355 240 L350 243 L315 243 Z" fill="#94A3B8" />
                {/* Laptop Screen */}
                <path
                  d="M330 240 L355 210 L335 208 L315 238 Z"
                  fill="#FFFFFF"
                  stroke="#CBD5E1"
                  strokeWidth="1.5"
                />
              </g>

              {/* Floating Password / Security Speech Bubble */}
              <g id="security-bubble">
                {/* Bubble Shape */}
                <rect x="300" y="130" width="100" height="42" rx="10" fill="#0F294A" />
                <polygon points="315,172 325,172 312,182" fill="#0F294A" />

                {/* Lock Icon inside bubble */}
                <rect x="312" y="146" width="14" height="12" rx="2" fill="#FFFFFF" />
                <path
                  d="M315 146 V142 C315 139 323 139 323 142 V146"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
                <circle cx="319" cy="151" r="1.5" fill="#0F294A" />

                {/* Passcode dots */}
                <circle cx="340" cy="151" r="3" fill="#FFFFFF" />
                <circle cx="354" cy="151" r="3" fill="#FFFFFF" />
                <circle cx="368" cy="151" r="3" fill="#FFFFFF" />
                <circle cx="382" cy="151" r="3" fill="#FFFFFF" />
              </g>
            </svg>
          </div>

          {/* Caption & Feature highlights */}
          <div className="mt-4 max-w-sm space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-ink">
              Prompt Gallery Control Center
            </h2>
            <p className="text-xs leading-relaxed text-mute">
              Manage system prompts, organize categories, and configure role-based access controls with
              real-time sync.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1 text-[11px] font-semibold text-mute shadow-xs">
                <CheckCircle2 size={13} className="text-green" /> Prompt CMS
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1 text-[11px] font-semibold text-mute shadow-xs">
                <ShieldCheck size={13} className="text-orange" /> Role Access
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1 text-[11px] font-semibold text-mute shadow-xs">
                <Sparkles size={13} className="text-orange" /> AI Ready
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="animate-slide-in w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-2xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-tint text-orange-dark">
              <ShieldCheck size={24} />
            </div>
            <h3 className="mb-2 text-center text-lg font-bold text-ink">
              Reset Super Admin Password
            </h3>
            <p className="mb-6 text-center text-xs leading-relaxed text-mute">
              For security compliance, admin passwords cannot be self-reset online. Please contact your
              Lead Administrator or System Owner to reset access credentials.
            </p>
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="w-full cursor-pointer rounded-xl bg-orange py-2.5 text-xs font-bold text-white transition-colors hover:bg-orange-dark"
            >
              Got it, close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

