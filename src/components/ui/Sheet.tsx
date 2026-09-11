import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

import { IconButton } from './Button'

export interface SheetProps {
  open: boolean
  title?: string
  subtitle?: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  size?: 'auto' | 'tall'
  inline?: boolean
}

export function Sheet({
  open,
  title,
  subtitle,
  onClose,
  children,
  footer,
  size = 'auto',
  inline = false,
}: SheetProps) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  const content = (
    <div className="sheet" role="presentation">
      <button type="button" className="sheet__backdrop" aria-label="Cerrar panel" onClick={onClose} />
      <section
        className={['sheet__panel', `sheet__panel--${size}`].join(' ')}
        role="dialog"
        aria-modal="true"
        aria-label={title ?? 'Panel'}
      >
        <header className="sheet__header">
          <div className="sheet__heading">
            {title ? <h2 className="sheet__title">{title}</h2> : null}
            {subtitle ? <p className="sheet__subtitle">{subtitle}</p> : null}
          </div>
          <IconButton icon="close" label="Cerrar" variant="ghost" size="sm" onClick={onClose} />
        </header>
        <div className="sheet__body">{children}</div>
        {footer ? <footer className="sheet__footer">{footer}</footer> : null}
      </section>
    </div>
  )

  return inline ? content : createPortal(content, document.body)
}
