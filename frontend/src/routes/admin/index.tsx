import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import {
  adminUsersQueryOptions,
  useAdminUsersQuery,
} from '../../shared/queries/useAdminUsersQuery'
import { useUpdateUserRoleMutation } from '../../shared/mutations/useUpdateUserRoleMutation'
import { useUpdateUserLockMutation } from '../../shared/mutations/useUpdateUserLockMutation'
import { Role } from '../../shared/enums/role'
import { useAuth } from '../../shared/lib/auth'
import type { AdminUser } from '../../shared/lib/api'
import { BookOpen, BarChart3 } from 'lucide-react'

export const Route = createFileRoute('/admin/')({
  beforeLoad: ({ context }) => {
    if (!context.auth.user) throw redirect({ to: '/login' })
    if (context.auth.user.role !== Role.ADMIN) throw redirect({ to: '/' })
  },
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(adminUsersQueryOptions),
  component: AdminUsersPage,
})

function AdminUsersPage() {
  const { user: me } = useAuth()
  const usersQuery = useAdminUsersQuery()
  const roleMutation = useUpdateUserRoleMutation()
  const lockMutation = useUpdateUserLockMutation()
  const [pendingRoleId, setPendingRoleId] = useState<number | string | null>(null)
  const [pendingLockId, setPendingLockId] = useState<number | string | null>(null)

  const handleRoleToggle = (target: AdminUser) => {
    const next = target.role === Role.ADMIN ? Role.USER : Role.ADMIN
    setPendingRoleId(target.id)
    roleMutation.mutate(
      { id: target.id, role: next },
      { onSettled: () => setPendingRoleId(null) },
    )
  }

  const handleLockToggle = (target: AdminUser) => {
    setPendingLockId(target.id)
    lockMutation.mutate(
      { id: target.id, locked: !target.locked },
      { onSettled: () => setPendingLockId(null) },
    )
  }

  return (
    <div className="mx-auto max-w-[1280px] px-8 py-16">
      <header className="border-b border-ink/30 pb-6">
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-ink-soft mb-4">
          <span className="inline-block h-px w-8 bg-rule" />
          <span>§ 04</span>
          <span>—</span>
          <span>Verwaltung</span>
        </div>
        <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-none tracking-tight text-ink">
          Benutzer<em className="text-emerald-ink not-italic">.</em>
        </h1>
      </header>

      {usersQuery.isLoading ? (
        <div className="mt-16 text-center text-sm text-ink-soft italic">
          Lädt…
        </div>
      ) : usersQuery.isError ? (
        <div className="mt-16 text-center text-sm text-oxblood">
          Fehler beim Laden: {usersQuery.error?.message ?? 'Unbekannter Fehler'}
        </div>
      ) : usersQuery.data && usersQuery.data.length > 0 ? (
        <ol className="mt-8 divide-y divide-rule border-b border-rule">
          {usersQuery.data.map((u) => {
            const isSelf = me?.username === u.username
            return (
              <li
                key={u.id}
                className="grid grid-cols-[auto_1fr_auto_auto_auto_auto_auto] gap-6 items-center py-5 px-2 -mx-2"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft tabular-nums w-12">
                  #{u.id}
                </span>
                <span className="font-display text-xl text-ink flex items-baseline gap-3">
                  {u.username}
                  {isSelf && (
                    <em className="text-[10px] uppercase tracking-[0.2em] text-ink-soft not-italic">
                      (du)
                    </em>
                  )}
                </span>
                <Link
                  to="/admin/users/$id/entries"
                  params={{ id: String(u.id) }}
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] px-3 py-1 border border-ink-soft text-ink-soft hover:bg-ink-soft hover:text-paper transition-colors"
                  title={`Einträge von ${u.username} ansehen`}
                >
                  <BookOpen size={12} />
                  Einträge
                </Link>
                <Link
                  to="/admin/users/$id/stats"
                  params={{ id: String(u.id) }}
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] px-3 py-1 border border-ink-soft text-ink-soft hover:bg-ink-soft hover:text-paper transition-colors"
                  title={`Statistik von ${u.username} ansehen`}
                >
                  <BarChart3 size={12} />
                  Statistik
                </Link>
                <button
                  type="button"
                  onClick={() => handleRoleToggle(u)}
                  disabled={isSelf || pendingRoleId === u.id}
                  className={`font-mono text-xs uppercase tracking-[0.2em] px-3 py-1 border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                    u.role === Role.ADMIN
                      ? 'border-emerald-ink text-emerald-ink hover:bg-emerald-ink hover:text-paper'
                      : 'border-ink-soft text-ink-soft hover:bg-ink-soft hover:text-paper'
                  }`}
                  title={
                    isSelf
                      ? 'Eigene Rolle kann nicht geändert werden'
                      : `Wechsel zu ${u.role === Role.ADMIN ? 'USER' : 'ADMIN'}`
                  }
                >
                  {u.role}
                </button>
                <span
                  className={`font-mono text-[11px] uppercase tracking-[0.2em] tabular-nums w-24 text-right ${
                    u.locked ? 'text-oxblood' : 'text-emerald-ink'
                  }`}
                >
                  {u.locked ? 'Gesperrt' : 'Aktiv'}
                </span>
                <button
                  type="button"
                  onClick={() => handleLockToggle(u)}
                  disabled={isSelf || pendingLockId === u.id}
                  className="font-mono text-xs uppercase tracking-[0.3em] py-3 px-5 bg-ink text-paper hover:bg-oxblood transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  title={
                    isSelf ? 'Eigener Account kann nicht gesperrt werden' : ''
                  }
                >
                  {u.locked ? 'Entsperren' : 'Sperren'}
                </button>
              </li>
            )
          })}
        </ol>
      ) : (
        <div className="mt-16 text-center text-sm text-ink-soft italic">
          Keine Benutzer gefunden.
        </div>
      )}

      {(roleMutation.isError || lockMutation.isError) && (
        <div className="mt-6 text-sm text-oxblood">
          Aktion fehlgeschlagen:{' '}
          {roleMutation.error?.message ?? lockMutation.error?.message}
        </div>
      )}
    </div>
  )
}
