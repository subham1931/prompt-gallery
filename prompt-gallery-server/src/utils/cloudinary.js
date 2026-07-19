import { v2 as cloudinary } from 'cloudinary'
import { getErrorMessage } from './errors.js'

export function configureCloudinary() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.warn('Cloudinary env vars missing — /api/upload will fail until configured')
    return
  }

  if (!/^\d+$/.test(String(CLOUDINARY_API_KEY).trim())) {
    console.warn(
      'CLOUDINARY_API_KEY should be a numeric key from the Cloudinary dashboard (not the cloud name or folder).',
    )
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: String(CLOUDINARY_API_KEY).trim(),
    api_secret: String(CLOUDINARY_API_SECRET).trim(),
    secure: true,
  })
}

function sanitizePublicId(filename = '') {
  return filename
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export async function uploadBuffer(buffer, filename, mimetype = 'image/jpeg') {
  const b64 = buffer.toString('base64')
  const dataUri = `data:${mimetype};base64,${b64}`
  const publicId = sanitizePublicId(filename)

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'prompt-gallery',
      resource_type: 'image',
      public_id: publicId || undefined,
      overwrite: false,
      unique_filename: true,
      timeout: 60000,
    })
    return result
  } catch (err) {
    const msg = getErrorMessage(err, 'Cloudinary upload failed')
    if (/missing permissions|actions=\["create"\]|unexpected status code - 403/i.test(msg)) {
      throw new Error(
        'Cloudinary API key cannot upload (missing create permission). In Cloudinary → Settings → API Keys, use a key with upload/create access (or create a new unrestricted key), update CLOUDINARY_* env vars on Render, and redeploy.',
      )
    }
    if (/Invalid api_key|Must supply api_key|unauthorized|401/i.test(msg)) {
      throw new Error(
        'Cloudinary rejected the API key. Check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET, then restart the server.',
      )
    }
    if (/timeout|ETIMEDOUT|ENOTFOUND|AggregateError/i.test(msg)) {
      throw new Error(
        'Cannot reach Cloudinary (network timeout). Check firewall/VPN/ISP, or paste an Image URL instead of uploading.',
      )
    }
    throw new Error(msg)
  }
}

export { cloudinary }
