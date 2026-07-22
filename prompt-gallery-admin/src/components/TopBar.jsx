import { Link } from 'react-router-dom'
import { Loader2, Save } from 'lucide-react'
import { Badge } from './ui/Badge'
import { ThemeToggle } from './ThemeToggle'
import { AdminSidebar } from './AdminSidebar'

export function TopBar({ title, seoScore, onSave, saving = false, isEdit = false }) {
  const tone = seoScore >= 80 ? 'green' : 'orange'
  const saveLabel = saving
    ? isEdit
      ? 'Saving…'
      : 'Creating…'
    : isEdit
      ? 'Save'
      : 'Create'

  return (
    <>
      <AdminSidebar />
      <header className="sticky top-0 z-40 border-b border-border bg-header backdrop-blur-md">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-6 md:pl-20">
          <div className="min-w-0">
            <div className="hidden items-center gap-1.5 text-[12px] text-mute-light sm:flex">
              <Link to="/" className="text-mute no-underline hover:text-ink">
                Prompts
              </Link>
              <span>/</span>
              <span>Editor</span>
            </div>
            <div className="flex min-w-0 items-center gap-2">
              <h1 className="m-0 max-w-[180px] truncate text-[14px] font-semibold tracking-[-0.01em] sm:max-w-[420px] sm:text-[15px]">
                {title || 'Untitled prompt'}
              </h1>
              <Badge tone={tone}>SEO {seoScore}</Badge>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            <Link
              to="/"
              className={`rounded-lg border border-border bg-surface px-2.5 py-2 text-[13px] font-medium text-mute no-underline transition-colors hover:bg-surface-subtle hover:text-ink sm:px-3.5 ${
                saving ? 'pointer-events-none opacity-50' : ''
              }`}
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border-none bg-orange px-2.5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-orange-dark disabled:cursor-wait disabled:opacity-70 sm:px-3.5"
            >
              {saving ? <Loader2 size={14} className="animate-spin-slow" /> : <Save size={14} />}
              {saveLabel}
            </button>
          </div>
        </div>
      </header>
    </>
  )
}
