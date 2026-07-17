import { Link } from 'react-router-dom'
import { Save } from 'lucide-react'
import { Badge } from './ui/Badge'

export function TopBar({ title, seoScore, onSave }) {
  const tone = seoScore >= 80 ? 'green' : 'orange'

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-6 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[12px] text-mute-light">
            <Link to="/" className="text-mute no-underline hover:text-ink">
              Prompts
            </Link>
            <span>/</span>
            <span>Editor</span>
          </div>
          <div className="flex min-w-0 items-center gap-2">
            <h1 className="m-0 max-w-[420px] truncate text-[15px] font-semibold tracking-[-0.01em]">
              {title || 'Untitled prompt'}
            </h1>
            <Badge tone={tone}>SEO {seoScore}</Badge>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/"
            className="rounded-lg border border-border bg-white px-3.5 py-2 text-[13px] font-medium text-mute no-underline transition-colors hover:bg-[#F1F2F5] hover:text-ink"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={onSave}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border-none bg-orange px-3.5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-orange-dark"
          >
            <Save size={14} /> Save
          </button>
        </div>
      </div>
    </header>
  )
}
