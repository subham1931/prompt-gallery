import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function isSameDay(d1, d2) {
  if (!d1 || !d2) return false
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

function isPastDay(date, today) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return d < t
}

export function ShadcnCalendar({ selectedDate, onSelectDate }) {
  const today = new Date()
  const initialView = selectedDate || today

  const [currentYear, setCurrentYear] = useState(initialView.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(initialView.getMonth())

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((y) => y - 1)
    } else {
      setCurrentMonth((m) => m - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear((y) => y + 1)
    } else {
      setCurrentMonth((m) => m + 1)
    }
  }

  // Prevent navigating to past months
  const isPrevDisabled =
    currentYear < today.getFullYear() ||
    (currentYear === today.getFullYear() && currentMonth <= today.getMonth())

  // Days calculations
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  const daysGrid = []
  for (let i = 0; i < firstDayOfWeek; i++) {
    daysGrid.push(null)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    daysGrid.push(new Date(currentYear, currentMonth, day))
  }

  return (
    <div className="w-full max-w-[280px] select-none rounded-xl border border-border bg-surface p-3 shadow-xs">
      {/* Month & Year Navigation Header */}
      <div className="mb-3 flex items-center justify-between px-1">
        <button
          type="button"
          onClick={handlePrevMonth}
          disabled={isPrevDisabled}
          aria-label="Previous month"
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface-muted text-mute transition-colors hover:bg-surface-subtle hover:text-ink disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronLeft size={15} />
        </button>

        <span className="text-xs font-bold tracking-tight text-ink">
          {MONTH_NAMES[currentMonth]} {currentYear}
        </span>

        <button
          type="button"
          onClick={handleNextMonth}
          aria-label="Next month"
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface-muted text-mute transition-colors hover:bg-surface-subtle hover:text-ink"
        >
          <ChevronRight size={15} />
        </button>
      </div>

      {/* Weekday Labels */}
      <div className="mb-1.5 grid grid-cols-7 text-center">
        {WEEKDAYS.map((day) => (
          <span key={day} className="text-[11px] font-bold uppercase tracking-wider text-mute-light/70">
            {day}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {daysGrid.map((dateObj, idx) => {
          if (!dateObj) {
            return <div key={`empty-${idx}`} className="h-8 w-8" />
          }

          const isSelected = selectedDate && isSameDay(dateObj, selectedDate)
          const isToday = isSameDay(dateObj, today)
          const isDisabled = isPastDay(dateObj, today)

          return (
            <button
              key={dateObj.toISOString()}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelectDate(dateObj)}
              className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-xs transition-all ${
                isSelected
                  ? 'bg-orange font-bold text-white shadow-xs shadow-orange/30'
                  : isToday
                    ? 'border border-orange text-orange font-bold hover:bg-orange-tint'
                    : isDisabled
                      ? 'cursor-not-allowed text-mute-light/30 opacity-30'
                      : 'font-medium text-ink hover:bg-surface-muted hover:text-orange-dark'
              }`}
            >
              {dateObj.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
