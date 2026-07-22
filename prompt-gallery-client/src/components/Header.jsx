import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { Search, User, Aperture, X, LogOut } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const urlQuery = searchParams.get('q') || ''
  const { user, isAuthenticated, signOut } = useAuth()

  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState(urlQuery)
  const [menuOpen, setMenuOpen] = useState(false)
  const inputRef = useRef(null)
  const searchRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    setQuery(urlQuery)
    if (urlQuery) setSearchOpen(true)
  }, [urlQuery])

  useEffect(() => {
    if (searchOpen) {
      inputRef.current?.focus()
    }
  }, [searchOpen])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setMenuOpen(false)
        inputRef.current?.blur()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        if (!query) setSearchOpen(false)
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [query])

  const applySearch = (value) => {
    const trimmed = value.trim()
    const params = new URLSearchParams()
    if (trimmed) params.set('q', trimmed)

    if (location.pathname === '/') {
      navigate({ pathname: '/', search: params.toString() }, { replace: true })
    } else if (trimmed) {
      navigate(`/?${params.toString()}`)
    }
  }

  const handleChange = (e) => {
    const value = e.target.value
    setQuery(value)
    applySearch(value)
  }

  const openSearch = () => {
    setSearchOpen(true)
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  const closeSearch = () => {
    setQuery('')
    setSearchOpen(false)
    applySearch('')
  }

  const initials = (user?.name || 'U')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex shrink-0 items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-text)] text-accent transition-opacity duration-200 group-hover:opacity-85">
            <Aperture size={18} strokeWidth={2} />
          </div>
          <span className="font-display hidden text-lg font-bold tracking-tight text-[var(--color-text)] sm:inline">
            PromptGallery
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
          <div ref={searchRef} className="flex justify-end">
            <div
              className={`flex items-center transition-all duration-300 ease-out ${
                searchOpen ? 'w-40 sm:w-56 lg:w-72' : 'w-9'
              }`}
            >
              {searchOpen ? (
                <div className="relative w-full">
                  <Search
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                  />
                  <input
                    ref={inputRef}
                    type="search"
                    value={query}
                    onChange={handleChange}
                    placeholder="Search prompts..."
                    aria-label="Search prompts"
                    className="h-9 w-full rounded-full border border-[var(--color-border)] bg-[var(--color-surface-muted)] py-0 pl-9 pr-9 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                  <button
                    type="button"
                    onClick={closeSearch}
                    aria-label="Close search"
                    className="absolute right-1.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
                  >
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={openSearch}
                  aria-label="Open search"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20"
                >
                  <Search size={18} strokeWidth={2} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          <ThemeToggle />

          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Account menu"
                aria-expanded={menuOpen}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-text)] text-[10px] font-bold text-accent transition-opacity hover:opacity-85"
              >
                {initials}
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] z-20 min-w-[180px] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-1 shadow-xl">
                  <div className="border-b border-[var(--color-border)] px-3.5 py-2.5">
                    <p className="truncate text-sm font-semibold text-[var(--color-text)]">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-[var(--color-text-muted)]">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2.5 text-sm text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-muted)]"
                  >
                    <User size={15} />
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false)
                      signOut()
                    }}
                    className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-muted)]"
                  >
                    <LogOut size={15} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link
                to="/signin"
                className="hidden h-9 items-center rounded-full px-3 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)] sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="inline-flex h-9 items-center rounded-full bg-accent px-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
