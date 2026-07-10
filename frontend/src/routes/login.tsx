import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { AuthShell } from '../shared/components/AuthShell'
import { Field } from '../shared/components/Field'
import { useLoginForm } from '../shared/hooks/useLoginForm'
import { fieldError } from '../shared/lib/form'

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context }) => {
    if (context.auth.user) throw redirect({ to: '/entries' })
  },
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const { form, submitError } = useLoginForm({
    onSuccess: () => navigate({ to: '/entries' }),
  })

  return (
    <AuthShell
      section="01"
      eyebrow="Zugang"
      title="Buch"
      italic="öffnen."
      lede="Setze dich an deinen Schreibtisch. Trage Vermögen ein. Verbuche jeden Schilling, jede Münze, jedes Versprechen."
      altPrompt="Noch kein Konto?"
      altLabel="Eröffnen →"
      altTo="/register"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="flex flex-col gap-7"
      >
        <div className="flex items-baseline justify-between border-b border-ink/30 pb-4">
          <h2 className="font-display text-3xl italic text-ink leading-none">
            Anmeldung
          </h2>
          <span className="text-[10px] uppercase tracking-[0.3em] text-ink-soft">
            № 0001
          </span>
        </div>

        <form.Field name="username">
          {(field) => (
            <Field
              index="i."
              label="Benutzername"
              hint="Konto-Identifikator"
              autoComplete="username"
              placeholder="z. B. m.curie"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={fieldError(field.state.meta)}
            />
          )}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <Field
              index="ii."
              label="Passwort"
              hint="Versiegelt"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={fieldError(field.state.meta)}
            />
          )}
        </form.Field>

        {submitError && (
          <div className="border border-oxblood/40 bg-oxblood/5 px-4 py-3 text-xs uppercase tracking-[0.2em] text-oxblood">
            {submitError}
          </div>
        )}

        <form.Subscribe
          selector={(s) => [s.canSubmit, s.isSubmitting] as const}
        >
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit}
              className="group relative mt-2 w-full bg-emerald-deep text-paper
                py-4 px-6 flex items-center justify-between
                font-mono text-xs uppercase tracking-[0.3em]
                hover:bg-emerald-ink transition-colors
                disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? 'Wird verbucht…' : 'Eintreten'}</span>
              <span className="font-display text-xl group-hover:translate-x-1 transition-transform">
                →
              </span>
            </button>
          )}
        </form.Subscribe>
      </form>
    </AuthShell>
  )
}
