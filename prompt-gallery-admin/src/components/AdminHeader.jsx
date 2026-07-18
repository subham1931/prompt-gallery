import { Link, useLocation } from 'react-router-dom'
import { FolderPlus, LayoutDashboard, Plus } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

export function AdminHeader({ showNewPrompt = true }) {
  const { pathname } = useLocation()
  const onPrompts = pathname === '/' || pathname.startsWith('/prompts')
  const onCategories = pathname.startsWith('/categories')

  const navCls = (active) =>
    `inline-flex h-9 min-w-[104px] items-center justify-center rounded-md px-3 text-[13px] font-semibold leading-none no-underline transition-colors ${
      active
        ? 'bg-orange-tint text-orange-dark'
        : 'text-mute hover:bg-surface hover:text-ink'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-header backdrop-blur-[10px]">
      <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between gap-4 px-6">
        <div className="flex min-w-0 items-center gap-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-orange">
              <LayoutDashboard size={17} color="#fff" />
            </div>
            <div className="min-w-0 leading-tight">
              <div className="text-[11px] font-semibold tracking-[0.05em] text-mute-light uppercase">
                Admin
              </div>
              <div className="truncate text-[14px] font-bold">Prompt Gallery CMS</div>
            </div>
          </div>

          <div className="hidden h-6 w-px bg-border sm:block" aria-hidden />

          <nav className="hidden h-9 items-center rounded-lg border border-border bg-surface-muted p-0.5 sm:flex">
            <Link to="/" className={navCls(onPrompts && !onCategories)}>
              Prompts
            </Link>
            <Link to="/categories" className={navCls(onCategories)}>
              Categories
            </Link>
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/categories"
            className={`flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-mute no-underline transition-colors hover:bg-surface-muted hover:text-ink sm:hidden ${
              onCategories ? 'border-orange text-orange-dark' : ''
            }`}
            title="Categories"
          >
            <FolderPlus size={16} />
          </Link>
          <ThemeToggle />
          {showNewPrompt && (
            <Link
              to="/prompts/new"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-orange px-3.5 text-[13px] font-bold leading-none text-white no-underline shadow-[0_2px_8px_rgba(255,122,0,0.35)]"
            >
              <Plus size={15} /> New prompt
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
