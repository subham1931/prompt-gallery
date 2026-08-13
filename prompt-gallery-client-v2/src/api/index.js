import { categories as mockCategories, prompts as mockPrompts } from '../data/mockData'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '')
const TOKEN_KEY = 'pg_auth_token'

export function getApiUrl() {
  return API_URL
}

export function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || ''
  } catch {
    return ''
  }
}

export function setStoredToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* ignore */
  }
}

async function request(path, options = {}) {
  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...options.headers,
  }

  const token = options.token ?? getStoredToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

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
  try {
    const { data } = await request('/api/categories')
    categoryCache = data && data.length ? data : mockCategories
  } catch {
    categoryCache = mockCategories
  }
  return categoryCache
}

export function getCategorySlug(name) {
  return slugify(name)
}

export async function signup({ name, email, password }) {
  const { data } = await request('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
  return data
}

export async function login({ email, password }) {
  const { data } = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  return data
}

export async function getMe(token) {
  const { data } = await request('/api/auth/me', { token })
  return data.user
}

export async function verifyPassword(password) {
  return request('/api/auth/verify-password', {
    method: 'POST',
    body: JSON.stringify({ password }),
  })
}

export async function changePassword({ oldPassword, newPassword, confirmPassword }) {
  return request('/api/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
  })
}

export async function togglePromptLike(promptId) {
  try {
    const { data } = await request(`/api/prompts/${encodeURIComponent(promptId)}/like`, {
      method: 'POST',
    })
    return data
  } catch {
    const p = mockPrompts.find((item) => String(item.id) === String(promptId))
    const currentLikes = p ? p.likeCount : 0
    return { liked: true, likeCount: currentLikes + 1 }
  }
}

export async function getPrompts({ sort = 'latest', filter = null, limit = null } = {}) {
  let result = []
  try {
    const params = new URLSearchParams()
    params.set('sort', sort === 'popular' ? 'popular' : sort === 'trending' ? 'trending' : 'latest')
    if (limit) params.set('limit', String(limit))
    if (filter) params.set('category', filter)

    const { data } = await request(`/api/prompts?${params}`)
    result = data || []
  } catch {
    let pool = [...mockPrompts]
    if (sort === 'popular') {
      pool.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
    } else if (sort === 'trending') {
      pool.sort((a, b) => ((b.likeCount || 0) + (b.id * 50)) % 73 - ((a.likeCount || 0) + (a.id * 50)) % 73)
    } else {
      pool.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    }
    result = pool
  }

  if (filter) {
    const filterLower = filter.toLowerCase()
    result = result.filter(
      (p) =>
        p.category?.toLowerCase() === filterLower ||
        (p.tags || []).some((t) => t.toLowerCase() === filterLower),
    )
  }

  if (limit) {
    result = result.slice(0, limit)
  }

  return result
}

export async function getPromptBySlug(slug) {
  try {
    const { data } = await request(`/api/prompts/${encodeURIComponent(slug)}`)
    return data
  } catch {
    return mockPrompts.find((p) => p.slug === slug) || null
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
  let result = []
  try {
    if (category) {
      const { data } = await request(
        `/api/prompts?category=${encodeURIComponent(category.name)}&sort=latest`,
      )
      result = data || []
    }
  } catch {
    result = mockPrompts.filter(
      (p) =>
        getCategorySlug(p.category) === slug ||
        (p.tags || []).some((t) => getCategorySlug(t) === slug),
    )
  }

  if (result.length === 0) {
    result = mockPrompts.filter(
      (p) =>
        getCategorySlug(p.category) === slug ||
        (p.tags || []).some((t) => getCategorySlug(t) === slug),
    )
  }

  return result
}

export async function getRelatedPrompts(slug, count = 5) {
  let pool = []
  try {
    const { data: others } = await request('/api/prompts?sort=latest&limit=50')
    pool = others || []
  } catch {
    pool = [...mockPrompts]
  }

  const current = pool.find((p) => p.slug === slug)
  const remainingPool = pool.filter((p) => p.slug !== slug)

  if (!current) return remainingPool.slice(0, count)

  const scored = remainingPool.map((p) => {
    const sharedTags = (p.tags || []).filter((t) => (current.tags || []).includes(t)).length
    const sameCategory = p.category === current.category ? 2 : 0
    return { prompt: p, score: sharedTags + sameCategory }
  })

  scored.sort((a, b) => b.score - a.score)
  const related = scored.slice(0, count).map((s) => s.prompt)

  if (related.length < count) {
    const extra = remainingPool.filter((p) => !related.includes(p))
    related.push(...extra.slice(0, count - related.length))
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
    return getPrompts({ sort: 'latest' })
  }
  try {
    const { data } = await request(`/api/prompts?q=${encodeURIComponent(query.trim())}&sort=latest`)
    if (data && data.length) return data
  } catch {
    /* fallback to mock */
  }

  const qLower = query.trim().toLowerCase()
  return mockPrompts.filter(
    (p) =>
      p.title.toLowerCase().includes(qLower) ||
      p.category.toLowerCase().includes(qLower) ||
      p.promptText.toLowerCase().includes(qLower) ||
      (p.tags || []).some((t) => t.toLowerCase().includes(qLower)),
  )
}
