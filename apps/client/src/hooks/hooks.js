// Hooks for API calls
import { useState, useEffect, useCallback, useMemo } from 'react'

export default function useApi(apiCall, autoExecute = false) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true)
        setError(null)
        const result = await apiCall(...args)
        setData(result)
        return result
      } catch (err) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [apiCall],
  )

  useEffect(() => {
    if (autoExecute) {
      execute()
    }
  }, [autoExecute, execute])

  return { data, loading, error, execute }
}

// Memoize the function to avoid recreating it on every render
const memoizedExecute = useMemo(() => execute, [execute])

return { data, loading, error, memoizedExecute }
