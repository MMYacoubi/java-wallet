import type { ChangeEvent, HTMLInputTypeAttribute } from 'react'

type FieldProps = {
  index: string
  label: string
  hint?: string
  type?: HTMLInputTypeAttribute
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onBlur: () => void
  error?: string
  autoComplete?: string
  placeholder?: string
  step?: string
  inputMode?: 'text' | 'decimal' | 'numeric' | 'email' | 'tel' | 'url' | 'search'
  maxLength?: number
}

export function Field({
  index,
  label,
  hint,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  autoComplete,
  placeholder,
  step,
  inputMode,
  maxLength,
}: FieldProps) {
  return (
    <div className="group">
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="flex items-baseline gap-3 text-[10px] uppercase tracking-[0.3em] text-ink">
          <span className="text-ink-soft tabular-nums">{index}</span>
          <span>{label}</span>
        </label>
        {hint && (
          <span className="text-[10px] uppercase tracking-[0.2em] text-ink-soft">
            {hint}
          </span>
        )}
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete={autoComplete}
        placeholder={placeholder}
        step={step}
        inputMode={inputMode}
        maxLength={maxLength}
        className={`w-full bg-transparent border-0 border-b border-ink/40 py-3 px-0
          font-mono text-lg text-ink placeholder:text-ink-soft/50
          focus:outline-none focus:border-emerald-ink transition-colors
          ${error ? 'border-oxblood' : ''}`}
      />
      <div className="min-h-[1rem] mt-1">
        {error && (
          <span className="text-[10px] uppercase tracking-[0.25em] text-oxblood">
            ⚠ {error}
          </span>
        )}
      </div>
    </div>
  )
}
