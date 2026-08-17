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
    <section className="rounded-lg border border-zinc-800 bg-zinc-900 shadow-none overflow-hidden">
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
        className={'flex items-start justify-between gap-3 px-5 py-4 select-none ' + (collapsible ? 'cursor-pointer' : 'cursor-default')}
      >
        <div className="min-w-0">
          <h3 className="m-0 text-sm font-semibold tracking-tight text-zinc-50">{title}</h3>
          {description && (
            <p className="mt-0.5 mb-0 text-xs text-zinc-400 leading-normal">{description}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {right}
          {collapsible && (
            <ChevronDown
              size={16}
              className={'text-zinc-400 transition-transform duration-150 ' + (open ? 'rotate-0' : '-rotate-90')}
            />
          )}
        </div>
      </div>
      {open && (
        <div className="border-t border-zinc-800 px-5 pt-4 pb-5">{children}</div>
      )}
    </section>
  )
}
