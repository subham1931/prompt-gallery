import { LogOut } from 'lucide-react'
import { AdminHeader } from '../components/AdminHeader'
import { useAuth } from '../context/AuthContext'

function FieldRow({ label, children, last = false }) {
  return (
    <div
      className={`grid grid-cols-1 gap-1.5 px-5 py-4 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-center sm:gap-6 ${
        last ? '' : 'border-b border-border'
      }`}
    >
      <div className="text-[12px] font-semibold tracking-[0.02em] text-mute-light uppercase sm:text-[13px] sm:normal-case sm:tracking-normal sm:font-medium sm:text-mute">
        {label}
      </div>
      <div className="min-w-0 text-[13.5px] text-ink">{children}</div>
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
    <div className="min-h-screen bg-bg text-ink">
      <AdminHeader />

      <div className="mx-auto max-w-[1180px] px-4 pt-5 pb-28 sm:px-6 sm:pt-[26px] md:pb-20 md:pl-20">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="m-0 text-xl font-bold tracking-[-0.02em]">Account</h1>
            <p className="mt-1 mb-0 text-[13px] text-mute">
              Signed in to Prompt Gallery CMS
            </p>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex h-9 w-fit cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-surface px-3.5 text-[13px] font-semibold text-mute transition-colors hover:bg-surface-muted hover:text-ink"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="flex items-center gap-4 border-b border-border px-5 py-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-surface-subtle text-[13px] font-bold tracking-wide text-ink">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="truncate text-[15px] font-semibold tracking-[-0.01em]">
                {user.name}
              </div>
              <div className="mt-0.5 truncate text-[13px] text-mute">{user.email}</div>
            </div>
          </div>

          <FieldRow label="Role">
            <span className="inline-flex items-center gap-2">
              <span className="font-medium">{roleLabel}</span>
              <span className="text-mute-light">·</span>
              <span className="text-mute">
                {isSuperadmin ? 'Full CMS + staff management' : 'CMS content management'}
              </span>
            </span>
          </FieldRow>

          <FieldRow label="Email">
            <span className="font-mono text-[13px]">{user.email}</span>
          </FieldRow>

          <FieldRow label="Member since">{joined}</FieldRow>

          <FieldRow label="Permissions" last>
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {permissions.map((item) => (
                <li
                  key={item}
                  className="rounded-md border border-border bg-surface-muted px-2.5 py-1 text-[12px] font-medium text-ink"
                >
                  {item}
                </li>
              ))}
            </ul>
          </FieldRow>
        </div>
      </div>
    </div>
  )
}
