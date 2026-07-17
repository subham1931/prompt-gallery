import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export function Card({
  title,
  description,
  children,
  defaultOpen = true,
  collapsible = true,
  right = null,
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className="rounded-xl border border-border bg-white">
      <div
        role={collapsible ? 'button' : undefined}
        tabIndex={collapsible ? 0 : undefined}
        onClick={() => collapsible && setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (collapsible && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            setOpen((o) => !o)
          }
        }}
        className={`flex items-start justify-between gap-3 px-5 py-4 select-none ${
          collapsible ? 'cursor-pointer' : 'cursor-default'
        }`}
      >
        <div className="min-w-0">
          <h3 className="m-0 text-[13px] font-semibold tracking-[-0.01em] text-ink">{title}</h3>
          {description && (
            <p className="mt-0.5 mb-0 text-[12px] leading-snug text-mute-light">{description}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {right}
          {collapsible && (
            <ChevronDown
              size={16}
              className={`text-mute-light transition-transform duration-150 ${
                open ? 'rotate-0' : '-rotate-90'
              }`}
            />
          )}
        </div>
      </div>
      {open && (
        <div className="border-t border-border px-5 pt-4 pb-5">{children}</div>
      )}
    </section>
  )
}
