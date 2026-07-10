import { queryOptions, useQuery } from '@tanstack/react-query'
import { api, ApiError, type Me } from '../lib/api'
import { queryKeys } from './queryKeys'

export const meQueryOptions = queryOptions<Me | null>({
  queryKey: queryKeys.auth.me,
  queryFn: async () => {
    try {
      return await api.me()
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return null
      throw err
    }
  },
  staleTime: Infinity,
})

export function useMeQuery() {
  return useQuery(meQueryOptions)
}
