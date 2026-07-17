import { Plus, X } from 'lucide-react'
import { Card } from './ui/Card'
import { Field } from './ui/Field'
import { TextInput } from './ui/TextInput'
import { UploadBox } from './ui/UploadBox'

export function ImagesCard({ images, onAdd, onUpdate, onReplace, onRemove }) {
  return (
    <Card title="Images" description="Featured image, alt text, and filenames.">
      <div className="flex flex-col gap-3.5">
        {images.map((img, i) => (
          <div
            key={img.id}
            className="rounded-xl border border-border bg-[#FCFCFD] p-3.5"
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
            </div>

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
