import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Feedback'
import { Icon } from '@/components/ui/Icons'
import type { ARCapabilities } from '@/domain/ar/types'
import type { ExperienceDefinition } from '@/domain/experience/types'

interface ARStartOverlayProps {
  experience: ExperienceDefinition
  capabilities: ARCapabilities
  onStart: () => void
  onStartStudio: () => void
  onExit: () => void
}

function resolveCopy(capabilities: ARCapabilities) {
  if (capabilities.status === 'webxr') {
    return {
      label: 'Comenzar en AR',
      message: 'Tu navegador admite realidad aumentada. Colocaremos la escena sobre una superficie real.',
      chip: 'WebXR disponible',
    }
  }
  if (capabilities.status === 'camera') {
    return {
      label: 'Comenzar con cámara',
      message: 'Usaremos la cámara para superponer la escena sobre tu entorno.',
      chip: 'Modo cámara',
    }
  }
  return {
    label: 'Explorar en 3D',
    message: 'Este navegador no admite realidad aumentada, pero puedes recorrer la escena en 3D.',
    chip: 'Vista 3D',
  }
}

export function ARStartOverlay({
  experience,
  capabilities,
  onStart,
  onStartStudio,
  onExit,
}: ARStartOverlayProps) {
  const copy = resolveCopy(capabilities)
  const checking = capabilities.status === 'checking'

  return (
    <section className="ar-start" aria-labelledby="ar-start-title">
      <img className="ar-start__image" src={experience.coverImage} alt="" aria-hidden="true" />
      <div className="ar-start__scrim" />
      <div className="ar-start__content">
        <div className="ar-start__top">
          <button type="button" className="back-button back-button--light" onClick={onExit}>
            <Icon name="arrow-left" size={20} />
            <span>Salir</span>
          </button>
          <Chip tone="accent" icon="sparkle">
            {copy.chip}
          </Chip>
        </div>

        <div className="ar-start__card">
          <h1 className="ar-start__title" id="ar-start-title">
            Prepara tu espacio
          </h1>
          <p className="ar-start__experience">{experience.name}</p>
          <p className="ar-start__hint">{experience.ar.placementHint}</p>

          <ul className="ar-start__tips">
            <li>
              <Icon name="check" size={16} />
              Busca una superficie plana con buena luz.
            </li>
            <li>
              <Icon name="check" size={16} />
              Concede el permiso de cámara cuando el navegador lo solicite.
            </li>
            <li>
              <Icon name="check" size={16} />
              Podrás girar, escalar y reubicar la experiencia.
            </li>
          </ul>

          <p className="ar-start__message">{checking ? 'Comprobando compatibilidad del dispositivo…' : copy.message}</p>

          <div className="ar-start__actions">
            <Button
              size="lg"
              fullWidth
              iconLeft={capabilities.status === 'camera' ? 'camera' : capabilities.status === 'webxr' ? 'cube' : 'compass'}
              onClick={onStart}
              disabled={checking}
              loading={checking}
            >
              {copy.label}
            </Button>
            {capabilities.status !== 'unsupported' ? (
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                iconLeft="cube"
                onClick={onStartStudio}
              >
                Explorar en 3D
              </Button>
            ) : null}
            <Button variant="ghost" size="sm" fullWidth onClick={onExit}>
              Volver al menú principal
            </Button>
          </div>
        </div>

        {checking ? (
          <div className="ar-start__checking">
            <Spinner size={18} />
            <span>Preparando la experiencia…</span>
          </div>
        ) : null}
      </div>
    </section>
  )
}
