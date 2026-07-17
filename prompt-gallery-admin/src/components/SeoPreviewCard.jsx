import { Eye } from 'lucide-react'
import { Card } from './ui/Card'

export function SeoPreviewCard({ slug, metaTitle, metaDesc, ogTitle, ogDesc, featuredImage }) {
  return (
    <Card title="Preview" description="Search result and social card." defaultOpen={false}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center gap-1 text-[11px] font-semibold tracking-[0.04em] text-mute-light uppercase">
            <Eye size={11} /> Search
          </div>
          <div className="rounded-lg border border-border p-3.5 font-[arial,sans-serif]">
            <div className="truncate text-[12px] text-[#202124]">
              promptgallery.com › prompts › {slug}
            </div>
            <div className="my-0.5 line-clamp-2 text-[16px] font-medium leading-snug text-[#1a0dab]">
              {metaTitle}
            </div>
            <div className="line-clamp-2 text-[13px] leading-normal text-[#4d5156]">
              {metaDesc}
            </div>
          </div>
        </div>

        <div>
          <div className="mb-2 text-[11px] font-semibold tracking-[0.04em] text-mute-light uppercase">
            Social
          </div>
          <div className="overflow-hidden rounded-lg border border-border">
            {featuredImage ? (
              <img src={featuredImage} alt="" className="block h-[120px] w-full object-cover" />
            ) : (
              <div className="flex h-[120px] w-full items-center justify-center bg-[#F1F2F5] text-xs text-mute-light">
                No image
              </div>
            )}
            <div className="bg-[#F7F7F8] p-3">
              <div className="text-[10px] tracking-wide text-mute-light uppercase">
                promptgallery.com
              </div>
              <div className="mt-0.5 line-clamp-1 text-[13px] font-semibold">{ogTitle}</div>
              <div className="line-clamp-2 text-xs text-mute">{ogDesc}</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
