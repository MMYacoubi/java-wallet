import { queryOptions, useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { queryKeys } from './queryKeys'

export const adminUserStatsQueryOptions = (userId: number | string) =>
  queryOptions({
    queryKey: queryKeys.admin.userStats(userId),
    queryFn: () => api.getUserStats(userId),
  })

export function useAdminUserStatsQuery(userId: number | string) {
  return useQuery(adminUserStatsQueryOptions(userId))
}
