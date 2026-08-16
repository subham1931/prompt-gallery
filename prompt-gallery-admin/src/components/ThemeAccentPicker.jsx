import { useEffect, useRef, useState } from 'react'
import { Palette, Check } from 'lucide-react'
import { getThemeAccent, updateThemeAccent } from '../api/client'
import { useAuth } from '../context/AuthContext'

const ACCENTS = [
  { id: 'orange', label: 'Warm Orange', color: '#f97316', previewBg: '#f97316' },
  { id: 'green', label: 'Lime Green (#ECFFE0)', color: '#22c55e', previewBg: '#22c55e' },
  { id: 'blue', label: 'Electric Blue', color: '#3b82f6', previewBg: '#3b82f6' },
  { id: 'purple', label: 'Vibrant Purple', color: '#8b5cf6', previewBg: '#8b5cf6' },
]

export function ThemeAccentPicker() {
  const { user } = useAuth()
  const [activeAccent, setActiveAccent] = useState(() => {
    return localStorage.getItem('pg_theme_accent') || 'orange'
  })
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const cached = localStorage.getItem('pg_theme_accent') || 'orange'
    document.documentElement.setAttribute('data-accent', cached)
    setActiveAccent(cached)

    getThemeAccent().then((accent) => {
      if (accent) {
        document.documentElement.setAttribute('data-accent', accent)
        localStorage.setItem('pg_theme_accent', accent)
        setActiveAccent(accent)
      }
    })
  }, [])

  useEffect(() => {
    const onPointerDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  const handleSelect = async (accentId) => {
    setActiveAccent(accentId)
    document.documentElement.setAttribute('data-accent', accentId)
    localStorage.setItem('pg_theme_accent', accentId)

    if (user && (user.role === 'admin' || user.role === 'superadmin')) {
      try {
        setSaving(true)
        await updateThemeAccent(accentId)
      } catch (err) {
        console.warn('Failed to update server theme accent:', err)
      } finally {
        setSaving(false)
      }
    }
    setOpen(false)
  }

  const currentOption = ACCENTS.find((a) => a.id === activeAccent) || ACCENTS[0]

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Theme Accent Color"
        title={`Accent: ${currentOption.label}`}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 text-[12px] font-bold text-ink hover:bg-surface-muted transition-colors cursor-pointer"
      >
        <span
          className="h-3.5 w-3.5 rounded-full border border-black/10 shadow-xs"
          style={{ backgroundColor: currentOption.previewBg }}
        />
        <Palette size={14} className="text-mute" />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-[210px] rounded-xl border border-border bg-surface p-2 shadow-[0_10px_30px_rgba(0,0,0,0.15)] animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-2 py-1 mb-1 border-b border-border">
            <span className="text-[10px] font-bold uppercase tracking-wider text-mute">
              Site Secondary Accent
            </span>
          </div>

          <div className="space-y-1">
            {ACCENTS.map((accent) => {
              const isSelected = activeAccent === accent.id
              return (
                <button
                  key={accent.id}
                  type="button"
                  onClick={() => handleSelect(accent.id)}
                  disabled={saving}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-[12px] font-bold transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-surface-muted text-ink border border-border'
                      : 'text-mute hover:bg-surface-muted hover:text-ink border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: accent.previewBg }}
                    />
                    <span>{accent.label}</span>
                  </div>
                  {isSelected && <Check size={14} className="text-orange" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
