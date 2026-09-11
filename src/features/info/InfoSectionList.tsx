import { useState } from 'react'

import { Chip } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icons'
import { getInfoSectionLabel } from '@/domain/experience/registry'
import type { ExperienceInfoSection } from '@/domain/experience/types'

interface InfoSectionListProps {
  sections: ExperienceInfoSection[]
  initialOpenId?: string | null
  focusedId?: string | null
  onSectionToggle?: (sectionId: string) => void
}

export function InfoSectionList({
  sections,
  initialOpenId = null,
  focusedId = null,
  onSectionToggle,
}: InfoSectionListProps) {
  const [openSectionId, setOpenSectionId] = useState<string | null>(
    initialOpenId ?? sections[0]?.id ?? null,
  )

  function handleToggle(sectionId: string, isOpen: boolean) {
    const next = isOpen ? null : sectionId
    setOpenSectionId(next)
    onSectionToggle?.(sectionId)
  }

  return (
    <div className="info__sections" aria-label="Secciones de información">
      {sections.map((section) => {
        const isOpen = openSectionId === section.id
        const isFocused = focusedId === section.id
        return (
          <article
            className={[
              'info-item',
              isOpen ? 'info-item--open' : '',
              isFocused ? 'info-item--focused' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            key={section.id}
          >
            <button
              type="button"
              className="info-item__header"
              aria-expanded={isOpen}
              onClick={() => handleToggle(section.id, isOpen)}
            >
              <span className="info-item__header-text">
                <Chip tone={section.kind === 'history' ? 'accent' : 'neutral'}>
                  {getInfoSectionLabel(section.kind)}
                </Chip>
                <span className="info-item__title">{section.title}</span>
                <span className="info-item__summary">{section.summary}</span>
              </span>
              <span className={['info-item__chevron', isOpen ? 'is-open' : ''].join(' ')}>
                <Icon name="chevron-down" size={18} />
              </span>
            </button>

            {isOpen ? (
              <div className="info-item__body">
                <p>{section.body}</p>
                {section.fact ? (
                  <p className="info-item__fact">
                    <Icon name="sparkle" size={15} />
                    <span>{section.fact}</span>
                  </p>
                ) : null}
              </div>
            ) : null}
          </article>
        )
      })}
    </div>
  )
}
