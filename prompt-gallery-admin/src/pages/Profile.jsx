import { LogOut } from 'lucide-react'
import { AdminHeader } from '../components/AdminHeader'
import { useAuth } from '../context/AuthContext'

function FieldRow({ label, children }) {
  return (
    <div className="grid grid-cols-1 gap-1.5 py-4 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-center sm:gap-6">
      <div className="text-sm font-normal text-zinc-400">
        {label}
      </div>
      <div className="min-w-0 text-sm text-zinc-100">{children}</div>
    </div>
  )
}

export default function Profile() {
  const { user, signOut, isSuperadmin } = useAuth()

  if (!user) return null

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const joined = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—'

  const roleLabel = user.role === 'superadmin' ? 'Superadmin' : 'Admin'
  const permissions =
    user.role === 'superadmin'
      ? ['Prompts', 'Categories', 'Uploads', 'Admin accounts']
      : ['Prompts', 'Categories', 'Uploads']

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <AdminHeader />

      <div className="mx-auto max-w-[1180px] px-4 pt-5 pb-28 sm:px-6 sm:pt-8 md:pb-20 md:pl-20">
        {/* Page Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">Account</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Signed in to Prompt Gallery CMS
            </p>
          </div>

          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-transparent px-3 py-1.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800 cursor-pointer"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>

        {/* shadcn Card Container */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 shadow-none">
          {/* User Info Header Header */}
          <div className="flex items-center gap-4 pb-6 border-b border-zinc-800">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-sm font-medium text-zinc-100">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="truncate text-base font-semibold text-zinc-50">
                {user.name}
              </div>
              <div className="mt-0.5 truncate text-sm text-zinc-400 font-mono">{user.email}</div>
            </div>
          </div>

          {/* Divided Rows */}
          <div className="divide-y divide-zinc-800">
            <FieldRow label="Role">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-900">
                  {roleLabel}
                </span>
                <span className="text-sm text-zinc-400">
                  {isSuperadmin ? 'Full CMS + staff management' : 'CMS content management'}
                </span>
              </div>
            </FieldRow>

            <FieldRow label="Email">
              <span className="font-mono text-sm text-zinc-100">{user.email}</span>
            </FieldRow>

            <FieldRow label="Member since">
              <span className="text-sm text-zinc-100">{joined}</span>
            </FieldRow>

            <FieldRow label="Permissions">
              <div className="flex flex-wrap gap-2 py-0.5">
                {permissions.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center rounded-md border border-zinc-700 bg-transparent px-2.5 py-0.5 text-xs text-zinc-300 font-normal"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </FieldRow>
          </div>
        </div>
      </div>
    </div>
  )
}
