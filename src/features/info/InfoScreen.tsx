import { useNavigation } from '@/app/navigation/NavigationContext'
import { Button } from '@/components/ui/Button'
import { StateMessage } from '@/components/ui/Feedback'
import { Icon } from '@/components/ui/Icons'
import { getExperience } from '@/domain/experience/registry'
import { InfoSectionList } from './InfoSectionList'

interface InfoScreenProps {
  experienceId: string
  sectionId?: string
}

export function InfoScreen({ experienceId, sectionId }: InfoScreenProps) {
  const { goBack, goHome, navigate } = useNavigation()
  const experience = getExperience(experienceId)

  if (!experience) {
    return (
      <main className="screen">
        <StateMessage
          tone="warning"
          icon="warning"
          title="Información no disponible"
          message="No pudimos encontrar el contenido histórico de esta experiencia."
          actions={<Button onClick={goHome}>Volver al inicio</Button>}
        />
      </main>
    )
  }

  return (
    <main className="screen info">
      <header className="screen__topbar">
        <button
          type="button"
          className="back-button"
          onClick={goBack}
          aria-label="Volver a la experiencia"
        >
          <Icon name="arrow-left" size={20} />
          <span>Atrás</span>
        </button>
        <Button
          variant="ghost"
          size="sm"
          iconLeft="cube"
          onClick={() => navigate({ name: 'ar', experienceId: experience.id, mode: 'studio' })}
        >
          Ver en 3D
        </Button>
      </header>

      <section className="info__intro">
        <span className="info__kicker">
          <Icon name="history" size={14} />
          {experience.era}
        </span>
        <h1 className="info__title">{experience.name}</h1>
        <p className="info__lead">{experience.shortDescription}</p>
      </section>

      {experience.info.length === 0 ? (
        <StateMessage
          icon="sparkle"
          title="Contenido en preparación"
          message="Estamos documentando esta experiencia. Vuelve pronto para descubrir más detalles."
        />
      ) : (
        <InfoSectionList sections={experience.info} initialOpenId={sectionId ?? null} />
      )}

      <div className="info__actions">
        <Button
          size="lg"
          fullWidth
          iconLeft="camera"
          onClick={() => navigate({ name: 'ar', experienceId: experience.id })}
        >
          Vivir la experiencia AR
        </Button>
      </div>
    </main>
  )
}
