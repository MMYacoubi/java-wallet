import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { queryKeys } from '../queries/queryKeys'
import type { EntryInput } from '../schemas/entry'

type Vars = { id: number | string; input: EntryInput }

export function useAdminUpdateEntryMutation(userId: number | string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: Vars) => api.updateUserEntry(userId, id, input),
    onSuccess: async (_data, { id }) => {
      await qc.invalidateQueries({ queryKey: queryKeys.admin.userEntries(userId) })
      await qc.invalidateQueries({ queryKey: queryKeys.admin.userEntry(userId, id) })
    },
  })
}
