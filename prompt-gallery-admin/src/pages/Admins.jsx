import { useEffect, useState } from 'react'
import { Eye, EyeOff, Plus, Search, Shield, Trash2, UserPlus, X } from 'lucide-react'
import { AdminHeader } from '../components/AdminHeader'
import { Badge } from '../components/ui/Badge'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { Toast } from '../components/ui/Toast'
import { useToast } from '../hooks/useToast'
import { createAdmin, deleteAdmin, listAdmins, updateAdminStatus } from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function Admins() {
  const { user } = useAuth()
  const { toasts, pushToast } = useToast()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [saving, setSaving] = useState(false)

  // Security password confirmation modal state
  const [pendingToggle, setPendingToggle] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

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
      setIsCreateModalOpen(false)
      pushToast('Admin account created successfully!')
    } catch (err) {
      pushToast(err.message || 'Failed to create admin', 'error')
    } finally {
      setSaving(false)
    }
  }

  const openToggleModal = (row) => {
    setPendingToggle({ row, nextStatus: !row.isActive })
    setConfirmPassword('')
    setShowConfirmPassword(false)
  }

  const confirmToggleStatus = async () => {
    if (!pendingToggle) return
    if (!confirmPassword.trim()) {
      pushToast('Superadmin password is required', 'error')
      return
    }

    setActionLoading(true)
    const { row, nextStatus } = pendingToggle
    try {
      const { data } = await updateAdminStatus(row.id, nextStatus, confirmPassword)
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, isActive: data.isActive } : r)))
      setPendingToggle(null)
      setConfirmPassword('')
      pushToast(nextStatus ? 'Admin account activated' : 'Admin account deactivated')
    } catch (err) {
      pushToast(err.message || 'Failed to update status', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const openDeleteModal = (row) => {
    setPendingDelete(row)
    setConfirmPassword('')
    setShowConfirmPassword(false)
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return
    if (!confirmPassword.trim()) {
      pushToast('Superadmin password is required', 'error')
      return
    }

    setActionLoading(true)
    try {
      await deleteAdmin(pendingDelete.id, confirmPassword)
      setRows((prev) => prev.filter((r) => r.id !== pendingDelete.id))
      setPendingDelete(null)
      setConfirmPassword('')
      pushToast('Admin account deleted')
    } catch (err) {
      pushToast(err.message || 'Failed to delete admin account', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const filteredRows = rows.filter((row) => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return true
    return row.name?.toLowerCase().includes(q) || row.email?.toLowerCase().includes(q)
  })

  return (
    <div className="min-h-screen bg-bg text-ink">
      <AdminHeader />

      <div className="mx-auto max-w-[1180px] px-4 pt-6 pb-28 sm:px-6 md:pb-20 md:pl-20">
        {/* Top Header & Action Row */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="m-0 text-2xl font-extrabold tracking-tight">Admins & Staff</h1>
            <p className="mt-1 text-xs text-mute">
              Manage CMS administrator accounts, activate or deactivate access, and update security roles.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange px-4 py-2.5 text-xs font-bold text-white shadow-[0_3px_12px_rgba(255,122,0,0.35)] transition-all hover:bg-orange-dark hover:shadow-[0_4px_16px_rgba(255,122,0,0.45)] active:scale-[0.98]"
          >
            <Plus size={16} />
            <span>Create New Admin</span>
          </button>
        </div>

        {/* Full-width Data Table Card */}
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_1px_2px_rgba(16,24,40,0.03),0_1px_12px_rgba(16,24,40,0.04)]">
          {/* Table Header Filter / Toolbar */}
          <div className="flex flex-col gap-3 border-b border-border bg-surface-muted/60 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-mute-light">
                Staff Directory
              </span>
              <span className="inline-flex items-center rounded-full bg-orange-tint px-2.5 py-0.5 text-[11px] font-extrabold text-orange-dark">
                {rows.length} {rows.length === 1 ? 'Account' : 'Accounts'}
              </span>
            </div>

            {/* Search Filter Box */}
            <div className="relative w-full sm:w-64">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mute-light" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="h-9 w-full rounded-xl border border-border bg-surface pl-9 pr-3 text-xs text-ink outline-none transition-all placeholder:text-mute-light focus:border-orange focus:ring-2 focus:ring-orange/15"
              />
            </div>
          </div>

          {/* Table Content */}
          {loading && (
            <div className="px-5 py-12 text-center text-xs text-mute">Loading administrator accounts...</div>
          )}
          {!loading && error && (
            <div className="px-5 py-12 text-center text-xs text-red font-semibold">{error}</div>
          )}
          {!loading && !error && filteredRows.length === 0 && (
            <div className="px-5 py-12 text-center text-xs text-mute">
              {searchQuery ? 'No admin accounts match your search.' : 'No administrators found.'}
            </div>
          )}

          {!loading && !error && filteredRows.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-surface-subtle/40 text-[11px] font-bold uppercase tracking-wider text-mute-light">
                    <th className="py-3.5 px-5">Administrator</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredRows.map((row) => {
                    const isSelf = row.id === user?.id
                    const isSuper = row.role === 'superadmin'
                    const isActive = row.isActive !== false

                    return (
                      <tr
                        key={row.id}
                        className={`transition-colors hover:bg-surface-muted/50 ${
                          !isActive ? 'bg-surface-subtle/40 opacity-75' : ''
                        }`}
                      >
                        {/* Admin Info */}
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-tint text-orange-dark font-bold text-xs">
                              {row.name ? row.name[0].toUpperCase() : <Shield size={16} />}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-ink text-xs sm:text-sm truncate">
                                  {row.name}
                                </span>
                                {isSelf && <Badge tone="green">You</Badge>}
                              </div>
                              <div className="text-mute text-[11.5px] truncate">{row.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* Role Badge */}
                        <td className="py-3.5 px-4">
                          <Badge tone={isSuper ? 'orange' : 'default'}>{row.role}</Badge>
                        </td>

                        {/* Status Toggle */}
                        <td className="py-3.5 px-4">
                          {isSelf ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green">
                              <span className="h-2 w-2 rounded-full bg-green" /> Active
                            </span>
                          ) : (
                            <button
                              type="button"
                              role="switch"
                              aria-checked={isActive}
                              onClick={() => openToggleModal(row)}
                              title={isActive ? 'Deactivate account' : 'Activate account'}
                              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-surface-muted px-2.5 py-1 text-[11.5px] font-semibold transition-colors hover:bg-surface-subtle"
                            >
                              <span className={isActive ? 'font-bold text-green' : 'text-mute'}>
                                {isActive ? 'Active' : 'Deactive'}
                              </span>
                              <span
                                className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                                  isActive ? 'bg-orange' : 'bg-mute/40'
                                }`}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                                    isActive ? 'translate-x-3' : 'translate-x-0'
                                  }`}
                                />
                              </span>
                            </button>
                          )}
                        </td>

                        {/* Action Buttons */}
                        <td className="py-3.5 px-5 text-right">
                          {!isSelf && (
                            <button
                              type="button"
                              onClick={() => openDeleteModal(row)}
                              title="Delete account"
                              aria-label="Delete account"
                              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface text-red transition-colors hover:border-red/30 hover:bg-red-tint"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Create New Admin */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="animate-slide-in w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-tint text-orange-dark">
                  <UserPlus size={18} />
                </div>
                <div>
                  <h3 className="m-0 text-base font-bold text-ink">Create New Admin</h3>
                  <p className="m-0 text-xs text-mute">Fill in details to create a new administrator account.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-mute hover:bg-surface-muted hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-mute-light">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Alex Morgan"
                  className="h-11 w-full rounded-xl border border-border bg-surface-muted px-3.5 text-xs text-ink outline-none transition-all placeholder:text-mute-light focus:border-orange focus:bg-surface focus:ring-2 focus:ring-orange/15"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-mute-light">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@example.com"
                  className="h-11 w-full rounded-xl border border-border bg-surface-muted px-3.5 text-xs text-ink outline-none transition-all placeholder:text-mute-light focus:border-orange focus:bg-surface focus:ring-2 focus:ring-orange/15"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-mute-light">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    className="h-11 w-full rounded-xl border border-border bg-surface-muted pl-3.5 pr-10 text-xs text-ink outline-none transition-all placeholder:text-mute-light focus:border-orange focus:bg-surface focus:ring-2 focus:ring-orange/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((open) => !open)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-mute hover:text-ink cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="cursor-pointer rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-bold text-mute transition-colors hover:bg-surface-muted hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="cursor-pointer rounded-xl bg-orange px-5 py-2.5 text-xs font-bold text-white shadow-[0_2px_8px_rgba(255,122,0,0.35)] transition-all hover:bg-orange-dark disabled:opacity-60"
                >
                  {saving ? 'Creating Account...' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Status Toggle Modal with Superadmin Password */}
      <ConfirmModal
        open={Boolean(pendingToggle)}
        title={
          pendingToggle?.nextStatus
            ? `Activate “${pendingToggle?.row?.name}”?`
            : `Deactivate “${pendingToggle?.row?.name}”?`
        }
        description="Please enter your superadmin password to confirm this status change."
        confirmLabel={pendingToggle?.nextStatus ? 'Activate Account' : 'Deactivate Account'}
        loadingText="Updating…"
        cancelLabel="Cancel"
        tone={pendingToggle?.nextStatus ? 'warning' : 'danger'}
        loading={actionLoading}
        onCancel={() => {
          if (!actionLoading) setPendingToggle(null)
        }}
        onConfirm={confirmToggleStatus}
      >
        <div className="mt-3">
          <label className="block">
            <span className="mb-1 block text-[11px] font-bold tracking-[0.04em] text-mute-light uppercase">
              Superadmin Password
            </span>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') confirmToggleStatus()
                }}
                required
                autoFocus
                placeholder="Enter your superadmin password"
                className="h-9 w-full rounded-lg border border-border bg-surface-muted py-0 pr-9 pl-3 text-[13px] outline-none focus:border-orange"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute top-1/2 right-1 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center border-none bg-transparent text-mute"
              >
                {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </label>
        </div>
      </ConfirmModal>

      {/* Confirm Delete Account Modal with Superadmin Password */}
      <ConfirmModal
        open={Boolean(pendingDelete)}
        title={`Delete “${pendingDelete?.name}” permanently?`}
        description={`Are you sure you want to delete ${pendingDelete?.email}? Enter your superadmin password to confirm.`}
        confirmLabel="Delete Permanently"
        loadingText="Deleting…"
        cancelLabel="Cancel"
        tone="danger"
        loading={actionLoading}
        onCancel={() => {
          if (!actionLoading) setPendingDelete(null)
        }}
        onConfirm={confirmDelete}
      >
        <div className="mt-3">
          <label className="block">
            <span className="mb-1 block text-[11px] font-bold tracking-[0.04em] text-mute-light uppercase">
              Superadmin Password
            </span>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') confirmDelete()
                }}
                required
                autoFocus
                placeholder="Enter your superadmin password"
                className="h-9 w-full rounded-lg border border-border bg-surface-muted py-0 pr-9 pl-3 text-[13px] outline-none focus:border-orange"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute top-1/2 right-1 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center border-none bg-transparent text-mute"
              >
                {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </label>
        </div>
      </ConfirmModal>

      <Toast toasts={toasts} />
    </div>
  )
}

