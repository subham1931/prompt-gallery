import { useState } from 'react'

const base =
  'w-full rounded-md border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs font-mono text-zinc-100 placeholder:text-zinc-500 outline-none transition-colors duration-150'

const focusOk =
  'border-zinc-600 bg-zinc-950 ring-1 ring-zinc-600'

const errorCls =
  'border-red-900 bg-red-950/30 text-red-200 ring-1 ring-red-900'

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
        error ? errorCls : focused ? focusOk : 'border-zinc-800'
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
        error ? errorCls : focused ? focusOk : 'border-zinc-800'
      } ${className}`}
      aria-invalid={error || undefined}
    />
  )
}
