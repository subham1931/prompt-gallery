import { useState } from 'react'

const base =
  'w-full rounded-[10px] border bg-surface-muted px-[13px] py-2.5 text-[13.5px] text-ink outline-none transition-[border-color,box-shadow,background] duration-150'

const focusOk =
  'border-orange bg-surface shadow-[0_0_0_3px_var(--color-orange-tint)]'

const errorCls =
  'border-red bg-[#FFF8F8] shadow-[0_0_0_3px_rgba(211,59,59,0.12)] dark:bg-[#2a1515]'

export function TextInput({ className = '', error = false, onFocus, onBlur, ...props }) {
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
      className={`${base} ${
        error ? errorCls : focused ? focusOk : 'border-border'
      } ${className}`}
      aria-invalid={error || undefined}
    />
  )
}

export function TextArea({ className = '', error = false, onFocus, onBlur, ...props }) {
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
      className={`${base} resize-y leading-relaxed ${
        error ? errorCls : focused ? focusOk : 'border-border'
      } ${className}`}
      aria-invalid={error || undefined}
    />
  )
}
