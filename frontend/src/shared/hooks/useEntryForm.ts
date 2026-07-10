import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { entrySchema, type EntryInput } from '../schemas/entry'
import { EntryType } from '../enums/entryType'

const defaults: EntryInput = {
  amount: '',
  description: '',
  date: new Date().toISOString().slice(0, 10),
  type: EntryType.EXPENSE,
}

type Options = {
  initial?: EntryInput
  onSubmit: (input: EntryInput) => Promise<void>
}

export function useEntryForm({ initial, onSubmit }: Options) {
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: initial ?? defaults,
    validators: { onChange: entrySchema },
    onSubmit: async ({ value }) => {
      setSubmitError(null)
      try {
        await onSubmit(value)
      } catch {
        setSubmitError('Speichern fehlgeschlagen. Erneut versuchen.')
      }
    },
  })

  return { form, submitError }
}
