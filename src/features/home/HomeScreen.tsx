import { useNavigation } from '@/app/navigation/NavigationContext'
import { Icon } from '@/components/ui/Icons'
import { getAllExperiences } from '@/domain/experience/registry'
import { assetUrl } from '@/lib/assets'
import { ExperienceCard } from './ExperienceCard'

export function HomeScreen() {
  const { navigate } = useNavigation()
  const experiences = getAllExperiences()

  return (
    <main className="home">
      <header className="home__topbar">
        <div className="brand">
          <span className="brand__mark" aria-hidden="true">
            <Icon name="compass" size={20} />
          </span>
          <div className="brand__text">
            <span className="brand__name">Cartagena Vive</span>
            <span className="brand__tagline">Patrimonio en realidad aumentada</span>
          </div>
        </div>
      </header>

      <section className="home__hero" aria-labelledby="home-hero-title">
        <img
          className="home__hero-image"
          src={assetUrl('images/hero-cartagena.svg')}
          alt="Ilustración del centro histórico de Cartagena de Indias al atardecer"
        />
        <div className="home__hero-overlay">
          <span className="home__hero-kicker">
            <Icon name="sparkle" size={14} />
            Guía interactiva
          </span>
          <h1 className="home__hero-title" id="home-hero-title">
            Recorre la historia de Cartagena en realidad aumentada
          </h1>
          <p className="home__hero-text">
            Coloca fortalezas, palacios y barcos sobre tu propia mesa. Dos experiencias para
            explorar, aprender y recordar.
          </p>
        </div>
      </section>

      <section className="home__experiences" aria-labelledby="experiences-title">
        <div className="section-heading">
          <h2 className="section-heading__title" id="experiences-title">
            Experiencias disponibles
          </h2>
          <span className="section-heading__meta">{experiences.length} recorridos</span>
        </div>

        {experiences.length === 0 ? (
          <p className="home__empty">Muy pronto agregaremos nuevas experiencias patrimoniales.</p>
        ) : (
          <div className="home__experience-list">
            {experiences.map((experience) => (
              <ExperienceCard
                key={experience.id}
                experience={experience}
                onSelect={(selected) =>
                  navigate({ name: 'prepare', experienceId: selected.id })
                }
              />
            ))}
          </div>
        )}
      </section>

      <footer className="home__footer">
        <p>
          Cartagena de Indias · Colombia
          <span className="home__footer-dot" aria-hidden="true">
            •
          </span>
          Prototipo cultural con modelos de demostración
        </p>
      </footer>
    </main>
  )
}
