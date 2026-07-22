import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { LayoutDashboard, LogOut, Plus, User } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { AdminSidebar } from './AdminSidebar'
import { useAuth } from '../context/AuthContext'

export function AdminHeader({ showNewPrompt = true }) {
  const { user, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const closeTimer = useRef(null)

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  const openMenu = () => {
    clearCloseTimer()
    setMenuOpen(true)
  }

  const scheduleClose = () => {
    clearCloseTimer()
    closeTimer.current = setTimeout(() => setMenuOpen(false), 160)
  }

  useEffect(() => {
    const onPointerDown = (e) => {
      if (!menuRef.current?.contains(e.target)) setMenuOpen(false)
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
      clearCloseTimer()
    }
  }, [])

  const initials = (user?.name || 'A')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <>
      <AdminSidebar />

      <header className="sticky top-0 z-40 border-b border-border bg-header backdrop-blur-[10px]">
        <div className="mx-auto flex h-14 max-w-[1180px] items-center justify-between gap-2 px-4 sm:h-16 sm:gap-4 sm:px-6 md:pl-20">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-orange sm:h-9 sm:w-9">
              <LayoutDashboard size={16} color="#fff" />
            </div>
            <div className="min-w-0 leading-tight">
              <div className="text-[10px] font-semibold tracking-[0.05em] text-mute-light uppercase sm:text-[11px]">
                {user?.role === 'superadmin' ? 'Superadmin' : 'Admin'}
              </div>
              <div className="truncate text-[13px] font-bold sm:text-[14px]">
                <span className="sm:hidden">Prompt Gallery</span>
                <span className="hidden sm:inline">Prompt Gallery CMS</span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
            {showNewPrompt && (
              <Link
                to="/prompts/new"
                aria-label="New prompt"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-orange px-2.5 text-[13px] font-bold leading-none text-white no-underline shadow-[0_2px_8px_rgba(255,122,0,0.35)] sm:px-3.5"
              >
                <Plus size={15} />
                <span className="hidden sm:inline">New prompt</span>
              </Link>
            )}

            {user && (
              <div
                className="relative"
                ref={menuRef}
                onMouseEnter={openMenu}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  aria-label="Account menu"
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                  className={`inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border text-[11px] font-bold transition-colors ${
                    menuOpen
                      ? 'border-orange bg-orange-tint text-orange-dark'
                      : 'border-border bg-surface text-mute hover:bg-surface-muted hover:text-ink'
                  }`}
                >
                  {initials || <User size={16} />}
                </button>

                {menuOpen && (
                  <div
                    role="menu"
                    className="absolute top-[calc(100%+8px)] right-0 z-50 min-w-[200px] overflow-hidden rounded-xl border border-border bg-surface py-1 shadow-[0_8px_24px_rgba(16,24,40,0.12)]"
                    onMouseEnter={openMenu}
                    onMouseLeave={scheduleClose}
                  >
                    <div className="border-b border-border px-3.5 py-2.5">
                      <p className="m-0 truncate text-[13px] font-semibold text-ink">{user.name}</p>
                      <p className="m-0 truncate text-[12px] text-mute">{user.email}</p>
                      <p className="mt-1 mb-0 text-[11px] font-semibold tracking-[0.04em] text-mute-light uppercase">
                        {user.role}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                      className="flex w-full items-center gap-2 px-3.5 py-2.5 text-[13px] font-semibold text-mute no-underline transition-colors hover:bg-surface-muted hover:text-ink"
                    >
                      <User size={15} />
                      Profile
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setMenuOpen(false)
                        signOut()
                      }}
                      className="flex w-full cursor-pointer items-center gap-2 border-none bg-transparent px-3.5 py-2.5 text-left text-[13px] font-semibold text-mute transition-colors hover:bg-surface-muted hover:text-ink"
                    >
                      <LogOut size={15} />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
