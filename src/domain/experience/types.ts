export type ExperienceId = string

export type SceneKind = 'castle-siege' | 'palace-exploration'

export type IconName =
  | 'arrow-left'
  | 'camera'
  | 'check'
  | 'chevron-down'
  | 'close'
  | 'compass'
  | 'cube'
  | 'expand'
  | 'history'
  | 'info'
  | 'layers'
  | 'map-pin'
  | 'move'
  | 'play'
  | 'restart'
  | 'scale'
  | 'sliders'
  | 'sparkle'
  | 'stop'
  | 'warning'

export type InfoSectionKind = 'history' | 'architecture' | 'curiosity' | 'practical'

export interface ExperienceInfoSection {
  id: string
  kind: InfoSectionKind
  title: string
  summary: string
  body: string
  fact?: string
}

export interface ExperienceAnimation {
  id: string
  label: string
  description: string
  trigger: 'auto' | 'manual'
}

export type ARControlId = 'toggle-playback' | 'replay' | 'reset' | 'info' | 'focus-points'

export interface ARControlDefinition {
  id: ARControlId
  label: string
  activeLabel?: string
  icon: IconName
  emphasis?: 'primary' | 'default'
}

export interface ExperienceARConfig {
  environment: string
  placementHint: string
  targetSizeMeters: number
  initialScale: number
  scaleRange: { min: number; max: number }
  allowScale: boolean
  allowRelocate: boolean
  controls: ARControlDefinition[]
}

export interface ExperienceHighlight {
  icon: IconName
  label: string
  value: string
}

export interface ExperienceModelConfig {
  src?: string
  attribution?: string
}

export interface ExperienceDefinition {
  id: ExperienceId
  name: string
  tagline: string
  shortDescription: string
  description: string
  coverImage: string
  heroImage: string
  location: string
  era: string
  durationMinutes: number
  tags: string[]
  highlights: ExperienceHighlight[]
  scene: SceneKind
  model: ExperienceModelConfig
  animations: ExperienceAnimation[]
  info: ExperienceInfoSection[]
  ar: ExperienceARConfig
}

export const INFO_SECTION_LABELS: Record<InfoSectionKind, string> = {
  history: 'Historia',
  architecture: 'Arquitectura',
  curiosity: 'Dato curioso',
  practical: 'Visita',
}
