import { useEffect, useState } from 'react'
import { Eye, EyeOff, Shield, Trash2, UserPlus } from 'lucide-react'
import { AdminHeader } from '../components/AdminHeader'
import { Badge } from '../components/ui/Badge'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { Toast } from '../components/ui/Toast'
import { useToast } from '../hooks/useToast'
import { createAdmin, demoteAdmin, listAdmins } from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function Admins() {
  const { user } = useAuth()
  const { toasts, pushToast } = useToast()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [saving, setSaving] = useState(false)
  const [pendingDemote, setPendingDemote] = useState(null)
  const [demotingId, setDemotingId] = useState(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await listAdmins()
      setRows(data || [])
    } catch (err) {
      setError(err.message || 'Failed to load admins')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await createAdmin({ name, email, password })
      setRows((prev) => {
        const without = prev.filter((r) => r.id !== data.id)
        return [data, ...without]
      })
      setName('')
      setEmail('')
      setPassword('')
      pushToast('Admin created')
    } catch (err) {
      pushToast(err.message || 'Failed to create admin', 'error')
    } finally {
      setSaving(false)
    }
  }

  const confirmDemote = async () => {
    if (!pendingDemote) return
    setDemotingId(pendingDemote.id)
    try {
      await demoteAdmin(pendingDemote.id)
      setRows((prev) => prev.filter((r) => r.id !== pendingDemote.id))
      setPendingDemote(null)
      pushToast('Admin demoted to user')
    } catch (err) {
      pushToast(err.message || 'Failed to demote admin', 'error')
    } finally {
      setDemotingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      <AdminHeader />

      <div className="mx-auto max-w-[1180px] px-4 pt-5 pb-28 sm:px-6 sm:pt-[26px] md:pb-20 md:pl-20">
        <div className="mb-5">
          <h1 className="m-0 text-xl font-bold tracking-[-0.02em]">Admins</h1>
          <p className="mt-1 mb-0 text-[13px] text-mute">
            Create CMS admins. Only superadmins can manage this list.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <form
            onSubmit={handleCreate}
            className="rounded-2xl border border-border bg-surface p-5 shadow-[0_1px_2px_rgba(16,24,40,0.03),0_1px_12px_rgba(16,24,40,0.04)]"
          >
            <div className="mb-4 flex items-center gap-2">
              <UserPlus size={16} className="text-orange" />
              <h2 className="m-0 text-[14px] font-bold">Create admin</h2>
            </div>

            <label className="mb-3 block">
              <span className="mb-1.5 block text-[11.5px] font-bold tracking-[0.04em] text-mute-light uppercase">
                Name
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Admin name"
                className="h-10 w-full rounded-[10px] border border-border bg-surface-muted px-3 text-[13px] outline-none focus:border-orange"
              />
            </label>

            <label className="mb-3 block">
              <span className="mb-1.5 block text-[11.5px] font-bold tracking-[0.04em] text-mute-light uppercase">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                className="h-10 w-full rounded-[10px] border border-border bg-surface-muted px-3 text-[13px] outline-none focus:border-orange"
              />
            </label>

            <label className="mb-4 block">
              <span className="mb-1.5 block text-[11.5px] font-bold tracking-[0.04em] text-mute-light uppercase">
                Password
              </span>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  className="h-10 w-full rounded-[10px] border border-border bg-surface-muted py-0 pr-10 pl-3 text-[13px] outline-none focus:border-orange"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((open) => !open)}
                  className="absolute top-1/2 right-1.5 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-mute"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-lg border-none bg-orange text-[13px] font-bold text-white disabled:opacity-60"
            >
              {saving ? 'Creating…' : 'Create admin'}
            </button>
          </form>

          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_1px_2px_rgba(16,24,40,0.03),0_1px_12px_rgba(16,24,40,0.04)]">
            <div className="border-b border-border bg-surface-muted px-5 py-3 text-[11.5px] font-bold tracking-[0.04em] text-mute-light uppercase">
              Staff accounts
            </div>

            {loading && (
              <div className="px-5 py-10 text-center text-[13px] text-mute">Loading…</div>
            )}
            {!loading && error && (
              <div className="px-5 py-10 text-center text-[13px] text-red">{error}</div>
            )}
            {!loading && !error && rows.length === 0 && (
              <div className="px-5 py-10 text-center text-[13px] text-mute">No admins yet.</div>
            )}

            {!loading &&
              !error &&
              rows.map((row) => {
                const isSelf = row.id === user?.id
                const isSuper = row.role === 'superadmin'
                return (
                  <div
                    key={row.id}
                    className="flex items-center gap-3 border-b border-border px-3 py-3.5 last:border-b-0 sm:px-5"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-tint text-orange-dark">
                      <Shield size={15} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate text-[13.5px] font-semibold">{row.name}</span>
                        <Badge tone={isSuper ? 'orange' : 'default'}>{row.role}</Badge>
                        {isSelf && <Badge tone="green">You</Badge>}
                      </div>
                      <div className="truncate text-xs text-mute-light">{row.email}</div>
                    </div>
                    {!isSelf && !isSuper && (
                      <button
                        type="button"
                        onClick={() => setPendingDemote(row)}
                        className="inline-flex shrink-0 cursor-pointer items-center gap-1 border-none bg-transparent p-0 text-[13px] font-semibold text-red"
                      >
                        <Trash2 size={14} />
                        <span className="hidden sm:inline">Demote</span>
                      </button>
                    )}
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      <ConfirmModal
        open={Boolean(pendingDemote)}
        title="Demote this admin?"
        description={
          pendingDemote
            ? `“${pendingDemote.name}” will lose CMS access and become a regular user.`
            : ''
        }
        confirmLabel="Demote admin"
        cancelLabel="Keep admin"
        loading={Boolean(demotingId)}
        onCancel={() => {
          if (!demotingId) setPendingDemote(null)
        }}
        onConfirm={confirmDemote}
      />

      <Toast toasts={toasts} />
    </div>
  )
}
