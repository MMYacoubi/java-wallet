import { QueryClient } from '@tanstack/react-query'
import { ApiError, onUnauthorized } from './api'
import { queryKeys } from '../queries/queryKeys'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status === 401) return false
        return failureCount < 2
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
})

// Bei einer 401 auf einer geschützten Route den Auth-Cache leeren — das
// erzwingt ein Re-Render mit `user = null` und damit den Redirect zum Login.
onUnauthorized(() => {
  queryClient.setQueryData(queryKeys.auth.me, null)
})
