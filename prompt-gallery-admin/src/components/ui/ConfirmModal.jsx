import { useEffect } from 'react'
import { AlertTriangle, Loader2, X } from 'lucide-react'

export function ConfirmModal({
  open,
  title = 'Are you sure?',
  description,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  loading = false,
  onConfirm,
  onCancel,
  tone = 'danger',
}) {
  useEffect(() => {
    if (!open) return undefined

    const onKey = (e) => {
      if (e.key === 'Escape' && !loading) onCancel?.()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, loading, onCancel])

  if (!open) return null

  const confirmCls =
    tone === 'danger'
      ? 'bg-red hover:opacity-90'
      : 'bg-orange hover:bg-orange-dark'

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        disabled={loading}
        onClick={onCancel}
        className="absolute inset-0 border-none bg-black/45 backdrop-blur-[2px]"
      />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-desc"
        className="relative w-full max-w-[420px] rounded-2xl border border-border bg-surface p-5 shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
      >
        <button
          type="button"
          disabled={loading}
          onClick={onCancel}
          className="absolute top-3.5 right-3.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent text-mute-light transition-colors hover:bg-surface-subtle hover:text-ink disabled:opacity-50"
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-3 pr-6">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              tone === 'danger' ? 'bg-[#FEECEC] text-red dark:bg-[#3a1818]' : 'bg-orange-tint text-orange-dark'
            }`}
          >
            <AlertTriangle size={18} />
          </div>
          <div className="min-w-0">
            <h2
              id="confirm-modal-title"
              className="m-0 text-[15px] font-semibold tracking-[-0.01em] text-ink"
            >
              {title}
            </h2>
            {description && (
              <p
                id="confirm-modal-desc"
                className="mt-1.5 mb-0 text-[13px] leading-relaxed text-mute"
              >
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="cursor-pointer rounded-lg border border-border bg-surface px-3.5 py-2 text-[13px] font-medium text-mute transition-colors hover:bg-surface-subtle hover:text-ink disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border-none px-3.5 py-2 text-[13px] font-semibold text-white transition-opacity disabled:cursor-wait disabled:opacity-70 ${confirmCls}`}
          >
            {loading ? <Loader2 size={14} className="animate-spin-slow" /> : null}
            {loading ? 'Deleting…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
