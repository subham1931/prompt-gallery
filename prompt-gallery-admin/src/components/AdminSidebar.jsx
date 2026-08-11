import { Link, useLocation } from 'react-router-dom'
import { FolderOpen, Home, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const items = [
  { to: '/', label: 'Home', match: (path) => path === '/' || path.startsWith('/prompts'), icon: Home },
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
      aria-label="Primary navigation"
    >
      <nav className="group/sidebar pointer-events-auto flex flex-row gap-1.5 overflow-hidden rounded-2xl border border-border bg-surface/95 p-1.5 shadow-[0_8px_28px_rgba(16,24,40,0.16)] backdrop-blur-md transition-all duration-300 ease-in-out md:w-[54px] md:flex-col md:hover:w-44">
        {visible.map(({ to, label, icon: Icon, match }) => {
          const active = match(pathname)
          return (
            <Link
              key={to}
              to={to}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
              className={`flex h-10 w-full items-center rounded-xl px-2.5 no-underline transition-all duration-200 ${
                active
                  ? 'bg-orange text-white shadow-[0_2px_8px_rgba(255,122,0,0.35)]'
                  : 'text-mute hover:bg-surface-muted hover:text-ink'
              }`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center">
                <Icon size={18} strokeWidth={active ? 2.25 : 2} />
              </div>
              <span className="whitespace-nowrap text-[13px] font-bold tracking-tight opacity-100 transition-all duration-300 ease-in-out md:max-w-0 md:opacity-0 md:group-hover/sidebar:max-w-[120px] md:group-hover/sidebar:opacity-100 md:group-hover/sidebar:ml-1">
                {label}
              </span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
