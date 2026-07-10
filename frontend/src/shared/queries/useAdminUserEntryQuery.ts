import { queryOptions, useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { queryKeys } from './queryKeys'

export const adminUserEntryQueryOptions = (
  userId: number | string,
  id: number | string,
) =>
  queryOptions({
    queryKey: queryKeys.admin.userEntry(userId, id),
    queryFn: () => api.getUserEntry(userId, id),
  })

export function useAdminUserEntryQuery(
  userId: number | string,
  id: number | string,
) {
  return useQuery(adminUserEntryQueryOptions(userId, id))
}
