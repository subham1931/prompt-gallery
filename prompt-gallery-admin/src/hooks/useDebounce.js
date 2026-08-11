import { useEffect, useState } from 'react'

/**
 * Returns a debounced version of the provided value that only updates
 * after the specified delay (default: 300ms) has passed without new changes.
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
