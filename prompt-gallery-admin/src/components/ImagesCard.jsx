import { Plus, X } from 'lucide-react'
import { Card } from './ui/Card'
import { Field } from './ui/Field'
import { TextInput } from './ui/TextInput'
import { UploadBox } from './ui/UploadBox'

export function ImagesCard({ images, onAdd, onUpdate, onReplace, onRemove, error }) {
  return (
    <Card title="Images" description="Featured image, alt text, and filenames.">
      {error && (
        <p className="mb-3 mt-0 text-[12px] font-medium text-red">
          {typeof error === 'string' ? error : 'Upload failed'}
        </p>
      )}
      <div className="flex flex-col gap-3.5">
        {images.map((img, i) => (
          <div
            key={img.id}
            className={`rounded-xl border bg-surface-muted p-3.5 ${
              error && i === 0 ? 'border-red' : 'border-border'
            }`}
          >
            <div className="mb-2.5 flex items-center justify-between">
              <span className="text-[11.5px] font-bold tracking-[0.04em] text-mute-light uppercase">
                {i === 0 ? 'Featured image' : `Image ${i + 1}`}
              </span>
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemove(img.id)}
                  className="cursor-pointer border-none bg-transparent text-mute-light"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="mb-3">
              <UploadBox src={img.src} onFile={(file) => onReplace(img.id, file)} />
              {img.uploading && (
                <p className="mt-1.5 mb-0 text-[11px] text-mute-light">Uploading to Cloudinary…</p>
              )}
            </div>

            <Field
              label="Image URL"
              hint="Paste a direct image URL if upload fails (Cloudinary / CDN link)."
            >
              <TextInput
                value={img.src?.startsWith('blob:') ? '' : img.src || ''}
                placeholder="https://…"
                onChange={(e) => onUpdate(img.id, 'src', e.target.value.trim())}
              />
            </Field>

            <Field label="Alt text" hint="Used by screen readers and image search.">
              <TextInput
                value={img.altText}
                onChange={(e) => onUpdate(img.id, 'altText', e.target.value)}
              />
            </Field>

            <Field label="Image title">
              <TextInput
                value={img.title}
                onChange={(e) => onUpdate(img.id, 'title', e.target.value)}
              />
            </Field>

            <Field label="Filename" className="!mb-0">
              <TextInput
                value={img.filename}
                onChange={(e) => onUpdate(img.id, 'filename', e.target.value)}
              />
            </Field>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="mt-3.5 flex w-full cursor-pointer items-center justify-center gap-[7px] rounded-[10px] border-[1.5px] border-dashed border-border bg-transparent px-3.5 py-[9px] text-[13px] font-semibold text-orange-dark"
      >
        <Plus size={15} /> Add image
      </button>
    </Card>
  )
}
