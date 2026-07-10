import { Field } from './Field'
import { useEntryForm } from '../hooks/useEntryForm'
import { fieldError } from '../lib/form'
import type { EntryInput } from '../schemas/entry'
import { EntryType } from '../enums/entryType'

type Props = {
  initial?: EntryInput
  submitLabel: string
  submittingLabel: string
  onSubmit: (input: EntryInput) => Promise<void>
}

export function EntryForm({
  initial,
  submitLabel,
  submittingLabel,
  onSubmit,
}: Props) {
  const { form, submitError } = useEntryForm({ initial, onSubmit })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="flex flex-col gap-7"
    >
      <form.Field name="type">
        {(field) => (
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <span className="text-[10px] uppercase tracking-[0.3em] text-ink-soft">
                i. Art
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-ink-soft/60">
                Einnahme oder Ausgabe
              </span>
            </div>
            <div className="grid grid-cols-2 gap-0 border border-ink/40">
              {[EntryType.EXPENSE, EntryType.INCOME].map((t) => {
                const active = field.state.value === t
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => field.handleChange(t)}
                    className={`py-3 px-4 font-mono text-xs uppercase tracking-[0.3em] transition-colors ${
                      active
                        ? t === EntryType.EXPENSE
                          ? 'bg-oxblood text-paper'
                          : 'bg-emerald-deep text-paper'
                        : 'bg-transparent text-ink-soft hover:bg-paper-deep'
                    }`}
                  >
                    {t === EntryType.EXPENSE ? 'Ausgabe' : 'Einnahme'}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </form.Field>

      <form.Field name="amount">
        {(field) => (
          <Field
            index="ii."
            label="Betrag (€)"
            hint="Größer als 0"
            type="number"
            inputMode="decimal"
            step="0.01"
            placeholder="0,00"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            error={fieldError(field.state.meta)}
          />
        )}
      </form.Field>

      <form.Field name="date">
        {(field) => (
          <Field
            index="iii."
            label="Datum"
            hint="Buchungstag"
            type="date"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            error={fieldError(field.state.meta)}
          />
        )}
      </form.Field>

      <form.Field name="description">
        {(field) => (
          <Field
            index="iv."
            label="Beschreibung"
            hint="Optional"
            placeholder="z. B. Wocheneinkauf"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
          />
        )}
      </form.Field>

      {submitError && (
        <div className="border border-oxblood/40 bg-oxblood/5 px-4 py-3 text-xs uppercase tracking-[0.2em] text-oxblood">
          {submitError}
        </div>
      )}

      <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
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
            <span>{isSubmitting ? submittingLabel : submitLabel}</span>
            <span className="font-display text-xl group-hover:translate-x-1 transition-transform">
              →
            </span>
          </button>
        )}
      </form.Subscribe>
    </form>
  )
}
