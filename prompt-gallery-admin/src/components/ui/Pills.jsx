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
            className={`cursor-pointer rounded-[9px] border px-[15px] py-2 text-[13px] font-semibold transition-all duration-150 ${
              active
                ? 'border-orange bg-orange-tint text-orange-dark shadow-xs'
                : 'border-border bg-surface text-mute hover:border-border/80'
            }`}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}
