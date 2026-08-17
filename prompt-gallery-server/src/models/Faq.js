import mongoose from 'mongoose'

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    category: { type: String, default: 'General', trim: true },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ['published', 'draft'], default: 'published' },
  },
  { timestamps: true }
)

export const Faq = mongoose.model('Faq', faqSchema)
