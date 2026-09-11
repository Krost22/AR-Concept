import type { SceneBridge } from '@/domain/ar/types'

export interface SceneProps {
  bridge: SceneBridge
  quality?: 'high' | 'low'
}

export interface SceneModule {
  displaySpan: number
  cameraDistance: number
  cameraTarget: [number, number, number]
}
