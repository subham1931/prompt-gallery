import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    altText: { type: String, default: '' },
    title: { type: String, default: '' },
    filename: { type: String, default: '' },
    publicId: { type: String, default: '' },
  },
  { _id: false },
)

const promptSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    promptText: { type: String, required: true },
    description: { type: String, default: '' },
    excerpt: { type: String, default: '' },
    category: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    tool: { type: String, default: 'ChatGPT', trim: true },
    author: { type: String, default: 'Prompt Gallery', trim: true },
    trending: { type: Boolean, default: false },
    likeCount: { type: Number, default: 0 },
    likedIps: { type: [String], default: [] },
    aspect: {
      type: String,
      enum: ['portrait', 'square', 'tall', 'wide', 'landscape'],
      default: 'portrait',
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled'],
      default: 'published',
    },
    scheduledAt: { type: Date, default: null },
    faqs: [
      {
        question: { type: String, default: '' },
        answer: { type: String, default: '' },
      },
    ],
    images: { type: [imageSchema], default: [] },
    metaTitle: { type: String, default: '' },
    metaDesc: { type: String, default: '' },
    focusKeyword: { type: String, default: '' },
    secondaryKeywords: { type: String, default: '' },
    canonicalUrl: { type: String, default: '' },
    robots: { type: String, default: 'Index' },
    ogTitle: { type: String, default: '' },
    ogDesc: { type: String, default: '' },
    schemaChecks: {
      Article: { type: Boolean, default: true },
      FAQPage: { type: Boolean, default: true },
      Breadcrumb: { type: Boolean, default: true },
      BlogPosting: { type: Boolean, default: false },
    },
  },
  { timestamps: true },
)

promptSchema.index({ title: 'text', excerpt: 'text', tags: 'text', category: 'text' })
promptSchema.index({ category: 1, status: 1 })
promptSchema.index({ tool: 1 })
promptSchema.index({ trending: 1 })
promptSchema.index({ likedIps: 1 })

promptSchema.pre('validate', function ensureExcerpt(next) {
  if (!this.excerpt && this.promptText) {
    this.excerpt = this.promptText.slice(0, 140) + (this.promptText.length > 140 ? '...' : '')
  }
  next()
})

promptSchema.methods.toGalleryJSON = function toGalleryJSON(clientIp = '', user = null) {
  const obj = this.toObject({ virtuals: false })
  const userLiked = Boolean(user && user.likedPromptIds?.map(String).includes(String(obj._id)))
  const ipLiked = Boolean(clientIp && obj.likedIps?.includes(clientIp))
  return {
    id: String(obj._id),
    slug: obj.slug,
    title: obj.title,
    category: obj.category,
    tags: obj.tags,
    tool: obj.tool,
    author: obj.author,
    date: obj.createdAt ? new Date(obj.createdAt).toISOString().slice(0, 10) : '',
    liked: userLiked || ipLiked,
    likeCount: obj.likeCount || 0,
    image: obj.images?.[0]?.url || '',
    aspect: obj.aspect,
    description: obj.description || obj.excerpt || '',
    excerpt: obj.description || obj.excerpt || '',
    promptText: obj.promptText,
    trending: obj.trending,
    status: obj.status,
    scheduledAt: obj.scheduledAt ? new Date(obj.scheduledAt).toISOString() : null,
    images: obj.images,
    metaTitle: obj.metaTitle,
    metaDesc: obj.metaDesc,
    focusKeyword: obj.focusKeyword,
    secondaryKeywords: obj.secondaryKeywords,
    canonicalUrl: obj.canonicalUrl,
    robots: obj.robots,
    ogTitle: obj.ogTitle,
    ogDesc: obj.ogDesc,
    schemaChecks: obj.schemaChecks,
    faqs: obj.faqs || [],
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  }
}

export const Prompt = mongoose.model('Prompt', promptSchema)
