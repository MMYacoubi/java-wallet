import { useState } from 'react'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { EntryForm } from '../../../../../shared/components/EntryForm'
import { Role } from '../../../../../shared/enums/role'
import {
  adminUserEntryQueryOptions,
  useAdminUserEntryQuery,
} from '../../../../../shared/queries/useAdminUserEntryQuery'
import { useAdminUpdateEntryMutation } from '../../../../../shared/mutations/useAdminUpdateEntryMutation'
import { useAdminDeleteEntryMutation } from '../../../../../shared/mutations/useAdminDeleteEntryMutation'
import {
  adminUsersQueryOptions,
  useAdminUsersQuery,
} from '../../../../../shared/queries/useAdminUsersQuery'

export const Route = createFileRoute('/admin/users/$id/entries/$entryId')({
  beforeLoad: ({ context }) => {
    if (!context.auth.user) throw redirect({ to: '/login' })
    if (context.auth.user.role !== Role.ADMIN) throw redirect({ to: '/' })
  },
  loader: ({ context, params }) => {
    context.queryClient.ensureQueryData(adminUsersQueryOptions)
    return context.queryClient.ensureQueryData(
      adminUserEntryQueryOptions(params.id, params.entryId),
    )
  },
  component: AdminEntryDetailPage,
})

function AdminEntryDetailPage() {
  const { id, entryId } = Route.useParams()
  const navigate = useNavigate()
  const entryQuery = useAdminUserEntryQuery(id, entryId)
  const updateMutation = useAdminUpdateEntryMutation(id)
  const deleteMutation = useAdminDeleteEntryMutation(id)
  const usersQuery = useAdminUsersQuery()
  const targetUser = usersQuery.data?.find((u) => String(u.id) === String(id))
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (entryQuery.isLoading) {
    return (
      <div className="mx-auto max-w-[720px] px-8 py-16 text-center text-sm text-ink-soft italic">
        Lädt…
      </div>
    )
  }

  if (entryQuery.isError || !entryQuery.data) {
    return (
      <div className="mx-auto max-w-[720px] px-8 py-16 text-center text-sm text-oxblood">
        Fehler beim Laden: {entryQuery.error?.message ?? 'Eintrag nicht gefunden'}
      </div>
    )
  }

  const entry = entryQuery.data

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(entryId)
    navigate({ to: '/admin/users/$id/entries', params: { id } })
  }

  return (
    <div className="mx-auto max-w-[720px] px-8 py-16">
      <header className="mb-12 pb-6 border-b border-ink/30">
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-ink-soft mb-4">
          <span className="inline-block h-px w-8 bg-rule" />
          <span>§ 08</span>
          <span>—</span>
          <span>
            Eintrag № {entry.id}
            {targetUser ? ` · @${targetUser.username}` : ''}
          </span>
        </div>
        <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-none tracking-tight text-ink">
          Eintrag<em className="text-emerald-ink italic"> bearbeiten.</em>
        </h1>
      </header>

      <div className="bg-paper-deep border border-ink shadow-[12px_12px_0_-1px_var(--color-ink)] p-8 lg:p-12">
        <EntryForm
          initial={{
            amount: entry.amount,
            description: entry.description ?? '',
            date: entry.date,
            type: entry.type,
          }}
          submitLabel="Speichern"
          submittingLabel="Wird gespeichert…"
          onSubmit={async (input) => {
            await updateMutation.mutateAsync({ id: entryId, input })
            navigate({ to: '/admin/users/$id/entries', params: { id } })
          }}
        />
      </div>

      <div className="mt-12 pt-6 border-t border-ink/20">
        {!confirmDelete ? (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="font-mono text-[11px] uppercase tracking-[0.3em] text-oxblood hover:text-ink transition-colors"
          >
            Eintrag löschen
          </button>
        ) : (
          <div className="flex items-center justify-between gap-4 border border-oxblood/40 bg-oxblood/5 px-5 py-4">
            <span className="text-xs uppercase tracking-[0.2em] text-oxblood">
              Wirklich löschen?
            </span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                disabled={deleteMutation.isPending}
                className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-soft hover:text-ink transition-colors disabled:opacity-40"
              >
                Abbrechen
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="bg-oxblood text-paper py-2 px-4 font-mono text-[11px] uppercase tracking-[0.3em] hover:bg-ink transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {deleteMutation.isPending ? 'Wird gelöscht…' : 'Endgültig löschen'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
