import { queryOptions, useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { queryKeys } from './queryKeys'

export const entryQueryOptions = (id: number | string) =>
  queryOptions({
    queryKey: queryKeys.entries.detail(id),
    queryFn: () => api.getEntry(id),
  })

export function useEntryQuery(id: number | string) {
  return useQuery(entryQueryOptions(id))
}
