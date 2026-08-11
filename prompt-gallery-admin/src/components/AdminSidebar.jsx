import { Link, useLocation } from 'react-router-dom'
import { FolderOpen, Home, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const items = [
  { to: '/', label: 'Prompts', icon: Home, match: (path) => path === '/' || path.startsWith('/prompts') },
  {
    to: '/categories',
    label: 'Categories',
    icon: FolderOpen,
    match: (path) => path.startsWith('/categories'),
  },
  {
    to: '/admins',
    label: 'Admins',
    icon: Shield,
    match: (path) => path.startsWith('/admins'),
    superadminOnly: true,
  },
]

export function AdminSidebar() {
  const { pathname } = useLocation()
  const { isSuperadmin } = useAuth()

  const visible = items.filter((item) => !item.superadminOnly || isSuperadmin)

  return (
    <aside
      className="pointer-events-none fixed inset-x-0 bottom-3 z-50 flex justify-center px-3 md:inset-x-auto md:top-1/2 md:bottom-auto md:left-4 md:block md:-translate-y-1/2 md:px-0"
      aria-label="Primary"
    >
      <nav className="pointer-events-auto flex flex-row gap-1 rounded-2xl border border-border bg-surface/95 p-1.5 shadow-[0_8px_28px_rgba(16,24,40,0.14)] backdrop-blur-md md:flex-col md:gap-1.5">
        {visible.map(({ to, label, icon: Icon, match }) => {
          const active = match(pathname)
          return (
            <Link
              key={to}
              to={to}
              title={label}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
              className={`group relative flex h-11 w-11 items-center justify-center rounded-xl no-underline transition-colors md:h-10 md:w-10 ${
                active
                  ? 'bg-orange text-white shadow-[0_2px_8px_rgba(255,122,0,0.35)]'
                  : 'text-mute hover:bg-surface-muted hover:text-ink'
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2.25 : 2} />
              <span className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-surface px-2 py-1 text-[11px] font-semibold text-ink opacity-0 shadow-sm transition-opacity group-hover:opacity-100 md:bottom-auto md:top-1/2 md:left-[calc(100%+10px)] md:block md:translate-x-0 md:-translate-y-1/2">
                {label}
              </span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
