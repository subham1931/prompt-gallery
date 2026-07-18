const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '')

async function request(path) {
  const res = await fetch(`${API_URL}${path}`)
  const payload = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(payload.error || `Request failed (${res.status})`)
  }
  return payload
}

const slugify = (text) =>
  String(text || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

let categoryCache = null

async function loadCategories() {
  if (categoryCache) return categoryCache
  const { data } = await request('/api/categories')
  categoryCache = data || []
  return categoryCache
}

export function getCategorySlug(name) {
  return slugify(name)
}

export async function getPrompts({ sort = 'latest', filter = null, limit = null } = {}) {
  const params = new URLSearchParams()
  params.set('sort', sort === 'popular' ? 'popular' : sort === 'trending' ? 'trending' : 'latest')
  if (limit) params.set('limit', String(limit))
  if (filter) params.set('category', filter)

  const { data } = await request(`/api/prompts?${params}`)
  let result = data || []

  // Tag-based filter fallback if category name didn't match enough
  if (filter) {
    const filterLower = filter.toLowerCase()
    const byCategory = result.filter((p) => p.category?.toLowerCase() === filterLower)
    if (byCategory.length) {
      result = byCategory
    } else {
      // Refetch all published and filter by tag locally for browse chips
      const all = await request('/api/prompts?sort=latest')
      result = (all.data || []).filter(
        (p) =>
          p.category?.toLowerCase() === filterLower ||
          (p.tags || []).some((t) => t.toLowerCase() === filterLower),
      )
      if (sort === 'trending' || sort === 'popular') {
        result.sort((a, b) => b.likeCount - a.likeCount)
      }
      if (limit) result = result.slice(0, limit)
    }
  }

  return result
}

export async function getPromptBySlug(slug) {
  try {
    const { data } = await request(`/api/prompts/${encodeURIComponent(slug)}`)
    return data
  } catch {
    return null
  }
}

export async function getCategories() {
  return loadCategories()
}

export async function getCategoryBySlug(slug) {
  const cats = await loadCategories()
  return cats.find((c) => c.slug === slug) || null
}

export async function getPromptsByCategorySlug(slug) {
  const category = await getCategoryBySlug(slug)
  if (!category) return []

  const { data } = await request(
    `/api/prompts?category=${encodeURIComponent(category.name)}&sort=latest`,
  )
  let result = data || []

  // Also include prompts tagged with this category name/slug
  if (result.length === 0) {
    const all = await request('/api/prompts?sort=latest')
    result = (all.data || []).filter(
      (p) =>
        getCategorySlug(p.category) === slug ||
        (p.tags || []).some((t) => getCategorySlug(t) === slug),
    )
  }

  return result
}

export async function getRelatedPrompts(slug, count = 5) {
  const current = await getPromptBySlug(slug)
  const { data: others } = await request('/api/prompts?sort=latest&limit=50')
  const pool = (others || []).filter((p) => p.slug !== slug)

  if (!current) return pool.slice(0, count)

  const scored = pool.map((p) => {
    const sharedTags = (p.tags || []).filter((t) => (current.tags || []).includes(t)).length
    const sameCategory = p.category === current.category ? 2 : 0
    return { prompt: p, score: sharedTags + sameCategory }
  })

  scored.sort((a, b) => b.score - a.score)
  const related = scored.slice(0, count).map((s) => s.prompt)

  if (related.length < count) {
    const remaining = pool.filter((p) => !related.includes(p))
    related.push(...remaining.slice(0, count - related.length))
  }

  return related
}

export async function getPopularFilters() {
  const cats = await loadCategories()
  const preferred = ['Men', 'Woman', 'Couple', 'Family', 'Birthday']
  const names = cats.map((c) => c.name)
  const filters = preferred.filter((n) => names.includes(n))
  return filters.length ? filters : names.slice(0, 5)
}

export async function searchPrompts(query) {
  if (!query.trim()) {
    const { data } = await request('/api/prompts?sort=latest')
    return data || []
  }
  const { data } = await request(`/api/prompts?q=${encodeURIComponent(query.trim())}&sort=latest`)
  return data || []
}
