import { Chip } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icons'
import type { ExperienceDefinition } from '@/domain/experience/types'

interface ExperienceCardProps {
  experience: ExperienceDefinition
  onSelect: (experience: ExperienceDefinition) => void
}

export function ExperienceCard({ experience, onSelect }: ExperienceCardProps) {
  return (
    <article className="experience-card">
      <div className="experience-card__media">
        <img
          className="experience-card__image"
          src={experience.coverImage}
          alt={`Vista ilustrada de ${experience.name}`}
          loading="lazy"
        />
        <div className="experience-card__media-tags">
          {experience.tags.slice(0, 2).map((tag) => (
            <Chip key={tag} tone="accent">
              {tag}
            </Chip>
          ))}
        </div>
      </div>

      <div className="experience-card__body">
        <h3 className="experience-card__title">{experience.name}</h3>
        <p className="experience-card__text">{experience.shortDescription}</p>

        <ul className="experience-card__meta">
          <li>
            <Icon name="map-pin" size={15} />
            <span>{experience.location.split(',')[0]}</span>
          </li>
          <li>
            <Icon name="history" size={15} />
            <span>{experience.era}</span>
          </li>
          <li>
            <Icon name="compass" size={15} />
            <span>{experience.durationMinutes} min</span>
          </li>
        </ul>
      </div>

      <button
        type="button"
        className="experience-card__hit"
        aria-label={`Ver ${experience.name} en realidad aumentada`}
        onClick={() => onSelect(experience)}
      >
        <span className="experience-card__cta">
          <Icon name="cube" size={18} />
          Ver en AR
        </span>
      </button>
    </article>
  )
}
