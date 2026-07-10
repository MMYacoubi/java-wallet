import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { queryKeys } from '../queries/queryKeys'

export function useDeleteEntryMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number | string) => api.deleteEntry(id),
    onSuccess: async (_data, id) => {
      await qc.invalidateQueries({ queryKey: queryKeys.entries.all })
      qc.removeQueries({ queryKey: queryKeys.entries.detail(id) })
    },
  })
}
