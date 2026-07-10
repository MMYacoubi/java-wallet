import {
  createRootRouteWithContext,
  Link,
  Outlet,
  useNavigate,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { useState } from 'react'
import type { QueryClient } from '@tanstack/react-query'
import { useAuth } from '../shared/lib/auth'
import { Role } from '../shared/enums/role'
import { BookOpen, Users, LogOut, LogIn, UserPlus } from 'lucide-react'

type RouterContext = {
  auth: ReturnType<typeof useAuth>
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logout()
      navigate({ to: '/login' })
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-rule">
        <div className="mx-auto max-w-[1280px] flex items-center justify-between px-8 py-4">
          <Link
            to="/"
            className="font-display text-3xl italic leading-none tracking-tight text-ink"
          >
            Ledger<span className="text-emerald-ink">.</span>
          </Link>
          <nav className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/entries"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-[11px] uppercase tracking-[0.15em] font-medium text-ink-soft border border-rule hover:border-ink hover:text-ink transition-colors"
                >
                  <BookOpen size={14} />
                  Einträge
                </Link>
                {user.role === Role.ADMIN && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-[11px] uppercase tracking-[0.15em] font-medium text-ink-soft border border-rule hover:border-ink hover:text-ink transition-colors"
                  >
                    <Users size={14} />
                    Verwaltung
                  </Link>
                )}
                <span className="text-[11px] tracking-wide text-ink-soft px-2">
                  Angemeldet als <strong>@{user.username}</strong>
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-[11px] uppercase tracking-[0.15em] font-medium text-ink-soft border border-rule hover:border-red-400 hover:text-red-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <LogOut size={14} />
                  {loggingOut ? 'Abmelden…' : 'Abmelden'}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-md text-[11px] uppercase tracking-[0.15em] font-semibold border border-rule text-ink-soft hover:border-ink hover:text-ink transition-colors"
                >
                  <LogIn size={14} />
                  Anmelden
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-md text-[11px] uppercase tracking-[0.15em] font-semibold bg-emerald-ink text-white hover:opacity-90 transition-opacity"
                >
                  <UserPlus size={14} />
                  Konto erstellen
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-rule">
        <div className="mx-auto max-w-[1280px] px-8 py-4 flex justify-between text-[10px] uppercase tracking-[0.25em] text-ink-soft">
          <span>§ Private Ledger</span>
          <span>Anno MMXXVI</span>
        </div>
      </footer>

      <TanStackRouterDevtools position="bottom-right" />
    </div>
  )
}
