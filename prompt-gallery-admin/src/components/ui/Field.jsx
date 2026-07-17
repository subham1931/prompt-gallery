export function Field({ label, hint, required, children, counter, className = '' }) {
  return (
    <div className={`mb-4 last:mb-0 ${className}`}>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label className="text-[12px] font-semibold text-ink">
          {label} {required && <span className="text-orange">*</span>}
        </label>
        {counter && (
          <span className="text-[11px] font-medium text-mute-light">{counter}</span>
        )}
      </div>
      {children}
      {hint && <p className="mt-1 mb-0 text-[11px] text-mute-light">{hint}</p>}
    </div>
  )
}
