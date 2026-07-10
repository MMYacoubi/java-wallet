import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { EntryForm } from '../../../../../shared/components/EntryForm'
import { Role } from '../../../../../shared/enums/role'
import { useAdminCreateEntryMutation } from '../../../../../shared/mutations/useAdminCreateEntryMutation'
import {
  adminUsersQueryOptions,
  useAdminUsersQuery,
} from '../../../../../shared/queries/useAdminUsersQuery'

export const Route = createFileRoute('/admin/users/$id/entries/new')({
  beforeLoad: ({ context }) => {
    if (!context.auth.user) throw redirect({ to: '/login' })
    if (context.auth.user.role !== Role.ADMIN) throw redirect({ to: '/' })
  },
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(adminUsersQueryOptions),
  component: AdminNewEntryPage,
})

function AdminNewEntryPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const createMutation = useAdminCreateEntryMutation(id)
  const usersQuery = useAdminUsersQuery()
  const targetUser = usersQuery.data?.find((u) => String(u.id) === String(id))

  return (
    <div className="mx-auto max-w-[720px] px-8 py-16">
      <header className="mb-12 pb-6 border-b border-ink/30">
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-ink-soft mb-4">
          <span className="inline-block h-px w-8 bg-rule" />
          <span>§ 07</span>
          <span>—</span>
          <span>Neuer Eintrag</span>
        </div>
        <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-none tracking-tight text-ink">
          Neuer Eintrag für{' '}
          <em className="text-emerald-ink italic">
            @{targetUser?.username ?? '…'}
          </em>
          .
        </h1>
      </header>

      <div className="bg-paper-deep border border-ink shadow-[12px_12px_0_-1px_var(--color-ink)] p-8 lg:p-12">
        <EntryForm
          submitLabel="Verbuchen"
          submittingLabel="Wird verbucht…"
          onSubmit={async (input) => {
            await createMutation.mutateAsync(input)
            navigate({ to: '/admin/users/$id/entries', params: { id } })
          }}
        />
      </div>
    </div>
  )
}
