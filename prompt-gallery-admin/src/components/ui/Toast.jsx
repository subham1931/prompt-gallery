import { Check } from 'lucide-react'

export function Toast({ toasts }) {
  return (
    <div className="fixed right-[22px] bottom-[22px] z-100 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-slide-in flex min-w-[200px] items-center gap-2 rounded-[11px] bg-ink px-4 py-[11px] text-[13px] font-medium text-white shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
        >
          <Check size={15} className="text-orange" />
          {t.msg}
        </div>
      ))}
    </div>
  )
}
