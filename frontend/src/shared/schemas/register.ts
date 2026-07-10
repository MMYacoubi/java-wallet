import { z } from 'zod'

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, 'Benutzername erforderlich')
      .min(3, 'Mindestens 3 Zeichen'),
    password: z
      .string()
      .min(1, 'Passwort erforderlich')
      .min(8, 'Mindestens 8 Zeichen'),
    confirm: z.string().min(1, 'Bitte bestätigen'),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'Passwörter stimmen nicht überein',
    path: ['confirm'],
  })

export type RegisterInput = z.infer<typeof registerSchema>
