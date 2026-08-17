import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export function Select({ value, onChange, options = [], placeholder = 'Select an option...', className = '' }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'object' && opt !== null) {
      return { label: opt.label, value: opt.value }
    }
    return { label: String(opt), value: String(opt) }
  })

  const selectedOpt = normalizedOptions.find((o) => o.value === value) || normalizedOptions[0]

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleSelect = (val) => {
    onChange(val)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className={'relative inline-block w-full ' + className}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex h-9 w-full items-center justify-between rounded-md border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs font-medium text-zinc-100 shadow-xs outline-none hover:border-zinc-700 focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors cursor-pointer"
      >
        <span className="truncate">{selectedOpt ? selectedOpt.label : placeholder}</span>
        <ChevronDown
          size={14}
          className={'shrink-0 text-zinc-400 transition-transform duration-200 ' + (open ? 'rotate-180 text-zinc-100' : '')}
        />
      </button>

      {open && (
        <div style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} className="absolute left-0 top-[calc(100%+6px)] z-50 max-h-60 min-w-full w-max overflow-y-auto rounded-md border border-zinc-800 bg-zinc-900 p-1 text-zinc-100 shadow-xl backdrop-blur-md animate-in fade-in-0 zoom-in-95 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]">
          {normalizedOptions.map((opt) => {
            const isSelected = opt.value === value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={
                  'relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-8 pr-3 text-xs outline-none transition-colors ' +
                  (isSelected
                    ? 'bg-zinc-800/90 font-semibold text-zinc-50'
                    : 'text-zinc-300 hover:bg-zinc-800/60 hover:text-zinc-50')
                }
              >
                {isSelected && (
                  <span className="absolute left-2.5 flex h-3.5 w-3.5 items-center justify-center text-emerald-400">
                    <Check size={13} />
                  </span>
                )}
                <span className="whitespace-nowrap">{opt.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
