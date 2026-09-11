import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icons'

interface ARErrorOverlayProps {
  title: string
  message: string
  allowRetry: boolean
  onRetry: () => void
  onFallbackTo3D: () => void
  onExit: () => void
}

export function ARErrorOverlay({
  title,
  message,
  allowRetry,
  onRetry,
  onFallbackTo3D,
  onExit,
}: ARErrorOverlayProps) {
  return (
    <div className="ar-error" role="alertdialog" aria-label={title}>
      <div className="ar-error__card">
        <span className="ar-error__icon">
          <Icon name="warning" size={22} />
        </span>
        <h2 className="ar-error__title">{title}</h2>
        <p className="ar-error__message">{message}</p>
        <div className="ar-error__actions">
          <Button size="md" fullWidth iconLeft="cube" onClick={onFallbackTo3D}>
            Explorar en 3D
          </Button>
          {allowRetry ? (
            <Button variant="secondary" size="md" fullWidth iconLeft="restart" onClick={onRetry}>
              Reintentar
            </Button>
          ) : null}
          <Button variant="ghost" size="sm" fullWidth onClick={onExit}>
            Volver al menú principal
          </Button>
        </div>
      </div>
    </div>
  )
}

export function ARLoadingOverlay({ label }: { label: string }) {
  return (
    <div className="ar-loading" role="status" aria-live="polite">
      <span className="ar-loading__spinner" />
      <span className="ar-loading__label">{label}</span>
    </div>
  )
}
