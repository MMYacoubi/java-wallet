import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Role } from '../enums/role'
import { queryKeys } from '../queries/queryKeys'

type Vars = { id: number | string; role: Role }

export function useUpdateUserRoleMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, role }: Vars) => api.updateUserRole(id, role),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.admin.users() })
    },
  })
}
