import { z } from 'zod'

export enum EntryType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export const entryTypeSchema = z.nativeEnum(EntryType)
