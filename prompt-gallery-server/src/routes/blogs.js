import { Router } from 'express'
import { Blog } from '../models/Blog.js'
import { requireStaff } from '../middleware/auth.js'

const router = Router()

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function normalizeBlogBody(body = {}) {
  const keywords = Array.isArray(body.keywords)
    ? body.keywords
    : String(body.keywords || '')
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean)

  const title = String(body.title || '').trim()
  const slug = body.slug ? slugify(body.slug) : slugify(title)

  return {
    title,
    slug,
    author: String(body.author || 'Prompt Gallery Team').trim(),
    factCheckBy: String(body.factCheckBy || '').trim(),
    category: String(body.category || 'Generative AI').trim(),
    coverImage: String(body.coverImage || body.image || '').trim(),
    imageAltText: String(body.imageAltText || '').trim(),
    description: String(body.description || '').trim(),
    shortDescription: String(body.shortDescription || '').trim(),
    h1: String(body.h1 || title).trim(),
    metaTitle: String(body.metaTitle || title).trim(),
    metaDesc: String(body.metaDesc || body.shortDescription || '').trim(),
    ogTitle: String(body.ogTitle || body.metaTitle || title).trim(),
    ogDesc: String(body.ogDesc || body.metaDesc || '').trim(),
    keywords,
    isPopular: Boolean(body.isPopular),
    status: body.status === 'draft' ? 'draft' : 'published',
  }
}

// GET /api/blogs (Public)
router.get('/', async (req, res, next) => {
  try {
    const { category, search, popular, limit = 50 } = req.query
    const filter = {}

    if (category) filter.category = category
    if (popular === 'true') filter.isPopular = true
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { keywords: { $in: [new RegExp(search, 'i')] } },
      ]
    }

    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit) || 50)

    res.json({ data: blogs })
  } catch (err) {
    next(err)
  }
})

// GET /api/blogs/:slug (Public)
router.get('/:slug', async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' })
    }
    res.json({ data: blog })
  } catch (err) {
    next(err)
  }
})

// POST /api/blogs (Staff Protected)
router.post('/', requireStaff, async (req, res, next) => {
  try {
    const data = normalizeBlogBody(req.body)
    if (!data.title) return res.status(400).json({ error: 'Title is required' })
    if (!data.description) return res.status(400).json({ error: 'Description content is required' })

    const existing = await Blog.findOne({ slug: data.slug })
    if (existing) {
      data.slug = `${data.slug}-${Math.floor(Math.random() * 1000)}`
    }

    const blog = await Blog.create(data)
    res.status(201).json({ data: blog })
  } catch (err) {
    next(err)
  }
})

// PUT /api/blogs/:id (Staff Protected)
router.put('/:id', requireStaff, async (req, res, next) => {
  try {
    const data = normalizeBlogBody(req.body)
    const blog = await Blog.findByIdAndUpdate(req.params.id, data, { new: true })
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' })
    }
    res.json({ data: blog })
  } catch (err) {
    next(err)
  }
})

// DELETE /api/blogs/:id (Staff Protected)
router.delete('/:id', requireStaff, async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id)
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' })
    }
    res.json({ data: { message: 'Blog deleted' } })
  } catch (err) {
    next(err)
  }
})

export default router
