import { AlertCircle, Check } from 'lucide-react'

export function Toast({ toasts }) {
  return (
    <div className="fixed right-[22px] bottom-[22px] z-100 flex flex-col gap-2">
      {toasts.map((t) => {
        const isError = t.type === 'error'
        return (
          <div
            key={t.id}
            className={`animate-slide-in flex min-w-[200px] max-w-[360px] items-center gap-2 rounded-[11px] px-4 py-[11px] text-[13px] font-medium text-white shadow-[0_8px_24px_rgba(0,0,0,0.28)] ${
              isError ? 'bg-[#B42318]' : 'bg-[#15171C]'
            }`}
          >
            {isError ? (
              <AlertCircle size={15} className="shrink-0 text-white" />
            ) : (
              <Check size={15} className="shrink-0 text-[#FF7A00]" />
            )}
            <span className="text-white">{t.msg}</span>
          </div>
        )
      })}
    </div>
  )
}
