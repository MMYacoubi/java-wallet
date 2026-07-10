import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { Role } from '../../../../../shared/enums/role'
import { EntryType } from '../../../../../shared/enums/entryType'
import {
  adminUserEntriesQueryOptions,
  useAdminUserEntriesQuery,
} from '../../../../../shared/queries/useAdminUserEntriesQuery'
import {
  adminUsersQueryOptions,
  useAdminUsersQuery,
} from '../../../../../shared/queries/useAdminUsersQuery'
import type { Entry } from '../../../../../shared/lib/api'

export const Route = createFileRoute('/admin/users/$id/entries/')({
  beforeLoad: ({ context }) => {
    if (!context.auth.user) throw redirect({ to: '/login' })
    if (context.auth.user.role !== Role.ADMIN) throw redirect({ to: '/' })
  },
  loader: ({ context, params }) => {
    context.queryClient.ensureQueryData(adminUsersQueryOptions)
    return context.queryClient.ensureQueryData(
      adminUserEntriesQueryOptions(params.id),
    )
  },
  component: AdminUserEntriesPage,
})

function formatAmount(entry: Entry) {
  const sign = entry.type === EntryType.EXPENSE ? '−' : '+'
  return `${sign} ${entry.amount} €`
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function AdminUserEntriesPage() {
  const { id } = Route.useParams()
  const usersQuery = useAdminUsersQuery()
  const entriesQuery = useAdminUserEntriesQuery(id)

  const targetUser = usersQuery.data?.find((u) => String(u.id) === String(id))

  return (
    <div className="mx-auto max-w-[1280px] px-8 py-16">
      <header className="flex items-end justify-between border-b border-ink/30 pb-6">
        <div>
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-ink-soft mb-4">
            <span className="inline-block h-px w-8 bg-rule" />
            <span>§ 06</span>
            <span>—</span>
            <Link
              to="/admin"
              className="hover:text-ink transition-colors"
            >
              Verwaltung
            </Link>
            <span>›</span>
            <span>Einträge</span>
          </div>
          <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-none tracking-tight text-ink">
            {targetUser ? (
              <>
                @{targetUser.username}
                <em className="text-emerald-ink not-italic">.</em>
              </>
            ) : (
              <span className="text-ink-soft italic">Lädt…</span>
            )}
          </h1>
        </div>
        <Link
          to="/admin/users/$id/entries/new"
          params={{ id }}
          className="group bg-emerald-deep text-paper py-3 px-5
            flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em]
            hover:bg-emerald-ink transition-colors"
        >
          <span>Neuer Eintrag</span>
          <span className="font-display text-lg group-hover:translate-x-1 transition-transform">
            →
          </span>
        </Link>
      </header>

      {entriesQuery.isLoading ? (
        <div className="mt-16 text-center text-sm text-ink-soft italic">
          Lädt…
        </div>
      ) : entriesQuery.isError ? (
        <div className="mt-16 text-center text-sm text-oxblood">
          Fehler beim Laden: {entriesQuery.error?.message ?? 'Unbekannter Fehler'}
        </div>
      ) : entriesQuery.data && entriesQuery.data.length > 0 ? (
        <ol className="mt-8 divide-y divide-rule border-b border-rule">
          {entriesQuery.data.map((entry) => (
            <li key={entry.id}>
              <Link
                to="/admin/users/$id/entries/$entryId"
                params={{ id, entryId: String(entry.id) }}
                className="grid grid-cols-[auto_1fr_auto] gap-6 items-baseline py-5
                  hover:bg-paper-deep/40 transition-colors px-2 -mx-2"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft tabular-nums w-24">
                  {formatDate(entry.date)}
                </span>
                <span className="font-display text-xl text-ink truncate">
                  {entry.description || (
                    <em className="text-ink-soft">ohne Beschreibung</em>
                  )}
                </span>
                <span
                  className={`font-mono text-sm tabular-nums whitespace-nowrap ${
                    entry.type === EntryType.EXPENSE
                      ? 'text-oxblood'
                      : 'text-emerald-ink'
                  }`}
                >
                  {formatAmount(entry)}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <div className="mt-16 text-center text-sm text-ink-soft italic">
          Noch keine Einträge verbucht.
        </div>
      )}
    </div>
  )
}
