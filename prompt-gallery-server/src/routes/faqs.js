import express from 'express'
import { Faq } from '../models/Faq.js'

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const { category, search } = req.query
    const filter = {}
    if (category) filter.category = category
    if (search) {
      filter.$or = [
        { question: { $regex: search, $options: 'i' } },
        { answer: { $regex: search, $options: 'i' } },
      ]
    }
    const faqs = await Faq.find(filter).sort({ order: 1, createdAt: -1 })
    res.json({ data: faqs })
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { question, answer, category, order, status } = req.body
    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer are required' })
    }
    const faq = await Faq.create({
      question: question.trim(),
      answer: answer.trim(),
      category: category ? category.trim() : 'General',
      order: order || 0,
      status: status || 'published',
    })
    res.status(201).json({ data: faq })
  } catch (err) {
    next(err)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const { question, answer, category, order, status } = req.body
    const faq = await Faq.findByIdAndUpdate(
      req.params.id,
      {
        question,
        answer,
        category,
        order,
        status,
      },
      { new: true }
    )
    if (!faq) return res.status(404).json({ error: 'FAQ not found' })
    res.json({ data: faq })
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id)
    if (!faq) return res.status(404).json({ error: 'FAQ not found' })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

export default router
