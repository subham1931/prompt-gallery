import { useEffect, useRef, useState } from 'react'
import { Calendar as CalendarIcon, Clock, Sparkles } from 'lucide-react'
import { ShadcnCalendar } from './ShadcnCalendar'

function parseIsoString(value) {
  if (!value) return null
  const d = new Date(value)
  return isNaN(d.getTime()) ? null : d
}

function formatIsoToLocal(value) {
  const d = parseIsoString(value)
  if (!d) return { dateObj: new Date(), hour12: 9, minute: 0, period: 'AM' }

  let h = d.getHours()
  const period = h >= 12 ? 'PM' : 'AM'
  h = h % 12
  if (h === 0) h = 12

  return {
    dateObj: d,
    hour12: h,
    minute: Math.floor(d.getMinutes() / 5) * 5,
    period,
  }
}

function buildIsoString(dateObj, hour12, minute, period) {
  if (!dateObj) return ''
  let h24 = parseInt(hour12, 10) || 12
  if (period === 'PM' && h24 < 12) h24 += 12
  if (period === 'AM' && h24 === 12) h24 = 0

  const y = dateObj.getFullYear()
  const m = dateObj.getMonth()
  const d = dateObj.getDate()

  const localDate = new Date(y, m, d, h24, parseInt(minute, 10) || 0, 0)
  return localDate.toISOString()
}

