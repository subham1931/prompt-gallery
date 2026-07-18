import fs from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const UPLOADS_DIR = path.resolve(__dirname, '../../uploads')

function extFrom(mimetype = '', filename = '') {
  const fromName = path.extname(filename || '').toLowerCase()
  if (fromName) return fromName
  if (mimetype.includes('png')) return '.png'
  if (mimetype.includes('webp')) return '.webp'
  if (mimetype.includes('gif')) return '.gif'
  return '.jpg'
}

export async function saveLocalUpload(buffer, filename, mimetype) {
  await fs.mkdir(UPLOADS_DIR, { recursive: true })

  const safeExt = extFrom(mimetype, filename)
  const publicId = `local/${randomUUID()}${safeExt}`
  const diskName = publicId.replace(/\//g, '-')
  const fullPath = path.join(UPLOADS_DIR, diskName)

  await fs.writeFile(fullPath, buffer)

  const base = (process.env.PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 4000}`).replace(
    /\/$/,
    '',
  )

  return {
    secure_url: `${base}/uploads/${diskName}`,
    public_id: publicId,
    width: undefined,
    height: undefined,
    format: safeExt.replace('.', ''),
    storage: 'local',
  }
}

export function isNetworkUploadError(err) {
  const msg = String(err?.message || err || '')
  return /timeout|ETIMEDOUT|ENOTFOUND|ECONNRESET|network|Cannot reach Cloudinary|AggregateError/i.test(
    msg,
  )
}
