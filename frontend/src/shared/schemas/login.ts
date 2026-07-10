import { z } from 'zod'

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'Benutzername erforderlich')
    .min(3, 'Mindestens 3 Zeichen'),
  password: z.string().min(1, 'Passwort erforderlich'),
})

export type LoginInput = z.infer<typeof loginSchema>
