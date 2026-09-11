import { IconButton } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icons'
import type { IconName } from '@/domain/experience/types'

interface ARTopBarProps {
  title: string
  modeLabel: string
  modeIcon: IconName
  statusLabel: string
  onExit: () => void
  onOpenInfo: () => void
}

export function ARTopBar({
  title,
  modeLabel,
  modeIcon,
  statusLabel,
  onExit,
  onOpenInfo,
}: ARTopBarProps) {
  return (
    <header className="ar-topbar">
      <IconButton
        icon="arrow-left"
        label="Salir de la experiencia"
        variant="glass"
        onClick={onExit}
      />
      <div className="ar-status" role="status" aria-live="polite" title={title}>
        <Icon name={modeIcon} size={14} />
        <span className="ar-status__mode">{modeLabel}</span>
        <span className="ar-status__divider" aria-hidden="true" />
        <span className="ar-status__label">{statusLabel}</span>
      </div>
      <IconButton
        icon="info"
        label="Información histórica"
        variant="glass"
        onClick={onOpenInfo}
      />
    </header>
  )
}
