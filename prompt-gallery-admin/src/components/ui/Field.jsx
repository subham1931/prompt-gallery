export function Field({ label, required, hint, counter, error, children }) {
  return (
    <div className="flex flex-col">
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
        {counter && <span className="text-[11px] font-mono text-zinc-500">{counter}</span>}
      </div>
      <div>{children}</div>
      {hint && !error && <p className="mt-1.5 text-[11px] leading-normal text-zinc-400">{hint}</p>}
      {error && <p className="mt-1.5 text-[11px] font-semibold text-red-400">{error}</p>}
    </div>
  )
}
