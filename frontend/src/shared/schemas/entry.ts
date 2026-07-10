import { z } from 'zod'
import { entryTypeSchema } from '../enums/entryType'

export const entrySchema = z.object({
  type: entryTypeSchema,
  amount: z
    .string()
    .min(1, 'Betrag erforderlich')
    .refine((v) => Number(v) > 0, 'Muss größer als 0 sein'),
  date: z.string().min(1, 'Datum erforderlich'),
  description: z.string(),
})

export type EntryInput = z.infer<typeof entrySchema>
