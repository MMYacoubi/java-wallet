import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { queryKeys } from '../queries/queryKeys'
import type { EntryInput } from '../schemas/entry'

export function useAdminCreateEntryMutation(userId: number | string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: EntryInput) => api.createUserEntry(userId, input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.admin.userEntries(userId) })
    },
  })
}
