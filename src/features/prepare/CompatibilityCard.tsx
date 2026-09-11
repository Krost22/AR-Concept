import { Icon } from '@/components/ui/Icons'
import { Spinner } from '@/components/ui/Feedback'
import type { ARCapabilities } from '@/domain/ar/types'

interface CompatibilityCardProps {
  capabilities: ARCapabilities
}

export function CompatibilityCard({ capabilities }: CompatibilityCardProps) {
  if (capabilities.status === 'checking') {
    return (
      <div className="compatibility compatibility--checking">
        <Spinner size={22} />
        <div>
          <h3 className="compatibility__title">Comprobando compatibilidad</h3>
          <p className="compatibility__text">Revisando cámara y realidad aumentada del navegador…</p>
        </div>
      </div>
    )
  }

  if (capabilities.status === 'webxr') {
    return (
      <div className="compatibility compatibility--ready">
        <span className="compatibility__icon">
          <Icon name="check" size={18} />
        </span>
        <div>
          <h3 className="compatibility__title">Realidad aumentada lista</h3>
          <p className="compatibility__text">
            Tu navegador admite WebXR. Podrás colocar la experiencia sobre una superficie real y
            caminar a su alrededor.
          </p>
        </div>
      </div>
    )
  }

  if (capabilities.status === 'camera') {
    return (
      <div className="compatibility compatibility--assisted">
        <span className="compatibility__icon">
          <Icon name="camera" size={18} />
        </span>
        <div>
          <h3 className="compatibility__title">Modo cámara disponible</h3>
          <p className="compatibility__text">
            Usaremos la cámara para superponer la escena sobre tu entorno. Para AR completa, abre la
            app en Chrome para Android con ARCore.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="compatibility compatibility--unsupported">
      <span className="compatibility__icon">
        <Icon name="warning" size={18} />
      </span>
      <div>
        <h3 className="compatibility__title">
          Tu dispositivo no admite realidad aumentada en este navegador
        </h3>
        <p className="compatibility__text">
          Puedes explorar el modelo en 3D con controles táctiles o con el ratón, sin usar la cámara.
        </p>
      </div>
    </div>
  )
}
