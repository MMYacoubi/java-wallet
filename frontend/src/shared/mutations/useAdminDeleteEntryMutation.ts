import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { queryKeys } from '../queries/queryKeys'

export function useAdminDeleteEntryMutation(userId: number | string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number | string) => api.deleteUserEntry(userId, id),
    onSuccess: async (_data, id) => {
      await qc.invalidateQueries({ queryKey: queryKeys.admin.userEntries(userId) })
      qc.removeQueries({ queryKey: queryKeys.admin.userEntry(userId, id) })
    },
  })
}
