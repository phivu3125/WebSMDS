import { useState, useCallback, useRef } from 'react'

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseApiCallReturn<T> extends ApiState<T> {
  execute: (apiCall: () => Promise<T>) => Promise<T | undefined>
  reset: () => void
}

export function useApiCall<T = unknown>(): UseApiCallReturn<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const activeRequestRef = useRef<Promise<T> | null>(null)

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    // Cancel any existing request
    if (activeRequestRef.current) {
      activeRequestRef.current = null
    }

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const request = apiCall()
      activeRequestRef.current = request

      const result = await request

      // Check if this request is still active
      if (activeRequestRef.current === request) {
        setState({ data: result, loading: false, error: null })
      }

      return result
    } catch (error) {
      // Only update state if this request is still active
      if (activeRequestRef.current) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
        setState(prev => ({ ...prev, loading: false, error: errorMessage }))
      }
      throw error
    } finally {
      activeRequestRef.current = null
    }
  }, [])

  const reset = useCallback(() => {
    activeRequestRef.current = null
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}

// Hook for paginated API calls
interface PaginatedState<T> extends ApiState<T[]> {
  hasMore: boolean
  page: number
}

interface UsePaginatedApiCallReturn<T> extends PaginatedState<T> {
  execute: (apiCall: (page: number) => Promise<{ data: T[]; hasMore: boolean }>) => Promise<void>
  loadMore: () => Promise<void>
  reset: () => void
}

export function usePaginatedApiCall<T = unknown>(): UsePaginatedApiCallReturn<T> {
  const [state, setState] = useState<PaginatedState<T>>({
    data: null,
    loading: false,
    error: null,
    hasMore: true,
    page: 1,
  })

  const loadMore = useCallback(async () => {
    if (state.loading || !state.hasMore) return

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      // This would need to be implemented with specific API call
      // For now, just update loading state
      setState(prev => ({ ...prev, loading: false }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      setState(prev => ({ ...prev, loading: false, error: errorMessage }))
    }
  }, [state.loading, state.hasMore])

  const execute = useCallback(async (apiCall: (page: number) => Promise<{ data: T[]; hasMore: boolean }>) => {
    setState({ data: null, loading: true, error: null, hasMore: true, page: 1 })

    try {
      const result = await apiCall(1)
      setState({
        data: result.data,
        loading: false,
        error: null,
        hasMore: result.hasMore,
        page: 1,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      setState(prev => ({ ...prev, loading: false, error: errorMessage }))
    }
  }, [])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null, hasMore: true, page: 1 })
  }, [])

  return {
    ...state,
    execute,
    loadMore,
    reset,
  }
}