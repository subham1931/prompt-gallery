import { useState } from 'react'

const base =
  'w-full rounded-[10px] border border-border bg-[#FCFCFD] px-[13px] py-2.5 text-[13.5px] text-ink outline-none transition-[border-color,box-shadow,background] duration-150'

const focus =
  'border-orange bg-white shadow-[0_0_0_3px_var(--color-orange-tint)]'

export function TextInput({ className = '', onFocus, onBlur, ...props }) {
  const [focused, setFocused] = useState(false)

  return (
    <input
      {...props}
      onFocus={(e) => {
        setFocused(true)
        onFocus?.(e)
      }}
      onBlur={(e) => {
        setFocused(false)
        onBlur?.(e)
      }}
      className={`${base} ${focused ? focus : ''} ${className}`}
    />
  )
}

export function TextArea({ className = '', onFocus, onBlur, ...props }) {
  const [focused, setFocused] = useState(false)

  return (
    <textarea
      {...props}
      onFocus={(e) => {
        setFocused(true)
        onFocus?.(e)
      }}
      onBlur={(e) => {
        setFocused(false)
        onBlur?.(e)
      }}
      className={`${base} resize-y leading-relaxed ${focused ? focus : ''} ${className}`}
    />
  )
}
