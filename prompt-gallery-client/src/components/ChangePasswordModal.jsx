import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound, Loader2, ShieldAlert, ShieldCheck, X } from 'lucide-react'
import { changePassword, verifyPassword } from '../api'

export default function ChangePasswordModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1)

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const dialogRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const onPointerDown = (e) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target)) {
        handleClose()
      }
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  const handleClose = () => {
    setStep(1)
    setOldPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setError('')
    setSuccess('')
    onClose()
  }

  // Step 1: Verify Current Password
  const handleVerifyStep = async (e) => {
    e.preventDefault()
    setError('')

    if (!oldPassword.trim()) {
      setError('Please enter your current password.')
      return
    }

    try {
      setLoading(true)
      await verifyPassword(oldPassword)
      setStep(2)
      setError('')
    } catch (err) {
      setError(err.message || 'Incorrect current password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Update Password
  const handleUpdateStep = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!newPassword || !confirmPassword) {
      setError('Please enter and confirm your new password.')
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
      setTimeout(() => {
        handleClose()
      }, 1500)
    } catch (err) {
      setError(err.message || 'Failed to update password. Please check your inputs.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div
        ref={dialogRef}
        className="w-full max-w-md overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
              {step === 1 ? <ShieldCheck size={16} /> : <KeyRound size={16} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="m-0 text-sm font-bold text-[var(--color-text)]">
                  {step === 1 ? 'Verify Current Password' : 'Set New Password'}
                </h3>
                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent">
                  Step {step} of 2
                </span>
              </div>
              <p className="m-0 text-[11px] text-[var(--color-text-muted)]">
                {step === 1
                  ? 'Verify your identity before changing your password'
                  : 'Enter your new account password'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
          >
            <X size={15} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs font-medium text-red-500">
              <ShieldAlert size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs font-medium text-emerald-500">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* STEP 1 FORM */}
          {step === 1 && (
            <form onSubmit={handleVerifyStep} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[var(--color-text)]">Current Password</label>
                <div className="relative">
                  <input
                    type={showOld ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    required
                    autoFocus
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3.5 py-2.5 pr-10 text-xs font-medium text-[var(--color-text)] outline-none transition-colors focus:border-accent focus:bg-[var(--color-surface)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld(!showOld)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 border-none bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-pointer"
                  >
                    {showOld ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-end gap-3 border-t border-[var(--color-border)] pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-2.5 text-xs font-semibold text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-text)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-accent px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-accent-hover disabled:opacity-60"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                  <span>{loading ? 'Verifying…' : 'Verify & Continue'}</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 2 FORM */}
          {step === 2 && (
            <form onSubmit={handleUpdateStep} className="flex flex-col gap-4">
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
                    autoFocus
                    minLength={6}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3.5 py-2.5 pr-10 text-xs font-medium text-[var(--color-text)] outline-none transition-colors focus:border-accent focus:bg-[var(--color-surface)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 border-none bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-pointer"
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 border-none bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-pointer"
                  >
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Step 2 Footer */}
              <div className="mt-2 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1)
                    setError('')
                  }}
                  className="inline-flex items-center gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3.5 py-2.5 text-xs font-semibold text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-text)] cursor-pointer"
                >
                  <ArrowLeft size={13} />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-accent px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-accent-hover disabled:opacity-60"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} />}
                  <span>{loading ? 'Updating…' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
