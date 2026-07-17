export function Toggle({ checked, onChange, label, sub }) {
  return (
    <div className="flex items-center justify-between gap-3">
      {(label || sub) && (
        <div>
          {label && <div className="text-[13.5px] font-semibold text-ink">{label}</div>}
          {sub && <div className="mt-0.5 text-xs text-mute-light">{sub}</div>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-[42px] shrink-0 cursor-pointer rounded-full border-none transition-colors duration-[180ms] ${
          checked ? 'bg-orange' : 'bg-[#DDE1E8]'
        }`}
      >
        <span
          className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-[left] duration-[180ms] ${
            checked ? 'left-[21px]' : 'left-[3px]'
          }`}
        />
      </button>
    </div>
  )
}
