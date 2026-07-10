const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8080'

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

import type { EntryInput } from '../schemas/entry'
import { EntryType } from '../enums/entryType'
import { Role } from '../enums/role'

export type Me = { id: number; username: string; role: Role }

export type Entry = {
  id: number
  amount: string
  description: string | null
  date: string
  type: EntryType
}

export type AdminUser = {
  id: number
  username: string
  role: Role
  locked: boolean
}

export type FinanceStats = {
  totalCount: number
  incomeCount: number
  expenseCount: number
  incomeTotal: string
  expenseTotal: string
}

export type { EntryInput } from '../schemas/entry'
export { EntryType } from '../enums/entryType'
export { Role } from '../enums/role'

let onUnauthorizedHandler: (() => void) | null = null
export function onUnauthorized(handler: () => void) {
  onUnauthorizedHandler = handler
}

const SKIP_401_HANDLER = new Set([
  '/auth/me',
  '/auth/login',
  '/auth/register',
])

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  })
  if (!res.ok) {
    if (res.status === 401 && !SKIP_401_HANDLER.has(path)) {
      onUnauthorizedHandler?.()
    }
    let msg = res.statusText
    try {
      const body = await res.json()
      msg = body.message ?? msg
    } catch {
      // ignore
    }
    throw new ApiError(res.status, msg)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const api = {
  register: (username: string, password: string) =>
    request<{ message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  login: (username: string, password: string) =>
    request<{ message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  logout: () =>
    request<{ message: string }>('/auth/logout', { method: 'POST' }),
  me: () => request<Me>('/auth/me'),

  listEntries: () => request<Entry[]>('/entries'),
  getEntry: (id: number | string) => request<Entry>(`/entries/${id}`),
  createEntry: (input: EntryInput) =>
    request<Entry>('/entries', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  updateEntry: (id: number | string, input: EntryInput) =>
    request<Entry>(`/entries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    }),
  deleteEntry: (id: number | string) =>
    request<void>(`/entries/${id}`, { method: 'DELETE' }),

  listAdminUsers: () => request<AdminUser[]>('/admin/users'),
  updateUserRole: (id: number | string, role: Role) =>
    request<AdminUser>(`/admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    }),
  updateUserLock: (id: number | string, locked: boolean) =>
    request<AdminUser>(`/admin/users/${id}/lock`, {
      method: 'PUT',
      body: JSON.stringify({ locked }),
    }),

  listUserEntries: (userId: number | string) =>
    request<Entry[]>(`/admin/users/${userId}/entries`),
  getUserEntry: (userId: number | string, id: number | string) =>
    request<Entry>(`/admin/users/${userId}/entries/${id}`),
  createUserEntry: (userId: number | string, input: EntryInput) =>
    request<Entry>(`/admin/users/${userId}/entries`, {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  updateUserEntry: (
    userId: number | string,
    id: number | string,
    input: EntryInput,
  ) =>
    request<Entry>(`/admin/users/${userId}/entries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    }),
  deleteUserEntry: (userId: number | string, id: number | string) =>
    request<void>(`/admin/users/${userId}/entries/${id}`, { method: 'DELETE' }),

  getUserStats: (userId: number | string) =>
    request<FinanceStats>(`/admin/users/${userId}/stats`),
}
