import { z } from 'zod'

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export const roleSchema = z.nativeEnum(Role)
