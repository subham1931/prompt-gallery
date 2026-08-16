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
  const { user, isAuthenticated, signOut, openAuth } = useAuth()

  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState(urlQuery)
  const debouncedQuery = useDebounce(query, 300)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)

  const inputRef = useRef(null)
  const searchRef = useRef(null)
  const menuRef = useRef(null)
  const lastScrollY = useRef(0)

  // Scroll direction and scroll distance handler
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrolled(currentScrollY > 20)

      if (currentScrollY > 120) {
        if (currentScrollY > lastScrollY.current + 8) {
          // Hide navbar when scrolling down fast
          setVisible(false)
        } else if (currentScrollY < lastScrollY.current - 8) {
          // Reveal floating navbar immediately when scrolling up
          setVisible(true)
        }
      } else {
        setVisible(true)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [location.pathname])

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
    <header
      className={`fixed top-3 sm:top-4 left-0 right-0 z-50 px-3 sm:px-6 pointer-events-none transition-all duration-500 ease-out ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0'
      }`}
    >
      <div
        className={`pointer-events-auto mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-4 rounded-full transition-all duration-500 ${
          scrolled
            ? 'bg-white/85 dark:bg-slate-950/85 backdrop-blur-2xl border border-white/80 dark:border-slate-800/80 shadow-2xl px-4 sm:px-6 py-1.5 sm:py-2 scale-[0.98]'
            : 'bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/70 dark:border-slate-800/70 shadow-xl px-4 sm:px-6 py-2.5 sm:py-3 scale-100'
        }`}
      >
        {/* Brand Logo */}
        <Link to="/" className="group flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 transition-transform duration-300 group-hover:scale-105 shadow-md">
            <Sparkles size={16} className="text-orange-500 dark:text-orange-500 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-sm font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-lg">
              prompt<span className="text-orange-500 dark:text-orange-400">-gallery</span>
            </span>
            <span className="hidden text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 sm:inline">
              Curated AI Prompts
            </span>
          </div>
        </Link>

        {/* Actions & Search */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Quick Search */}
          <div ref={searchRef} className="flex justify-end">
            <div
              className={`flex items-center transition-all duration-300 ease-out ${
                searchOpen ? 'w-[calc(100vw-135px)] xs:w-44 sm:w-64 lg:w-80' : 'w-9'
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
            <button
              type="button"
              onClick={() => openAuth('signin')}
              className="inline-flex h-9 items-center rounded-xl px-4 text-xs font-extrabold uppercase tracking-wider text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10 transition-all cursor-pointer border-none bg-transparent"
            >
              Log In
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
