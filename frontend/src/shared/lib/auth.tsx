import { useCallback, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { api, type Me } from './api'
import { useMeQuery } from '../queries/useMeQuery'
import { queryKeys } from '../queries/queryKeys'

export type AuthValue = {
  user: Me | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export function useAuth(): AuthValue {
  const qc = useQueryClient()
  const meQuery = useMeQuery()

  const login = useCallback(
    async (username: string, password: string) => {
      await api.login(username, password)
      const me = await api.me()
      qc.setQueryData(queryKeys.auth.me, me)
    },
    [qc],
  )

  const register = useCallback(
    async (username: string, password: string) => {
      await api.register(username, password)
      await api.login(username, password)
      const me = await api.me()
      qc.setQueryData(queryKeys.auth.me, me)
    },
    [qc],
  )

  const logout = useCallback(async () => {
    try {
      await api.logout()
    } catch {
      // Session evtl. schon abgelaufen — lokal trotzdem abmelden
    }
    qc.setQueryData(queryKeys.auth.me, null)
    // Nutzergebundene Caches verwerfen, damit ein nächster Login frisch lädt
    qc.removeQueries({ queryKey: queryKeys.entries.all })
    qc.removeQueries({ queryKey: queryKeys.admin.all })
  }, [qc])

  return useMemo(
    () => ({
      user: meQuery.data ?? null,
      isLoading: meQuery.isLoading,
      login,
      register,
      logout,
    }),
    [meQuery.data, meQuery.isLoading, login, register, logout],
  )
}
