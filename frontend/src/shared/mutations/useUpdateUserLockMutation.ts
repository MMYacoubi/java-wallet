import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { queryKeys } from '../queries/queryKeys'

type Vars = { id: number | string; locked: boolean }

export function useUpdateUserLockMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, locked }: Vars) => api.updateUserLock(id, locked),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.admin.users() })
    },
  })
}
