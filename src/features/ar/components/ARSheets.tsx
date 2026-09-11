import { Button } from '@/components/ui/Button'
import { Sheet } from '@/components/ui/Sheet'
import { Slider } from '@/components/ui/Slider'
import type { ARCapabilities, ARRuntimeMode } from '@/domain/ar/types'
import type { ExperienceDefinition } from '@/domain/experience/types'
import { InfoSectionList } from '@/features/info/InfoSectionList'

interface ARInfoSheetProps {
  open: boolean
  inline: boolean
  experience: ExperienceDefinition
  focusedInfoId: string | null
  onClose: () => void
  onSectionToggle: (sectionId: string) => void
}

export function ARInfoSheet({
  open,
  inline,
  experience,
  focusedInfoId,
  onClose,
  onSectionToggle,
}: ARInfoSheetProps) {
  return (
    <Sheet
      open={open}
      inline={inline}
      title="Información histórica"
      subtitle={experience.name}
      onClose={onClose}
      size="tall"
    >
      <InfoSectionList
        sections={experience.info}
        initialOpenId={focusedInfoId}
        focusedId={focusedInfoId}
        onSectionToggle={onSectionToggle}
      />
    </Sheet>
  )
}

interface ARSettingsSheetProps {
  open: boolean
  inline: boolean
  experience: ExperienceDefinition
  mode: ARRuntimeMode
  capabilities: ARCapabilities
  userScale: number
  onScaleChange: (value: number) => void
  onRelocate: () => void
  onReset: () => void
  onSwitchMode: (mode: ARRuntimeMode) => void
  onClose: () => void
}

export function ARSettingsSheet({
  open,
  inline,
  experience,
  mode,
  capabilities,
  userScale,
  onScaleChange,
  onRelocate,
  onReset,
  onSwitchMode,
  onClose,
}: ARSettingsSheetProps) {
  const scale = experience.ar.scaleRange
  const scalePercent = `${Math.round(userScale * 100)}%`

  return (
    <Sheet open={open} inline={inline} title="Ajustes de la experiencia" onClose={onClose}>
      {experience.ar.allowScale ? (
        <Slider
          label="Escala del modelo"
          min={scale.min}
          max={scale.max}
          step={0.05}
          value={userScale}
          valueLabel={scalePercent}
          onChange={onScaleChange}
        />
      ) : null}

      <div className="ar-settings__actions">
        {experience.ar.allowRelocate && mode !== 'studio' ? (
          <Button variant="secondary" size="md" fullWidth iconLeft="move" onClick={onRelocate}>
            Reubicar experiencia
          </Button>
        ) : null}
        <Button variant="secondary" size="md" fullWidth iconLeft="restart" onClick={onReset}>
          Reiniciar vista
        </Button>
      </div>

      <div className="ar-settings__modes">
        <p className="ar-settings__modes-title">Modo de visualización</p>
        {mode !== 'studio' ? (
          <Button variant="ghost" size="sm" fullWidth iconLeft="cube" onClick={() => onSwitchMode('studio')}>
            Cambiar a vista 3D
          </Button>
        ) : null}
        {mode !== 'camera' && capabilities.camera ? (
          <Button variant="ghost" size="sm" fullWidth iconLeft="camera" onClick={() => onSwitchMode('camera')}>
            Usar la cámara
          </Button>
        ) : null}
        {mode !== 'webxr' && capabilities.webxr ? (
          <Button variant="ghost" size="sm" fullWidth iconLeft="sparkle" onClick={() => onSwitchMode('webxr')}>
            Realidad aumentada
          </Button>
        ) : null}
      </div>

      {experience.model.attribution ? (
        <p className="ar-settings__credits">{experience.model.attribution}</p>
      ) : null}
    </Sheet>
  )
}
