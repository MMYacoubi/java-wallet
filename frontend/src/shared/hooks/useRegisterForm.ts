import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { registerSchema, type RegisterInput } from '../schemas/register'
import { ApiError } from '../lib/api'
import { useAuth } from '../lib/auth'

type Options = {
  onSuccess: () => void
}

const defaults: RegisterInput = { username: '', password: '', confirm: '' }

export function useRegisterForm({ onSuccess }: Options) {
  const auth = useAuth()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: defaults,
    validators: { onChange: registerSchema },
    onSubmit: async ({ value }) => {
      setSubmitError(null)
      try {
        await auth.register(value.username, value.password)
        onSuccess()
      } catch (err) {
        if (err instanceof ApiError && err.status === 409) {
          setSubmitError('Benutzername bereits vergeben')
        } else {
          setSubmitError('Registrierung fehlgeschlagen. Erneut versuchen.')
        }
      }
    },
  })

  return { form, submitError }
}
