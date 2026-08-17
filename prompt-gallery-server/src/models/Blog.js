import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    author: { type: String, required: true, default: 'Prompt Gallery Team', trim: true },
    factCheckBy: { type: String, default: '', trim: true },
    category: { type: String, required: true, trim: true },
    coverImage: { type: String, default: '' },
    imageAltText: { type: String, default: '' },
    description: { type: String, required: true }, // Full Rich Text/HTML content
    shortDescription: { type: String, required: true, trim: true },
    h1: { type: String, default: '', trim: true },
    metaTitle: { type: String, default: '', trim: true },
    metaDesc: { type: String, default: '', trim: true },
    ogTitle: { type: String, default: '', trim: true },
    ogDesc: { type: String, default: '', trim: true },
    keywords: { type: [String], default: [] },
    isPopular: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
    },
  },
  { timestamps: true }
)

blogSchema.index({ title: 'text', description: 'text', keywords: 'text' })
blogSchema.index({ category: 1, status: 1 })
blogSchema.index({ isPopular: 1 })

export const Blog = mongoose.model('Blog', blogSchema)
