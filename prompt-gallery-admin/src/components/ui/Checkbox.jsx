import { Check } from 'lucide-react'

export function Checkbox({ checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center gap-[9px] text-[13.5px] font-medium text-ink">
      <span
        onClick={(e) => {
          e.preventDefault()
          onChange(!checked)
        }}
        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md ${
          checked ? 'border-none bg-orange' : 'border-[1.5px] border-border bg-surface'
        }`}
      >
        {checked && <Check size={12} color="#fff" strokeWidth={3} />}
      </span>
      {label}
    </label>
  )
}
