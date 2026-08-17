import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export function Toast({ toasts = [], onDismiss }) {
  if (!toasts || !toasts.length) return null

  return (
    <div
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-50 flex max-w-sm w-full flex-col gap-2.5 pointer-events-none"
    >
      {toasts.map((t) => {
        const isError = t.type === 'error' || t.variant === 'destructive'
        const isInfo = t.type === 'info'

        return (
          <div
            key={t.id}
            className={
              'pointer-events-auto group relative flex w-full items-start gap-3 rounded-lg border p-3.5 shadow-2xl transition-all duration-300 animate-in fade-in-0 slide-in-from-bottom-5 ' +
              (isError
                ? 'border-red-900/60 bg-red-950/95 text-red-200'
                : 'border-zinc-800 bg-zinc-900/95 text-zinc-100 backdrop-blur-md')
            }
          >
            <div className="shrink-0 pt-0.5">
              {isError ? (
                <AlertCircle className="h-4 w-4 text-red-400" />
              ) : isInfo ? (
                <Info className="h-4 w-4 text-blue-400" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              )}
            </div>

            <div className="flex-1 space-y-0.5">
              {t.title && <h5 className="text-xs font-semibold tracking-tight text-zinc-50">{t.title}</h5>}
              <p className="text-xs leading-relaxed text-zinc-300">{t.msg || t.description || t.message}</p>
            </div>

            {onDismiss && (
              <button
                type="button"
                onClick={() => onDismiss(t.id)}
                className="shrink-0 rounded-md p-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors cursor-pointer border-none"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
