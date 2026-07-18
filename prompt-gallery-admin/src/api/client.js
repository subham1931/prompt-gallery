const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '')

function toErrorMessage(payload, status) {
  const err = payload?.error ?? payload?.message
  if (typeof err === 'string' && err.trim()) return err
  if (err && typeof err === 'object') {
    if (typeof err.message === 'string') return err.message
    try {
      return JSON.stringify(err)
    } catch {
      /* ignore */
    }
  }
  return `Request failed (${status})`
}

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  })

  const payload = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(toErrorMessage(payload, res.status))
  }
  return payload
}

export function getApiUrl() {
  return API_URL
}

export function listPrompts(params = {}) {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') qs.set(k, String(v))
  })
  const query = qs.toString()
  return request(`/api/prompts${query ? `?${query}` : ''}`)
}

export function getPromptBySlug(slug, { includeDrafts = false } = {}) {
  const qs = includeDrafts ? '?includeDrafts=1' : ''
  return request(`/api/prompts/${encodeURIComponent(slug)}${qs}`)
}

export function getPromptById(id) {
  return request(`/api/prompts/by-id/${encodeURIComponent(id)}`)
}

export function createPrompt(body) {
  return request('/api/prompts', { method: 'POST', body: JSON.stringify(body) })
}

export function updatePrompt(id, body) {
  return request(`/api/prompts/${id}`, { method: 'PUT', body: JSON.stringify(body) })
}

export function deletePrompt(id) {
  return request(`/api/prompts/${id}`, { method: 'DELETE' })
}

export async function uploadImage(file) {
  const form = new FormData()
  form.append('image', file)
  return request('/api/upload', { method: 'POST', body: form })
}

export function listCategories() {
  return request('/api/categories')
}

export function createCategory(body) {
  return request('/api/categories', { method: 'POST', body: JSON.stringify(body) })
}
