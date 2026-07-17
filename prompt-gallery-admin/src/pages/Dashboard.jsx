import { Link } from 'react-router-dom'
import { Plus, Search, LayoutDashboard } from 'lucide-react'
import { Badge } from '../components/ui/Badge'

const RECENT = [
  {
    id: '1',
    title: 'Cinematic Portrait with Dramatic Lighting',
    slug: 'cinematic-portrait-dramatic-lighting',
    model: 'ChatGPT',
    status: 'Published',
    seo: 86,
  },
  {
    id: '2',
    title: 'Elegant Woman Editorial',
    slug: 'elegant-woman-editorial',
    model: 'ChatGPT',
    status: 'Draft',
    seo: 62,
  },
  {
    id: '3',
    title: 'Couple at Sunset Beach',
    slug: 'couple-sunset-beach',
    model: 'Gemini',
    status: 'Published',
    seo: 74,
  },
]

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <div className="sticky top-0 z-40 border-b border-border bg-[rgba(248,249,251,0.85)] backdrop-blur-[10px]">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-6 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-orange">
              <LayoutDashboard size={17} color="#fff" />
            </div>
            <div>
              <div className="text-[11.5px] font-semibold tracking-[0.05em] text-mute-light uppercase">
                Admin
              </div>
              <div className="text-[14.5px] font-bold">Prompt Gallery CMS</div>
            </div>
          </div>
          <Link
            to="/prompts/new"
            className="flex items-center gap-[7px] rounded-[10px] bg-orange px-[17px] py-[9px] text-[13px] font-bold text-white no-underline shadow-[0_2px_8px_rgba(255,122,0,0.35)]"
          >
            <Plus size={15} /> New prompt
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-[1180px] px-6 pt-[26px] pb-20">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="m-0 text-xl font-bold tracking-[-0.02em]">Prompts</h1>
            <p className="mt-1 mb-0 text-[13px] text-mute">
              Create and optimize prompts for the public gallery.
            </p>
          </div>
          <div className="relative max-w-sm flex-1">
            <Search
              size={15}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-mute-light"
            />
            <input
              type="search"
              placeholder="Search prompts..."
              className="w-full rounded-[10px] border border-border bg-white py-2.5 pr-3 pl-9 text-[13.5px] outline-none focus:border-orange focus:shadow-[0_0_0_3px_var(--color-orange-tint)]"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_1px_2px_rgba(16,24,40,0.03),0_1px_12px_rgba(16,24,40,0.04)]">
          <div className="hidden grid-cols-[1fr_120px_110px_80px_90px] gap-3 border-b border-border bg-[#FCFCFD] px-5 py-3 text-[11.5px] font-bold tracking-[0.04em] text-mute-light uppercase md:grid">
            <span>Title</span>
            <span>Model</span>
            <span>Status</span>
            <span>SEO</span>
            <span className="text-right">Action</span>
          </div>
          {RECENT.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-1 gap-2 border-b border-border px-5 py-4 last:border-b-0 md:grid-cols-[1fr_120px_110px_80px_90px] md:items-center md:gap-3"
            >
              <div className="min-w-0">
                <div className="truncate text-[13.5px] font-semibold">{row.title}</div>
                <div className="truncate text-xs text-mute-light">/prompts/{row.slug}</div>
              </div>
              <div className="text-[13px] text-mute">{row.model}</div>
              <div>
                <Badge tone={row.status === 'Published' ? 'green' : 'default'}>
                  {row.status}
                </Badge>
              </div>
              <div>
                <Badge tone={row.seo >= 80 ? 'green' : 'orange'}>{row.seo}</Badge>
              </div>
              <div className="md:text-right">
                <Link
                  to="/prompts/new"
                  className="text-[13px] font-semibold text-orange-dark no-underline"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
