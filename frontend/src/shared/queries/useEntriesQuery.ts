import { queryOptions, useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { queryKeys } from './queryKeys'

export const entriesQueryOptions = queryOptions({
  queryKey: queryKeys.entries.list(),
  queryFn: () => api.listEntries(),
})

export function useEntriesQuery() {
  return useQuery(entriesQueryOptions)
}
