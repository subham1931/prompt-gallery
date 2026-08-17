const tones = {
  default: 'border border-zinc-800 bg-zinc-800/70 text-zinc-300',
  orange: 'border border-amber-500/20 bg-amber-500/10 text-amber-400',
  green: 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
}

export function Badge({ children, tone = 'default' }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium tracking-tight ${tones[tone] || tones.default}`}
    >
      {children}
    </span>
  )
}
