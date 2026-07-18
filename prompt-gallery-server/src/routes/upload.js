import { Router } from 'express'
import { upload } from '../middleware/upload.js'
import { uploadBuffer } from '../utils/cloudinary.js'
import { getErrorMessage } from '../utils/errors.js'
import { isNetworkUploadError, saveLocalUpload } from '../utils/localUpload.js'

const router = Router()

function allowLocalFallback() {
  // Local disk fallback for when Cloudinary is blocked (common on some networks).
  // Prefer Cloudinary in production unless explicitly enabled.
  if (process.env.UPLOAD_FALLBACK === 'local') return true
  if (process.env.UPLOAD_DRIVER === 'local') return true
  return process.env.NODE_ENV !== 'production'
}

/** POST /api/upload — multipart field "image" */
router.post('/', (req, res) => {
  upload.single('image')(req, res, async (multerErr) => {
    try {
      if (multerErr) {
        res.status(400).json({ error: getErrorMessage(multerErr, 'Invalid image upload') })
        return
      }

      if (!req.file) {
        res.status(400).json({ error: 'image file is required' })
        return
      }

      const forceLocal = process.env.UPLOAD_DRIVER === 'local'
      let result

      if (forceLocal) {
        result = await saveLocalUpload(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype,
        )
      } else {
        try {
          result = await uploadBuffer(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype,
          )
          result = { ...result, storage: 'cloudinary' }
        } catch (cloudErr) {
          if (allowLocalFallback() && isNetworkUploadError(cloudErr)) {
            console.warn(
              'Cloudinary unreachable — saving image locally instead:',
              getErrorMessage(cloudErr),
            )
            result = await saveLocalUpload(
              req.file.buffer,
              req.file.originalname,
              req.file.mimetype,
            )
          } else {
            throw cloudErr
          }
        }
      }

      res.status(201).json({
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          filename: req.file.originalname,
          storage: result.storage || 'cloudinary',
        },
      })
    } catch (err) {
      console.error('Upload error:', err)
      res.status(500).json({ error: getErrorMessage(err, 'Upload failed') })
    }
  })
})

export default router
