import { Button, IconButton } from '@/components/ui/Button'
import type { ARControlDefinition, IconName } from '@/domain/experience/types'
import { Icon } from '@/components/ui/Icons'

interface ARToolbarProps {
  primary?: ARControlDefinition
  secondary: ARControlDefinition[]
  primaryActive: boolean
  onControl: (control: ARControlDefinition) => void
  onOpenSettings: () => void
}

export function ARToolbar({
  primary,
  secondary,
  primaryActive,
  onControl,
  onOpenSettings,
}: ARToolbarProps) {
  return (
    <div className="ar-toolbar">
      {primary ? (
        <Button
          size="md"
          variant={primaryActive ? 'secondary' : 'primary'}
          iconLeft={(primaryActive ? 'stop' : primary.icon) as IconName}
          onClick={() => onControl(primary)}
          className="ar-toolbar__primary"
        >
          {primaryActive ? (primary.activeLabel ?? primary.label) : primary.label}
        </Button>
      ) : null}

      <div className="ar-toolbar__icons">
        {secondary.map((control) => (
          <IconButton
            key={control.id}
            icon={control.icon}
            label={control.label}
            variant="glass"
            onClick={() => onControl(control)}
          />
        ))}
        <IconButton
          icon="sliders"
          label="Ajustes de la experiencia"
          variant="glass"
          onClick={onOpenSettings}
        />
      </div>
    </div>
  )
}

export function ARHint({ icon, text }: { icon: IconName; text: string }) {
  return (
    <div className="ar-hint" role="status">
      <span className="ar-hint__icon">
        <Icon name={icon} size={16} />
      </span>
      <p className="ar-hint__text">{text}</p>
    </div>
  )
}
