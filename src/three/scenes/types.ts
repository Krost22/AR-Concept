import type { SceneBridge } from '@/domain/ar/types'
import type { ExperienceDefinition } from '@/domain/experience/types'

export interface SceneProps {
  bridge: SceneBridge
  experience: ExperienceDefinition
  quality?: 'high' | 'low'
}

export interface SceneModule {
  displaySpan: number
  cameraDistance: number
  cameraTarget: [number, number, number]
}
