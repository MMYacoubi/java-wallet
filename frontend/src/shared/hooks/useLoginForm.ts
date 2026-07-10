import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { loginSchema, type LoginInput } from '../schemas/login'
import { ApiError } from '../lib/api'
import { useAuth } from '../lib/auth'

type Options = {
  onSuccess: () => void
}

const defaults: LoginInput = { username: '', password: '' }

export function useLoginForm({ onSuccess }: Options) {
  const auth = useAuth()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: defaults,
    validators: { onChange: loginSchema },
    onSubmit: async ({ value }) => {
      setSubmitError(null)
      try {
        await auth.login(value.username, value.password)
        onSuccess()
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          setSubmitError('Ungültige Zugangsdaten')
        } else {
          setSubmitError('Anmeldung fehlgeschlagen. Erneut versuchen.')
        }
      }
    },
  })

  return { form, submitError }
}
