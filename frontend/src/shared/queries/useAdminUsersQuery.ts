import { queryOptions, useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { queryKeys } from './queryKeys'

export const adminUsersQueryOptions = queryOptions({
  queryKey: queryKeys.admin.users(),
  queryFn: () => api.listAdminUsers(),
})

export function useAdminUsersQuery() {
  return useQuery(adminUsersQueryOptions)
}
