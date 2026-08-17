import { Router } from 'express'
import mongoose from 'mongoose'
import { Prompt } from '../models/Prompt.js'
import { optionalAuth, requireAuth, requireStaff } from '../middleware/auth.js'

const router = Router()

function isStaff(user) {
  return user && (user.role === 'admin' || user.role === 'superadmin')
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function normalizeBody(body = {}) {
  const tags = Array.isArray(body.tags)
    ? body.tags
    : String(body.tags || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

  const images = (body.images || []).map((img) => ({
    url: img.url || img.src || '',
    altText: img.altText || '',
    title: img.title || '',
    filename: img.filename || '',
    publicId: img.publicId || '',
  })).filter((img) => img.url)

  const validStatuses = ['draft', 'published', 'scheduled']
  const status = validStatuses.includes(body.status) ? body.status : 'published'
  const scheduledAt = status === 'scheduled' && body.scheduledAt ? new Date(body.scheduledAt) : null

  return {
    title: body.title,
    slug: body.slug ? slugify(body.slug) : slugify(body.title),
    promptText: body.promptText,
    description: body.description || body.excerpt || '',
    excerpt: body.description || body.excerpt || '',
    category: body.category,
    tags,
    tool: body.tool || body.aiModel || 'ChatGPT',
    author: body.author || 'Prompt Gallery',
    trending: Boolean(body.trending),
    likeCount: typeof body.likeCount === 'number' ? body.likeCount : undefined,
    aspect: body.aspect || 'portrait',
    status,
    scheduledAt,
    images,
    metaTitle: body.metaTitle || '',
    metaDesc: body.metaDesc || '',
    focusKeyword: body.focusKeyword || '',
    secondaryKeywords: body.secondaryKeywords || '',
    canonicalUrl: body.canonicalUrl || '',
    robots: body.robots || 'Index',
    ogTitle: body.ogTitle || '',
    ogDesc: body.ogDesc || '',
    schemaChecks: body.schemaChecks || undefined,
  }
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  let ip = ''
  if (forwarded) {
    ip = String(forwarded).split(',')[0].trim()
  } else {
    ip = req.socket?.remoteAddress || req.ip || '127.0.0.1'
  }
  if (ip.startsWith('::ffff:')) {
    ip = ip.slice(7)
  }
  if (ip === '::1' || ip === 'localhost') {
    ip = '127.0.0.1'
  }
  return ip
}

/** GET /api/prompts */
router.get('/', optionalAuth, async (req, res) => {
  try {
    const clientIp = getClientIp(req)
    const {
      q,
      category,
      tool,
      trending,
      status,
      sort = 'latest',
      limit,
      page = '1',
    } = req.query

    const wantsNonPublic = status === 'all' || status === 'draft' || status === 'scheduled'
    if (wantsNonPublic && !isStaff(req.user)) {
      res.status(403).json({ error: 'Admin access required' })
      return
    }

    const filter = {}

    // Public default: published only. Admin can pass status=all, draft, scheduled, or published
    if (status === 'all') {
      // no status filter
    } else if (['draft', 'published', 'scheduled'].includes(status)) {
      filter.status = status
    } else {
      filter.status = 'published'
    }

    if (category) filter.category = new RegExp(`^${category}$`, 'i')
    if (tool) filter.tool = new RegExp(`^${tool}$`, 'i')
    if (trending === 'true' || trending === '1') filter.trending = true

    if (q && String(q).trim()) {
      const term = String(q).trim()
      filter.$or = [
        { title: new RegExp(term, 'i') },
        { excerpt: new RegExp(term, 'i') },
        { category: new RegExp(term, 'i') },
        { tags: new RegExp(term, 'i') },
        { promptText: new RegExp(term, 'i') },
      ]
    }

    let query = Prompt.find(filter)

    if (sort === 'trending') {
      query = query.sort({ trending: -1, createdAt: -1 })
    } else if (sort === 'popular') {
      query = query.sort({ likeCount: -1, createdAt: -1 })
    } else {
      query = query.sort({ createdAt: -1 })
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1)
    const limitNum = limit ? Math.min(100, parseInt(limit, 10) || 20) : null

    if (limitNum) {
      query = query.skip((pageNum - 1) * limitNum).limit(limitNum)
    }

    const [docs, total] = await Promise.all([
      query.exec(),
      Prompt.countDocuments(filter),
    ])

    res.json({
      data: docs.map((d) => d.toGalleryJSON(clientIp, req.user)),
      total,
      page: pageNum,
      limit: limitNum,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to list prompts' })
  }
})

/** GET /api/prompts/by-id/:id — admin edit load */
router.get('/by-id/:id', ...requireStaff, async (req, res) => {
  try {
    const doc = await Prompt.findById(req.params.id)
    if (!doc) {
      res.status(404).json({ error: 'Prompt not found' })
      return
    }
    res.json({ data: doc.toGalleryJSON() })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch prompt' })
  }
})

/** POST /api/prompts/:id/like — toggle like by user and/or IP */
router.post('/:id/like', optionalAuth, async (req, res) => {
  try {
    const paramId = String(req.params.id || '').trim()
    let prompt = null

    if (mongoose.Types.ObjectId.isValid(paramId)) {
      prompt = await Prompt.findById(paramId)
    }
    if (!prompt) {
      prompt = await Prompt.findOne({ slug: paramId.toLowerCase() })
    }

    if (!prompt) {
      res.status(404).json({ error: 'Prompt not found' })
      return
    }

    const clientIp = getClientIp(req)
    const promptId = String(prompt._id)
    if (!Array.isArray(prompt.likedIps)) {
      prompt.likedIps = []
    }

    let liked = false

    if (req.user) {
      const likedIds = (req.user.likedPromptIds || []).map(String)
      const alreadyUserLiked = likedIds.includes(promptId)
      const alreadyIpLiked = prompt.likedIps.includes(clientIp)

      if (alreadyUserLiked || alreadyIpLiked) {
        req.user.likedPromptIds = req.user.likedPromptIds.filter((id) => String(id) !== promptId)
        prompt.likedIps = prompt.likedIps.filter((ip) => ip !== clientIp)
        prompt.likeCount = Math.max(0, (prompt.likeCount || 0) - 1)
        liked = false
      } else {
        req.user.likedPromptIds.push(prompt._id)
        if (clientIp && !alreadyIpLiked) prompt.likedIps.push(clientIp)
        prompt.likeCount = (prompt.likeCount || 0) + 1
        liked = true
      }
      await Promise.all([req.user.save(), prompt.save()])
    } else {
      const alreadyIpLiked = prompt.likedIps.includes(clientIp)

      if (alreadyIpLiked) {
        prompt.likedIps = prompt.likedIps.filter((ip) => ip !== clientIp)
        prompt.likeCount = Math.max(0, (prompt.likeCount || 0) - 1)
        liked = false
      } else {
        if (clientIp) prompt.likedIps.push(clientIp)
        prompt.likeCount = (prompt.likeCount || 0) + 1
        liked = true
      }
      await prompt.save()
    }

    res.json({
      data: {
        liked,
        likeCount: prompt.likeCount,
        user: req.user ? req.user.toPublicJSON() : null,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || 'Failed to update like' })
  }
})

/** GET /api/prompts/:slug */
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const clientIp = getClientIp(req)
    const doc = await Prompt.findOne({ slug: req.params.slug.toLowerCase() })
    if (!doc) {
      res.status(404).json({ error: 'Prompt not found' })
      return
    }
    if (doc.status !== 'published') {
      if (req.query.includeDrafts !== '1' || !isStaff(req.user)) {
        res.status(404).json({ error: 'Prompt not found' })
        return
      }
    }
    res.json({ data: doc.toGalleryJSON(clientIp, req.user) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch prompt' })
  }
})

/** POST /api/prompts */
router.post('/', ...requireStaff, async (req, res) => {
  try {
    const payload = normalizeBody(req.body)
    if (!payload.title || !payload.promptText || !payload.category) {
      res.status(400).json({ error: 'title, promptText, and category are required' })
      return
    }

    const existing = await Prompt.findOne({ slug: payload.slug })
    if (existing) {
      res.status(409).json({ error: 'Slug already exists' })
      return
    }

    const doc = await Prompt.create(payload)
    res.status(201).json({ data: doc.toGalleryJSON() })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || 'Failed to create prompt' })
  }
})

/** PUT /api/prompts/:id */
router.put('/:id', ...requireStaff, async (req, res) => {
  try {
    const payload = normalizeBody(req.body)
    delete payload.likeCount

    if (payload.slug) {
      const clash = await Prompt.findOne({
        slug: payload.slug,
        _id: { $ne: req.params.id },
      })
      if (clash) {
        res.status(409).json({ error: 'Slug already exists' })
        return
      }
    }

    const doc = await Prompt.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    })

    if (!doc) {
      res.status(404).json({ error: 'Prompt not found' })
      return
    }

    res.json({ data: doc.toGalleryJSON() })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || 'Failed to update prompt' })
  }
})

/** DELETE /api/prompts/:id */
router.delete('/:id', ...requireStaff, async (req, res) => {
  try {
    const doc = await Prompt.findByIdAndDelete(req.params.id)
    if (!doc) {
      res.status(404).json({ error: 'Prompt not found' })
      return
    }
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete prompt' })
  }
})

export default router
