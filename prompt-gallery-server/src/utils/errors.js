/** Turn any thrown value into a readable string for API clients. */
export function getErrorMessage(err, fallback = 'Something went wrong') {
  if (!err) return fallback
  if (typeof err === 'string') return err

  // Cloudinary often puts details in err.error.message or err.message as object
  const nested =
    err.error?.message ||
    err.response?.error?.message ||
    err.message ||
    err.error

  if (typeof nested === 'string' && nested.trim()) return nested
  if (nested && typeof nested === 'object') {
    if (typeof nested.message === 'string') return nested.message
    try {
      return JSON.stringify(nested)
    } catch {
      return fallback
    }
  }

  if (typeof err.toString === 'function') {
    const s = err.toString()
    if (s && s !== '[object Object]') return s
  }

  return fallback
}
