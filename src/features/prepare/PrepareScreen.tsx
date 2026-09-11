import { useNavigation } from '@/app/navigation/NavigationContext'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Card'
import { StateMessage } from '@/components/ui/Feedback'
import { Icon } from '@/components/ui/Icons'
import { getExperience } from '@/domain/experience/registry'
import { useARCapabilities } from '@/hooks/useARCapabilities'
import { CompatibilityCard } from './CompatibilityCard'

interface PrepareScreenProps {
  experienceId: string
}

export function PrepareScreen({ experienceId }: PrepareScreenProps) {
  const { navigate, goBack, goHome } = useNavigation()
  const capabilities = useARCapabilities()
  const experience = getExperience(experienceId)

  if (!experience) {
    return (
      <main className="screen">
        <StateMessage
          tone="warning"
          icon="warning"
          title="Experiencia no encontrada"
          message="No pudimos cargar esta experiencia. Vuelve al inicio y elige una de las disponibles."
          actions={<Button onClick={goHome}>Volver al inicio</Button>}
        />
      </main>
    )
  }

  const arAvailable = capabilities.status === 'webxr' || capabilities.status === 'camera'
  const checking = capabilities.status === 'checking'
  const primaryLabel = checking
    ? 'Comprobando compatibilidad'
    : capabilities.status === 'webxr'
      ? 'Iniciar experiencia AR'
      : capabilities.status === 'camera'
        ? 'Comenzar con cámara'
        : 'Explorar en 3D'

  return (
    <main className="screen prepare">
      <header className="screen__topbar screen__topbar--overlay">
        <button type="button" className="back-button" onClick={goBack} aria-label="Volver al inicio">
          <Icon name="arrow-left" size={20} />
          <span>Inicio</span>
        </button>
      </header>

      <section className="prepare__hero">
        <img className="prepare__hero-image" src={experience.heroImage} alt="" aria-hidden="true" />
        <div className="prepare__hero-overlay">
          <div className="prepare__hero-tags">
            <Chip tone="accent">{experience.era}</Chip>
            <Chip tone="neutral">{experience.durationMinutes} min</Chip>
          </div>
          <h1 className="prepare__title">{experience.name}</h1>
          <p className="prepare__tagline">{experience.tagline}</p>
        </div>
      </section>

      <section className="prepare__content">
        <p className="prepare__description">{experience.description}</p>

        <ul className="prepare__highlights">
          {experience.highlights.map((highlight) => (
            <li className="prepare__highlight" key={highlight.label}>
              <span className="prepare__highlight-icon">
                <Icon name={highlight.icon} size={18} />
              </span>
              <div>
                <span className="prepare__highlight-label">{highlight.label}</span>
                <span className="prepare__highlight-value">{highlight.value}</span>
              </div>
            </li>
          ))}
        </ul>

        <div className="prepare__section">
          <h2 className="prepare__section-title">Compatible con</h2>
          <CompatibilityCard capabilities={capabilities} />
        </div>

        <div className="prepare__section">
          <h2 className="prepare__section-title">Qué vas a encontrar</h2>
          <ul className="prepare__list">
            {experience.animations.map((animation) => (
              <li className="prepare__list-item" key={animation.id}>
                <span className="prepare__list-icon">
                  <Icon name={animation.trigger === 'auto' ? 'sparkle' : 'play'} size={15} />
                </span>
                <div className="prepare__list-text">
                  <span className="prepare__list-label">{animation.label}</span>
                  <span className="prepare__list-description">{animation.description}</span>
                </div>
                <Chip tone={animation.trigger === 'auto' ? 'neutral' : 'success'}>
                  {animation.trigger === 'auto' ? 'Ambiente' : 'Interactivo'}
                </Chip>
              </li>
            ))}
          </ul>
        </div>

        <div className="prepare__section">
          <h2 className="prepare__section-title">Antes de comenzar</h2>
          <ul className="prepare__tips">
            <li>
              <Icon name="check" size={16} />
              Busca una superficie plana y bien iluminada.
            </li>
            <li>
              <Icon name="check" size={16} />
              Mueve lentamente el teléfono para que el AR reconozca el entorno.
            </li>
            <li>
              <Icon name="check" size={16} />
              Puedes girar, acercar y reubicar el modelo en cualquier momento.
            </li>
          </ul>
        </div>
      </section>

      <div className="prepare__actions">
        <Button
          size="lg"
          fullWidth
          iconLeft={arAvailable ? 'camera' : 'cube'}
          disabled={checking}
          loading={checking}
          onClick={() => navigate({ name: 'ar', experienceId: experience.id })}
        >
          {primaryLabel}
        </Button>
        {arAvailable ? (
          <Button
            variant="secondary"
            size="md"
            fullWidth
            iconLeft="cube"
            onClick={() => navigate({ name: 'ar', experienceId: experience.id, mode: 'studio' })}
          >
            Explorar en 3D
          </Button>
        ) : null}
        <Button
          variant="ghost"
          size="md"
          fullWidth
          iconLeft="history"
          onClick={() => navigate({ name: 'info', experienceId: experience.id })}
        >
          Información histórica
        </Button>
      </div>

      {experience.model.attribution ? (
        <p className="prepare__credits">{experience.model.attribution}</p>
      ) : null}
    </main>
  )
}
