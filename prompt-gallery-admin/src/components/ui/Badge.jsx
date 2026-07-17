const tones = {
  default: 'bg-[#F1F2F5] text-mute',
  orange: 'bg-orange-tint text-orange-dark',
  green: 'bg-green-tint text-green',
}

export function Badge({ children, tone = 'default' }) {
  return (
    <span
      className={`rounded-[7px] px-[9px] py-[3px] text-[11.5px] font-bold tracking-[0.02em] ${tones[tone]}`}
    >
      {children}
    </span>
  )
}
