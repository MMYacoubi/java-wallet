import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { Role } from '../../../../shared/enums/role'
import {
  adminUserStatsQueryOptions,
  useAdminUserStatsQuery,
} from '../../../../shared/queries/useAdminUserStatsQuery'
import {
  adminUsersQueryOptions,
  useAdminUsersQuery,
} from '../../../../shared/queries/useAdminUsersQuery'

export const Route = createFileRoute('/admin/users/$id/stats')({
  beforeLoad: ({ context }) => {
    if (!context.auth.user) throw redirect({ to: '/login' })
    if (context.auth.user.role !== Role.ADMIN) throw redirect({ to: '/' })
  },
  loader: ({ context, params }) => {
    context.queryClient.ensureQueryData(adminUsersQueryOptions)
    return context.queryClient.ensureQueryData(
      adminUserStatsQueryOptions(params.id),
    )
  },
  component: AdminUserStatsPage,
})

function formatEuro(value: string) {
  const n = Number(value)
  return `${n.toLocaleString('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`
}

function AdminUserStatsPage() {
  const { id } = Route.useParams()
  const usersQuery = useAdminUsersQuery()
  const statsQuery = useAdminUserStatsQuery(id)

  const targetUser = usersQuery.data?.find((u) => String(u.id) === String(id))

  return (
    <div className="mx-auto max-w-[1280px] px-8 py-16">
      <header className="border-b border-ink/30 pb-6">
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-ink-soft mb-4">
          <span className="inline-block h-px w-8 bg-rule" />
          <span>§ 07</span>
          <span>—</span>
          <Link to="/admin" className="hover:text-ink transition-colors">
            Verwaltung
          </Link>
          <span>›</span>
          <span>Statistik</span>
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
      </header>

      {statsQuery.isLoading ? (
        <div className="mt-16 text-center text-sm text-ink-soft italic">
          Lädt…
        </div>
      ) : statsQuery.isError ? (
        <div className="mt-16 text-center text-sm text-oxblood">
          Fehler beim Laden:{' '}
          {statsQuery.error?.message ?? 'Unbekannter Fehler'}
        </div>
      ) : statsQuery.data ? (
        <dl className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            index="i."
            label="Einträge insgesamt"
            value={String(statsQuery.data.totalCount)}
          />
          <StatCard
            index="ii."
            label="Einnahmen (Anzahl)"
            value={String(statsQuery.data.incomeCount)}
            tone="emerald"
          />
          <StatCard
            index="iii."
            label="Ausgaben (Anzahl)"
            value={String(statsQuery.data.expenseCount)}
            tone="oxblood"
          />
          <StatCard
            index="iv."
            label="Einnahmen (Summe)"
            value={formatEuro(statsQuery.data.incomeTotal)}
            tone="emerald"
          />
          <StatCard
            index="v."
            label="Ausgaben (Summe)"
            value={formatEuro(statsQuery.data.expenseTotal)}
            tone="oxblood"
          />
        </dl>
      ) : null}
    </div>
  )
}

type StatCardProps = {
  index: string
  label: string
  value: string
  tone?: 'emerald' | 'oxblood'
}

function StatCard({ index, label, value, tone }: StatCardProps) {
  const valueColor =
    tone === 'emerald'
      ? 'text-emerald-ink'
      : tone === 'oxblood'
        ? 'text-oxblood'
        : 'text-ink'
  return (
    <div className="border border-ink/40 bg-paper-deep p-6 flex flex-col gap-3">
      <div className="flex items-baseline justify-between text-[10px] uppercase tracking-[0.3em] text-ink-soft">
        <span>{index}</span>
        <span>{label}</span>
      </div>
      <div
        className={`font-display text-4xl tabular-nums leading-none ${valueColor}`}
      >
        {value}
      </div>
    </div>
  )
}
