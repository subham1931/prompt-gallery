import { Router } from 'express'
import { Prompt } from '../models/Prompt.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

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

  return {
    title: body.title,
    slug: body.slug ? slugify(body.slug) : slugify(body.title),
    promptText: body.promptText,
    excerpt: body.excerpt || '',
    category: body.category,
    tags,
    tool: body.tool || body.aiModel || 'ChatGPT',
    author: body.author || 'Prompt Gallery',
    trending: Boolean(body.trending),
    likeCount: typeof body.likeCount === 'number' ? body.likeCount : undefined,
    aspect: body.aspect || 'portrait',
    status: body.status === 'draft' ? 'draft' : 'published',
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

/** GET /api/prompts */
router.get('/', async (req, res) => {
  try {
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

    const filter = {}

    // Public default: published only. Admin can pass status=all or status=draft
    if (status === 'all') {
      // no status filter
    } else if (status === 'draft' || status === 'published') {
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

    if (sort === 'trending' || sort === 'popular') {
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
      data: docs.map((d) => d.toGalleryJSON()),
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
router.get('/by-id/:id', async (req, res) => {
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

/** POST /api/prompts/:id/like — toggle like (auth required) */
router.post('/:id/like', requireAuth, async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id)
    if (!prompt) {
      res.status(404).json({ error: 'Prompt not found' })
      return
    }

    const promptId = String(prompt._id)
    const likedIds = (req.user.likedPromptIds || []).map(String)
    const alreadyLiked = likedIds.includes(promptId)

    if (alreadyLiked) {
      req.user.likedPromptIds = req.user.likedPromptIds.filter((id) => String(id) !== promptId)
      prompt.likeCount = Math.max(0, (prompt.likeCount || 0) - 1)
    } else {
      req.user.likedPromptIds.push(prompt._id)
      prompt.likeCount = (prompt.likeCount || 0) + 1
    }

    await Promise.all([req.user.save(), prompt.save()])

    res.json({
      data: {
        liked: !alreadyLiked,
        likeCount: prompt.likeCount,
        user: req.user.toPublicJSON(),
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || 'Failed to update like' })
  }
})

/** GET /api/prompts/:slug */
router.get('/:slug', async (req, res) => {
  try {
    const doc = await Prompt.findOne({ slug: req.params.slug.toLowerCase() })
    if (!doc) {
      res.status(404).json({ error: 'Prompt not found' })
      return
    }
    if (doc.status !== 'published' && req.query.includeDrafts !== '1') {
      res.status(404).json({ error: 'Prompt not found' })
      return
    }
    res.json({ data: doc.toGalleryJSON() })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch prompt' })
  }
})

/** POST /api/prompts */
router.post('/', async (req, res) => {
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
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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
