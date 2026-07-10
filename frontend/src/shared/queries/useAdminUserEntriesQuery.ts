import { queryOptions, useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { queryKeys } from './queryKeys'

export const adminUserEntriesQueryOptions = (userId: number | string) =>
  queryOptions({
    queryKey: queryKeys.admin.userEntries(userId),
    queryFn: () => api.listUserEntries(userId),
  })

export function useAdminUserEntriesQuery(userId: number | string) {
  return useQuery(adminUserEntriesQueryOptions(userId))
}
