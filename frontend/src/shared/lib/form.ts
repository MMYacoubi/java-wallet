type FieldMeta = { isTouched: boolean; errors: Array<unknown> }

export function fieldError(meta: FieldMeta): string | undefined {
  if (!meta.isTouched) return undefined
  const first = meta.errors[0]
  if (!first) return undefined
  if (typeof first === 'string') return first
  if (typeof first === 'object' && first !== null && 'message' in first) {
    return String((first as { message: unknown }).message)
  }
  return undefined
}
