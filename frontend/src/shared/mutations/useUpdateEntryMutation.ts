import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { queryKeys } from '../queries/queryKeys'
import type { EntryInput } from '../schemas/entry'

type Vars = { id: number | string; input: EntryInput }

export function useUpdateEntryMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: Vars) => api.updateEntry(id, input),
    onSuccess: async (_data, { id }) => {
      await qc.invalidateQueries({ queryKey: queryKeys.entries.all })
      await qc.invalidateQueries({ queryKey: queryKeys.entries.detail(id) })
    },
  })
}
