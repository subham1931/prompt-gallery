import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'

export function UploadBox({ src, onFile, compact = false }) {
  const [drag, setDrag] = useState(false)
  const inputRef = useRef(null)

  const handleFiles = (files) => {
    const file = files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    onFile(file)
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files)
          e.target.value = ''
        }}
      />
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDrag(true)
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDrag(false)
          handleFiles(e.dataTransfer.files)
        }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer overflow-hidden rounded-xl border-[1.5px] border-dashed transition-all duration-150 ${
          drag ? 'border-orange bg-orange-tint' : 'border-border bg-surface-muted'
        }`}
      >
        {src ? (
          <div className="flex items-center gap-3 p-3">
            <img src={src} alt="" className="h-14 w-14 rounded-lg object-cover" />
            <div className="flex-1">
              <div className="text-[12.5px] font-semibold">Click or drop to replace</div>
              <div className="text-[11.5px] text-mute-light">JPG, PNG, WebP up to 5MB</div>
            </div>
            <Upload size={16} className="text-mute-light" />
          </div>
        ) : (
          <div
            className={`flex flex-col items-center justify-center gap-1.5 ${
              compact ? 'p-[18px]' : 'p-[26px]'
            }`}
          >
            <Upload size={compact ? 16 : 20} className="text-mute-light" />
            <div className="text-[12.5px] font-semibold text-mute">
              Drag & drop or click to upload
            </div>
          </div>
        )}
      </div>
    </>
  )
}
