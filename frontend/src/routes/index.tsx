import { createFileRoute, Link } from '@tanstack/react-router'
import { useAuth } from '../shared/lib/auth'
import { ShieldCheck, TrendingDown, BookOpenCheck } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { user } = useAuth()

  return (
    <section className="mx-auto max-w-7xl px-8 py-24 flex flex-col items-center text-center gap-16">
      <div className="flex flex-col items-center gap-6 max-w-2xl">
        <h1 className="font-display text-6xl italic leading-none tracking-tight text-ink">
          Behalte den Überblick<span className="text-emerald-ink">.</span>
        </h1>
        <p className="text-lg text-ink-soft leading-relaxed">
          Ledger ist dein privates Haushaltsbuch — einfach, sicher und immer
          griffbereit. Erfasse Einnahmen und Ausgaben, behalte deine Finanzen
          im Blick und behalte volle Kontrolle über dein Geld.
        </p>
        <div className="flex items-center gap-3 pt-2">
          {user ? (
            <Link
              to="/entries"
              className="inline-flex items-center px-6 py-3 rounded-md text-[12px] uppercase tracking-[0.15em] font-semibold bg-emerald-ink text-white hover:opacity-90 transition-opacity"
            >
              Zu meinen Einträgen
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 rounded-md text-[12px] uppercase tracking-[0.15em] font-semibold bg-emerald-ink text-white hover:opacity-90 transition-opacity"
              >
                Jetzt starten
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-6 py-3 rounded-md text-[12px] uppercase tracking-[0.15em] font-semibold border border-rule text-ink-soft hover:border-ink hover:text-ink transition-colors"
              >
                Anmelden
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-3xl">
        <div className="flex flex-col items-center gap-3 p-6 rounded-xl border border-rule">
          <BookOpenCheck size={28} className="text-emerald-ink" />
          <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-ink">
            Übersichtlich
          </h3>
          <p className="text-sm text-ink-soft text-center leading-relaxed">
            Alle Einnahmen und Ausgaben auf einen Blick — klar strukturiert.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 p-6 rounded-xl border border-rule">
          <TrendingDown size={28} className="text-emerald-ink" />
          <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-ink">
            Kontrolliert
          </h3>
          <p className="text-sm text-ink-soft text-center leading-relaxed">
            Erkenne Ausgabemuster und spare gezielt — monatlich nachvollziehbar.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 p-6 rounded-xl border border-rule">
          <ShieldCheck size={28} className="text-emerald-ink" />
          <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-ink">
            Privat
          </h3>
          <p className="text-sm text-ink-soft text-center leading-relaxed">
            Deine Daten gehören dir — keine Werbung, kein Tracking.
          </p>
        </div>
      </div>
    </section>
  )
}
