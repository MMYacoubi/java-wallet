import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { type Entry } from '../../shared/lib/api'
import { EntryType } from '../../shared/enums/entryType'
import {
  entriesQueryOptions,
  useEntriesQuery,
} from '../../shared/queries/useEntriesQuery'

export const Route = createFileRoute('/entries/')({
  beforeLoad: ({ context }) => {
    if (!context.auth.user) throw redirect({ to: '/login' })
  },
  loader: ({ context }) => context.queryClient.ensureQueryData(entriesQueryOptions),
  component: EntriesListPage,
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

function EntriesListPage() {
  const { data: entries = [] } = useEntriesQuery()

  return (
    <div className="mx-auto max-w-[1280px] px-8 py-16">
      <header className="flex items-end justify-between border-b border-ink/30 pb-6">
        <div>
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-ink-soft mb-4">
            <span className="inline-block h-px w-8 bg-rule" />
            <span>§ 03</span>
            <span>—</span>
            <span>Hauptbuch</span>
          </div>
          <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-none tracking-tight text-ink">
            Einträge<em className="text-emerald-ink not-italic">.</em>
          </h1>
        </div>
        <Link
          to="/entries/new"
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

      {entries.length === 0 ? (
        <div className="mt-16 text-center text-sm text-ink-soft italic">
          Noch keine Einträge verbucht.
        </div>
      ) : (
        <ol className="mt-8 divide-y divide-rule border-b border-rule">
          {entries.map((entry) => (
            <li key={entry.id}>
              <Link
                to="/entries/$id"
                params={{ id: String(entry.id) }}
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
      )}
    </div>
  )
}
