export function Pills({ value, onChange, options, multiple = false }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isArray = Array.isArray(value)
        const active = isArray
          ? value.includes(opt)
          : multiple && typeof value === 'string'
            ? value.split(',').map((s) => s.trim()).includes(opt)
            : value === opt

        const handleClick = () => {
          if (!multiple) {
            onChange(opt)
            return
          }

          if (isArray) {
            if (value.includes(opt)) {
              if (value.length > 1) onChange(value.filter((v) => v !== opt))
            } else {
              onChange([...value, opt])
            }
          } else if (typeof value === 'string') {
            const current = value
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
            let updated
            if (current.includes(opt)) {
              if (current.length > 1) updated = current.filter((v) => v !== opt)
              else updated = current
            } else {
              updated = [...current, opt]
            }
            onChange(updated.join(', '))
          }
        }

        return (
          <button
            key={opt}
            type="button"
            onClick={handleClick}
            className={
              'cursor-pointer rounded-md border px-3.5 py-1.5 text-xs font-medium transition-colors ' +
              (active
                ? 'border-zinc-700 bg-zinc-800 text-zinc-50 shadow-xs'
                : 'border-zinc-800/80 bg-zinc-950/60 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200')
            }
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}
