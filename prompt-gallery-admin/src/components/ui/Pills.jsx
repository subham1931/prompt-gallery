export function Pills({ value, onChange, options }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`cursor-pointer rounded-[9px] border px-[15px] py-2 text-[13px] font-semibold transition-all duration-150 ${
              active
                ? 'border-orange bg-orange-tint text-orange-dark'
                : 'border-border bg-white text-mute'
            }`}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}
