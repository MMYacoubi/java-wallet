import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

type Props = {
  section: string
  eyebrow: string
  title: string
  italic: string
  lede: string
  altPrompt: string
  altLabel: string
  altTo: '/login' | '/register'
  children: ReactNode
}

export function AuthShell({
  section,
  eyebrow,
  title,
  italic,
  lede,
  altPrompt,
  altLabel,
  altTo,
  children,
}: Props) {
  return (
    <div className="mx-auto max-w-[1280px] grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-0 lg:gap-16 px-8 py-16 lg:py-24">
      {/* Editorial column */}
      <section className="relative pb-16 lg:pb-0 lg:pr-16 lg:border-r border-rule">
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-ink-soft mb-12">
          <span className="inline-block h-px w-8 bg-rule" />
          <span>§ {section}</span>
          <span>—</span>
          <span>{eyebrow}</span>
        </div>

        <h1 className="font-display text-ink leading-[0.92] tracking-[-0.02em] text-[clamp(3.5rem,8vw,7.5rem)]">
          {title}
          <br />
          <em className="italic text-emerald-ink">{italic}</em>
        </h1>

        <p className="mt-10 max-w-md text-sm leading-relaxed text-ink-soft">
          {lede}
        </p>

        <div className="mt-20 hidden lg:flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-ink-soft">
          <span>Folio · {section.padStart(2, '0')}</span>
          <span className="font-display text-2xl text-ink">
            ✦
          </span>
          <span>Confidential</span>
        </div>
      </section>

      {/* Form column */}
      <section className="relative lg:pl-4">
        <div className="relative bg-paper-deep border border-ink shadow-[12px_12px_0_-1px_var(--color-ink)]">
          <div className="absolute -top-3 left-6 bg-paper px-3 text-[10px] uppercase tracking-[0.3em] text-ink">
            Formular
          </div>

          <div className="p-8 lg:p-12">{children}</div>

          <div className="border-t border-ink/20 px-8 lg:px-12 py-4 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-ink-soft">
            <span>{altPrompt}</span>
            <Link
              to={altTo}
              className="text-ink underline decoration-emerald-ink decoration-2 underline-offset-4 hover:text-emerald-ink transition-colors"
            >
              {altLabel}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
