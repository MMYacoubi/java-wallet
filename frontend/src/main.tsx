import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import { routeTree } from './routeTree.gen'
import { useAuth } from './shared/lib/auth'
import { queryClient } from './shared/lib/queryClient'

const router = createRouter({
  routeTree,
  context: { auth: undefined!, queryClient },
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function InnerApp() {
  const auth = useAuth()
  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs uppercase tracking-[0.3em] text-ink-soft">
        Lädt…
      </div>
    )
  }
  return <RouterProvider router={router} context={{ auth, queryClient }} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <InnerApp />
    </QueryClientProvider>
  </StrictMode>,
)
