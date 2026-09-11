import { castleExperience } from './definitions/castle'
import { palaceExperience } from './definitions/palace'
import type { ExperienceDefinition, ExperienceId, InfoSectionKind } from './types'
import { INFO_SECTION_LABELS } from './types'

const experienceList: readonly ExperienceDefinition[] = [castleExperience, palaceExperience]

const experienceIndex = new Map<ExperienceId, ExperienceDefinition>(
  experienceList.map((experience) => [experience.id, experience]),
)

export function getAllExperiences(): readonly ExperienceDefinition[] {
  return experienceList
}

export function getExperience(id: ExperienceId | null | undefined): ExperienceDefinition | undefined {
  if (!id) return undefined
  return experienceIndex.get(id)
}

export function getInfoSectionLabel(kind: InfoSectionKind): string {
  return INFO_SECTION_LABELS[kind]
}
