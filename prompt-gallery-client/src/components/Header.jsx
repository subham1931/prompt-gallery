import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { Search, User, Aperture, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const urlQuery = searchParams.get('q') || ''

  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState(urlQuery)
  const inputRef = useRef(null)
  const searchRef = useRef(null)

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
    }
    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [searchOpen, query])

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

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="group flex shrink-0 items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-text)] text-accent transition-opacity duration-200 group-hover:opacity-85">
            <Aperture size={18} strokeWidth={2} />
          </div>
          <span className="font-display hidden text-lg font-bold tracking-tight text-[var(--color-text)] sm:inline">
            PromptGallery
          </span>
        </Link>

        {/* Right actions */}
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

          <Link
            to="/profile"
            aria-label="Profile"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]"
          >
            <User size={18} />
          </Link>
        </div>
      </div>
    </header>
  )
}
