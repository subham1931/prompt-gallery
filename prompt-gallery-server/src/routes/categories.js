import { Router } from 'express'
import { Category } from '../models/Category.js'
import { Prompt } from '../models/Prompt.js'

const router = Router()

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/** GET /api/categories — list with published prompt counts */
router.get('/', async (_req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean()

    const counts = await Prompt.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: { $toLower: '$category' }, count: { $sum: 1 } } },
    ])

    const countMap = Object.fromEntries(
      counts.map((c) => [c._id, c.count]),
    )

    const data = categories.map((c) => ({
      id: String(c._id),
      name: c.name,
      slug: c.slug,
      icon: c.icon,
      count: countMap[c.name.toLowerCase()] || 0,
    }))

    res.json({ data })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to list categories' })
  }
})

/** GET /api/categories/:slug */
router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug.toLowerCase() }).lean()
    if (!category) {
      res.status(404).json({ error: 'Category not found' })
      return
    }

    const count = await Prompt.countDocuments({
      status: 'published',
      category: new RegExp(`^${category.name}$`, 'i'),
    })

    res.json({
      data: {
        id: String(category._id),
        name: category.name,
        slug: category.slug,
        icon: category.icon,
        count,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch category' })
  }
})

/** POST /api/categories — create (admin, no auth MVP) */
router.post('/', async (req, res) => {
  try {
    const name = String(req.body.name || '').trim()
    if (!name) {
      res.status(400).json({ error: 'name is required' })
      return
    }

    const slug = req.body.slug ? slugify(req.body.slug) : slugify(name)
    const doc = await Category.create({
      name,
      slug,
      icon: req.body.icon || name.slice(0, 2),
    })

    res.status(201).json({
      data: {
        id: String(doc._id),
        name: doc.name,
        slug: doc.slug,
        icon: doc.icon,
        count: 0,
      },
    })
  } catch (err) {
    console.error(err)
    if (err?.code === 11000) {
      res.status(409).json({ error: 'A category with this name or slug already exists' })
      return
    }
    res.status(500).json({ error: err.message || 'Failed to create category' })
  }
})

export default router
