import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { Search, User, Sparkles, X, LogOut, Command } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../context/AuthContext'
import { useDebounce } from '../hooks/useDebounce'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const urlQuery = searchParams.get('q') || ''
  const { user, isAuthenticated, signOut } = useAuth()

  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState(urlQuery)
  const debouncedQuery = useDebounce(query, 300)
  const [menuOpen, setMenuOpen] = useState(false)
  const inputRef = useRef(null)
  const searchRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    setQuery(urlQuery)
    if (urlQuery) setSearchOpen(true)
  }, [urlQuery])

  useEffect(() => {
    if (query !== urlQuery) {
      applySearch(debouncedQuery)
    }
  }, [debouncedQuery])

  useEffect(() => {
    if (searchOpen) {
      inputRef.current?.focus()
    }
  }, [searchOpen])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
        inputRef.current?.focus()
      }
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
    setQuery(e.target.value)
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
    <header className="sticky top-0 z-50 px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl bg-transparent px-5 sm:px-7 py-3 transition-all duration-300">
        {/* Brand Logo */}
        <Link to="/" className="group flex shrink-0 items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 transition-transform duration-300 group-hover:scale-105 shadow-md">
            <Sparkles size={18} className="text-orange-500 dark:text-orange-500 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-lg">
              prompt<span className="text-orange-500 dark:text-orange-400">-gallery</span>
            </span>
            <span className="hidden text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 sm:inline">
              Curated AI Prompts
            </span>
          </div>
        </Link>

        {/* Actions & Search */}
        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <div ref={searchRef} className="flex justify-end">
            <div
              className={`flex items-center transition-all duration-300 ease-out ${
                searchOpen ? 'w-48 sm:w-64 lg:w-80' : 'w-9'
              }`}
            >
              {searchOpen ? (
                <div className="relative w-full">
                  <Search
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    ref={inputRef}
                    type="search"
                    value={query}
                    onChange={handleChange}
                    placeholder="Search prompts or tags..."
                    aria-label="Search prompts"
                    className="glass-input h-9 w-full rounded-xl py-0 pl-9 pr-8 text-xs font-medium text-slate-900 placeholder:text-slate-400 dark:text-white"
                  />
                  {query ? (
                    <button
                      type="button"
                      onClick={closeSearch}
                      className="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    >
                      <X size={12} />
                    </button>
                  ) : (
                    <div className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 text-[10px] font-semibold text-slate-400 sm:flex">
                      <Command size={10} /> K
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={openSearch}
                  aria-label="Open search"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-900/5 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white transition-all"
                >
                  <Search size={16} strokeWidth={2.2} />
                </button>
              )}
            </div>
          </div>

          <ThemeToggle />

          {/* User Auth state */}
          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Account menu"
                aria-expanded={menuOpen}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white text-xs font-extrabold shadow-md hover:bg-orange-600 transition-transform active:scale-95 cursor-pointer"
              >
                {initials}
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-[calc(100%+12px)] z-50 min-w-[200px] overflow-hidden rounded-2xl glass-panel p-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="border-b border-slate-200/50 dark:border-slate-800/80 px-3.5 py-2.5">
                    <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="truncate text-[11px] font-medium text-slate-400">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10 transition-colors"
                  >
                    <User size={14} />
                    Profile Settings
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false)
                      signOut()
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/signin"
              className="inline-flex h-9 items-center rounded-xl px-4 text-xs font-extrabold uppercase tracking-wider text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10 transition-all"
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
