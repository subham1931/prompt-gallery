export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function scoreColor(score) {
  if (score >= 80) return 'var(--color-green)'
  if (score >= 50) return 'var(--color-orange-dark)'
  return 'var(--color-red)'
}

export function computeSeoScore({
  metaTitle,
  metaDesc,
  focusKeyword,
  slug,
  featuredAlt,
  aiModel,
  schemaChecks,
}) {
  let score = 0

  if (metaTitle.length >= 40 && metaTitle.length <= 60) score += 20
  else if (metaTitle.length > 0) score += 10

  if (metaDesc.length >= 120 && metaDesc.length <= 160) score += 20
  else if (metaDesc.length > 0) score += 10

  if (focusKeyword && metaTitle.toLowerCase().includes(focusKeyword.toLowerCase())) score += 12
  if (focusKeyword && metaDesc.toLowerCase().includes(focusKeyword.toLowerCase())) score += 8
  if (slug && focusKeyword && slug.includes(focusKeyword.split(' ')[0])) score += 8
  if ((featuredAlt || '').length > 5) score += 10
  if (metaTitle.toLowerCase().includes(aiModel.toLowerCase())) score += 12
  if (schemaChecks.Article && !schemaChecks.BlogPosting) score += 5
  if (schemaChecks.FAQPage) score += 5

  return Math.min(score, 100)
}

export function buildSeoChecklist({
  metaTitle,
  metaDesc,
  focusKeyword,
  featuredAlt,
  aiModel,
  schemaChecks,
}) {
  return [
    {
      ok: metaTitle.length >= 40 && metaTitle.length <= 60,
      label: 'Meta title is 40-60 characters',
    },
    {
      ok: metaDesc.length >= 120 && metaDesc.length <= 160,
      label: 'Meta description is 120-160 characters',
    },
    {
      ok: metaTitle.toLowerCase().includes(aiModel.toLowerCase()),
      label: `Title mentions "${aiModel}"`,
    },
    {
      ok: !!focusKeyword && metaTitle.toLowerCase().includes(focusKeyword.toLowerCase()),
      label: 'Focus keyword appears in the title',
    },
    {
      ok: (featuredAlt || '').length > 5,
      label: 'Featured image has alt text',
    },
    {
      ok: schemaChecks.FAQPage,
      label: 'FAQPage schema enabled (rich snippet)',
    },
    {
      ok: schemaChecks.Article && !schemaChecks.BlogPosting,
      label: 'Article schema only (no duplicate BlogPosting)',
    },
  ]
}

export const AI_MODELS = ['ChatGPT', 'Gemini', 'Midjourney']
export const SCHEMAS = ['Article', 'FAQPage', 'Breadcrumb', 'BlogPosting']
export const CATEGORIES = [
  'Portraits',
  'Fashion & Editorial',
  'Photography',
  'Cinematic',
  'Lifestyle',
  'Digital Art',
  'Men',
  'Woman',
  'Business & Professional',
  'Black & White',
  'Couple',
  'Family',
  'Birthday',
  'Nature',
  'Vintage',
]