function formatReadableSchedule(value) {
  if (!value) return null
  const d = parseIsoString(value)
  if (!d) return null

  return d.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function DateTimePicker({ value, onChange, error }) {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const containerRef = useRef(null)

  const parsed = formatIsoToLocal(value)
  const [selectedDate, setSelectedDate] = useState(parsed.dateObj)
  const [hour12, setHour12] = useState(parsed.hour12)
  const [minute, setMinute] = useState(parsed.minute)
  const [period, setPeriod] = useState(parsed.period)

  useEffect(() => {
    const updated = formatIsoToLocal(value)
    setSelectedDate(updated.dateObj)
    setHour12(updated.hour12)
    setMinute(updated.minute)
    setPeriod(updated.period)
  }, [value])

  useEffect(() => {
    const onPointerDown = (e) => {
      if (!containerRef.current?.contains(e.target)) setPopoverOpen(false)
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setPopoverOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  const updateStateAndEmit = (newDate, newHour, newMinute, newPeriod) => {
    setSelectedDate(newDate)
    setHour12(newHour)
    setMinute(newMinute)
    setPeriod(newPeriod)
    const iso = buildIsoString(newDate, newHour, newMinute, newPeriod)
    onChange(iso)
  }

  const handleDateSelect = (dateObj) => {
    updateStateAndEmit(dateObj, hour12, minute, period)
  }

  const handleHourChange = (h) => {
    updateStateAndEmit(selectedDate, h, minute, period)
  }

  const handleMinuteChange = (m) => {
    updateStateAndEmit(selectedDate, hour12, m, period)
  }

  const handlePeriodChange = (p) => {
    updateStateAndEmit(selectedDate, hour12, minute, p)
  }

  const applyPreset = (presetType) => {
    const now = new Date()
    if (presetType === '1h') {
      now.setHours(now.getHours() + 1)
    } else if (presetType === 'tomorrow_9am') {
      now.setDate(now.getDate() + 1)
      now.setHours(9, 0, 0, 0)
    } else if (presetType === 'tomorrow_6pm') {
      now.setDate(now.getDate() + 1)
      now.setHours(18, 0, 0, 0)
    } else if (presetType === '3days') {
      now.setDate(now.getDate() + 3)
      now.setHours(9, 0, 0, 0)
    }

    let h = now.getHours()
    const p = h >= 12 ? 'PM' : 'AM'
    h = h % 12
    if (h === 0) h = 12

    updateStateAndEmit(now, h, Math.floor(now.getMinutes() / 5) * 5, p)
  }

  const readable = formatReadableSchedule(value)

  return (
    <div className="relative flex flex-col gap-3" ref={containerRef}>
      {/* Trigger Button & Quick Presets Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-mute-light">
            <Clock size={13} className="text-purple-400" /> Publish Date & Time
          </label>
          <span className="text-[11px] font-semibold text-mute">Presets</span>
        </div>

        {/* Quick Preset Buttons */}
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => applyPreset('1h')}
            className="cursor-pointer rounded-lg border border-border bg-surface px-2.5 py-1 text-[11.5px] font-semibold text-mute transition-colors hover:border-orange/40 hover:bg-orange-tint hover:text-orange-dark"
          >
            +1 Hour
          </button>
          <button
            type="button"
            onClick={() => applyPreset('tomorrow_9am')}
            className="cursor-pointer rounded-lg border border-border bg-surface px-2.5 py-1 text-[11.5px] font-semibold text-mute transition-colors hover:border-orange/40 hover:bg-orange-tint hover:text-orange-dark"
          >
            Tomorrow 9 AM
          </button>
          <button
            type="button"
            onClick={() => applyPreset('tomorrow_6pm')}
            className="cursor-pointer rounded-lg border border-border bg-surface px-2.5 py-1 text-[11.5px] font-semibold text-mute transition-colors hover:border-orange/40 hover:bg-orange-tint hover:text-orange-dark"
          >
            Tomorrow 6 PM
          </button>
          <button
            type="button"
            onClick={() => applyPreset('3days')}
            className="cursor-pointer rounded-lg border border-border bg-surface px-2.5 py-1 text-[11.5px] font-semibold text-mute transition-colors hover:border-orange/40 hover:bg-orange-tint hover:text-orange-dark"
          >
            In 3 Days
          </button>
        </div>

        {/* Trigger Button for Popover */}
        <button
          type="button"
          onClick={() => setPopoverOpen((open) => !open)}
          className={`flex w-full cursor-pointer items-center justify-between rounded-xl border bg-surface px-3.5 py-2.5 text-xs font-semibold transition-all ${
            error
              ? 'border-red ring-2 ring-red/15'
              : popoverOpen
                ? 'border-orange ring-2 ring-orange/15 text-ink'
                : 'border-border text-ink hover:border-border/80'
          }`}
        >
          <div className="flex items-center gap-2">
            <CalendarIcon size={15} className="text-orange" />
            <span>{readable || 'Select date and time...'}</span>
          </div>
          <Clock size={14} className="text-mute-light" />
        </button>
      </div>

      {/* Shadcn UI Custom Popover Card */}
      {popoverOpen && (
        <div className="absolute top-[calc(100%+6px)] left-0 z-50 flex flex-col gap-3 rounded-2xl border border-border bg-surface p-3.5 shadow-[0_12px_36px_rgba(16,24,40,0.22)] backdrop-blur-md sm:flex-row">
          {/* Custom Shadcn Calendar */}
          <ShadcnCalendar selectedDate={selectedDate} onSelectDate={handleDateSelect} />

          {/* Time Picker Section */}
          <div className="flex flex-col justify-between border-t border-border pt-3 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-3.5">
            <div className="flex flex-col gap-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-mute-light">
                Select Time
              </span>

              {/* Hour, Minute, Period Pickers */}
              <div className="flex items-center gap-1.5">
                {/* Hour */}
                <select
                  value={hour12}
                  onChange={(e) => handleHourChange(parseInt(e.target.value, 10))}
                  className="cursor-pointer rounded-lg border border-border bg-surface-muted px-2 py-1.5 text-xs font-bold text-ink outline-none focus:border-orange"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                    <option key={h} value={h}>
                      {String(h).padStart(2, '0')}
                    </option>
                  ))}
                </select>

                <span className="font-bold text-mute">:</span>

                {/* Minute */}
                <select
                  value={minute}
                  onChange={(e) => handleMinuteChange(parseInt(e.target.value, 10))}
                  className="cursor-pointer rounded-lg border border-border bg-surface-muted px-2 py-1.5 text-xs font-bold text-ink outline-none focus:border-orange"
                >
                  {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m) => (
                    <option key={m} value={m}>
                      {String(m).padStart(2, '0')}
                    </option>
                  ))}
                </select>

                {/* AM / PM Toggle */}
                <div className="flex overflow-hidden rounded-lg border border-border bg-surface-muted p-0.5">
                  <button
                    type="button"
                    onClick={() => handlePeriodChange('AM')}
                    className={`cursor-pointer px-2 py-1 text-[11px] font-extrabold rounded-md transition-colors ${
                      period === 'AM'
                        ? 'bg-orange text-white'
                        : 'text-mute hover:text-ink'
                    }`}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePeriodChange('PM')}
                    className={`cursor-pointer px-2 py-1 text-[11px] font-extrabold rounded-md transition-colors ${
                      period === 'PM'
                        ? 'bg-orange text-white'
                        : 'text-mute hover:text-ink'
                    }`}
                  >
                    PM
                  </button>
                </div>
              </div>

              {/* Time Shortcuts */}
              <div className="mt-1 flex flex-col gap-1">
                <span className="text-[10.5px] font-semibold text-mute-light uppercase">
                  Time Shortcuts
                </span>
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { label: '9:00 AM', h: 9, m: 0, p: 'AM' },
                    { label: '12:00 PM', h: 12, m: 0, p: 'PM' },
                    { label: '3:00 PM', h: 3, m: 0, p: 'PM' },
                    { label: '6:00 PM', h: 6, m: 0, p: 'PM' },
                  ].map((t) => (
                    <button
                      key={t.label}
                      type="button"
                      onClick={() => updateStateAndEmit(selectedDate, t.h, t.m, t.p)}
                      className="cursor-pointer rounded-md border border-border/80 bg-surface-subtle px-2 py-1 text-[11px] font-semibold text-mute hover:bg-orange-tint hover:text-orange-dark transition-colors"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Done Close Button */}
            <button
              type="button"
              onClick={() => setPopoverOpen(false)}
              className="mt-3 w-full cursor-pointer rounded-xl bg-orange py-2 text-xs font-bold text-white shadow-xs hover:bg-orange-dark transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Live Readable Preview Banner */}
      {readable && (
        <div className="flex items-center gap-2 rounded-xl border border-purple-500/20 bg-purple-500/10 px-3 py-2 text-xs font-semibold text-purple-300">
          <Sparkles size={14} className="shrink-0 text-purple-400" />
          <span>Scheduled for: <strong>{readable}</strong></span>
        </div>
      )}
    </div>
  )
}
