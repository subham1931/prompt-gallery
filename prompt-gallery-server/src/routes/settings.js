import { Router } from 'express'
import { Settings } from '../models/Settings.js'
import { optionalAuth, requireStaff } from '../middleware/auth.js'

const router = Router()

const VALID_ACCENTS = ['orange', 'green', 'blue', 'purple']

/** GET /api/settings/theme — fetch active theme accent */
router.get('/theme', optionalAuth, async (_req, res) => {
  try {
    let settings = await Settings.findOne({ key: 'site_settings' })
    if (!settings) {
      settings = await Settings.create({ key: 'site_settings', themeAccent: 'orange' })
    }
    res.json({
      data: {
        themeAccent: settings.themeAccent || 'orange',
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch theme settings' })
  }
})

/** PUT /api/settings/theme — update active theme accent (staff required) */
router.put('/theme', ...requireStaff, async (req, res) => {
  try {
    const { themeAccent } = req.body || {}
    if (!themeAccent || !VALID_ACCENTS.includes(themeAccent)) {
      res.status(400).json({
        error: `Invalid themeAccent. Must be one of: ${VALID_ACCENTS.join(', ')}`,
      })
      return
    }

    let settings = await Settings.findOne({ key: 'site_settings' })
    if (!settings) {
      settings = new Settings({ key: 'site_settings', themeAccent })
    } else {
      settings.themeAccent = themeAccent
    }

    await settings.save()

    res.json({
      data: {
        themeAccent: settings.themeAccent,
      },
      message: 'Theme accent updated successfully',
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || 'Failed to update theme settings' })
  }
})

export default router
