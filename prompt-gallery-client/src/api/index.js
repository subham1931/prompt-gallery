import { prompts, categories, popularFilters } from '../data/mockData'

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const categorySlugMap = Object.fromEntries(
  categories.map((c) => [c.name.toLowerCase(), c.slug])
)

export function getCategorySlug(name) {
  return categorySlugMap[name.toLowerCase()] || slugify(name)
}

export function getPrompts({ sort = 'latest', filter = null, limit = null } = {}) {
  let result = [...prompts]

  if (filter) {
    const filterLower = filter.toLowerCase()
    result = result.filter(
      (p) =>
        p.category.toLowerCase() === filterLower ||
        p.tags.some((t) => t.toLowerCase() === filterLower)
    )
  }

  if (sort === 'trending') {
    result.sort((a, b) => b.likeCount - a.likeCount)
  } else if (sort === 'popular') {
    result.sort((a, b) => b.likeCount * 0.7 + new Date(b.date) - (a.likeCount * 0.7 + new Date(a.date)))
  } else {
    result.sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  if (limit) {
    result = result.slice(0, limit)
  }

  return Promise.resolve(result)
}

export function getPromptBySlug(slug) {
  const prompt = prompts.find((p) => p.slug === slug)
  return Promise.resolve(prompt || null)
}

export function getCategories() {
  return Promise.resolve(categories)
}

export function getCategoryBySlug(slug) {
  const category = categories.find((c) => c.slug === slug)
  return Promise.resolve(category || null)
}

export function getPromptsByCategorySlug(slug) {
  const category = categories.find((c) => c.slug === slug)
  if (!category) return Promise.resolve([])

  const result = prompts.filter(
    (p) =>
      getCategorySlug(p.category) === slug ||
      p.tags.some((t) => getCategorySlug(t) === slug)
  )
  return Promise.resolve(result)
}

export function getRelatedPrompts(slug, count = 5) {
  const current = prompts.find((p) => p.slug === slug)
  const others = prompts.filter((p) => p.slug !== slug)

  if (!current) {
    return Promise.resolve(others.slice(0, count))
  }

  const scored = others.map((p) => {
    const sharedTags = p.tags.filter((t) => current.tags.includes(t)).length
    const sameCategory = p.category === current.category ? 2 : 0
    return { prompt: p, score: sharedTags + sameCategory }
  })

  scored.sort((a, b) => b.score - a.score)
  const related = scored.slice(0, count).map((s) => s.prompt)

  if (related.length < count) {
    const remaining = others.filter((p) => !related.includes(p))
    related.push(...remaining.slice(0, count - related.length))
  }

  return Promise.resolve(related)
}

export function getPopularFilters() {
  return Promise.resolve(popularFilters)
}

export function searchPrompts(query) {
  if (!query.trim()) return Promise.resolve(prompts)
  const q = query.toLowerCase()
  const result = prompts.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
  )
  return Promise.resolve(result)
}
