import { useEffect, useRef, useState } from 'react'
import { Bell, Check, CheckCheck, Clock, PlusCircle, Sparkles, Trash2 } from 'lucide-react'
import { useNotifications } from '../context/NotificationContext'

export function NotificationMenu() {
  const [open, setOpen] = useState(false)
  const { notifications, unreadCount, markAllRead, markAsRead, clearAll } =
    useNotifications()
  const containerRef = useRef(null)

  useEffect(() => {
    const onPointerDown = (e) => {
      if (!containerRef.current?.contains(e.target)) setOpen(false)
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return (
    <div className="relative" ref={containerRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        aria-expanded={open}
        className={`relative inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border text-mute transition-colors ${
          open
            ? 'border-orange bg-orange-tint text-orange-dark'
            : 'border-border bg-surface hover:bg-surface-muted hover:text-ink'
        }`}
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-orange ring-2 ring-surface animate-pulse" />
        )}
      </button>

      {/* Notifications Popover Dropdown */}
      {open && (
        <div className="absolute top-[calc(100%+8px)] right-0 z-50 w-80 sm:w-96 overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_12px_36px_rgba(16,24,40,0.18)] backdrop-blur-md">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-ink">Notifications</span>
              {unreadCount > 0 ? (
                <span className="rounded-full bg-orange/15 px-2 py-0.5 text-[11px] font-bold text-orange-dark">
                  {unreadCount} new
                </span>
              ) : (
                <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-mute">
                  0 new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="flex items-center gap-1 border-none bg-transparent p-0 text-[11.5px] font-semibold text-orange cursor-pointer hover:underline"
                >
                  <CheckCheck size={13} />
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  aria-label="Clear all notifications"
                  className="flex items-center border-none bg-transparent p-0 text-mute-light cursor-pointer hover:text-red transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-[340px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-mute-light">
                <Bell size={24} className="mb-2 opacity-40" />
                <p className="m-0 text-xs font-semibold text-mute">No notifications</p>
                <p className="m-0 text-[11px]">You are all caught up!</p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className={`flex cursor-pointer items-start gap-3 border-b border-border/50 px-4 py-3 transition-colors last:border-b-0 ${
                    item.read
                      ? 'bg-surface hover:bg-surface-muted/50'
                      : 'bg-surface-subtle/80 hover:bg-surface-subtle'
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                      item.type === 'create'
                        ? 'bg-orange/10 text-orange'
                        : item.type === 'publish'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : item.type === 'schedule'
                            ? 'bg-purple-500/10 text-purple-400'
                            : 'bg-surface-muted text-mute'
                    }`}
                  >
                    {item.type === 'create' ? (
                      <PlusCircle size={14} />
                    ) : item.type === 'publish' ? (
                      <Sparkles size={14} />
                    ) : item.type === 'schedule' ? (
                      <Clock size={14} />
                    ) : (
                      <Check size={14} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="m-0 truncate text-xs font-bold text-ink">{item.title}</p>
                      <span className="shrink-0 text-[10.5px] text-mute-light">{item.time}</span>
                    </div>
                    <p className="m-0 mt-0.5 text-[11.5px] leading-relaxed text-mute line-clamp-2">
                      {item.message}
                    </p>
                  </div>

                  {!item.read && (
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
