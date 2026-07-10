import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { EntryForm } from '../../shared/components/EntryForm'
import { useCreateEntryMutation } from '../../shared/mutations/useCreateEntryMutation'

export const Route = createFileRoute('/entries/new')({
  beforeLoad: ({ context }) => {
    if (!context.auth.user) throw redirect({ to: '/login' })
  },
  component: NewEntryPage,
})

function NewEntryPage() {
  const navigate = useNavigate()
  const createMutation = useCreateEntryMutation()

  return (
    <div className="mx-auto max-w-[720px] px-8 py-16">
      <header className="mb-12 pb-6 border-b border-ink/30">
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-ink-soft mb-4">
          <span className="inline-block h-px w-8 bg-rule" />
          <span>§ 04</span>
          <span>—</span>
          <span>Eintragung</span>
        </div>
        <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-none tracking-tight text-ink">
          Neuer<em className="text-emerald-ink italic"> Eintrag.</em>
        </h1>
      </header>

      <div className="bg-paper-deep border border-ink shadow-[12px_12px_0_-1px_var(--color-ink)] p-8 lg:p-12">
        <EntryForm
          submitLabel="Verbuchen"
          submittingLabel="Wird verbucht…"
          onSubmit={async (input) => {
            await createMutation.mutateAsync(input)
            navigate({ to: '/entries' })
          }}
        />
      </div>
    </div>
  )
}
