import { lazy } from 'react'
import type { ComponentType, LazyExoticComponent } from 'react'

import type { SceneKind } from '@/domain/experience/types'
import type { SceneProps } from './types'

export interface SceneRegistryEntry {
  displaySpan: number
  cameraDistance: number
  cameraTarget: [number, number, number]
  Component: LazyExoticComponent<ComponentType<SceneProps>>
}

export const SCENE_REGISTRY: Record<SceneKind, SceneRegistryEntry> = {
  'castle-siege': {
    displaySpan: 26,
    cameraDistance: 4.6,
    cameraTarget: [0, 0.4, 0],
    Component: lazy(() =>
      import('./castle/CastleScene').then((module) => ({ default: module.CastleScene })),
    ),
  },
  'palace-exploration': {
    displaySpan: 21,
    cameraDistance: 4.2,
    cameraTarget: [0, 0.55, 0],
    Component: lazy(() =>
      import('./palace/PalaceScene').then((module) => ({ default: module.PalaceScene })),
    ),
  },
}

export function getSceneModule(kind: SceneKind): SceneRegistryEntry {
  return SCENE_REGISTRY[kind]
}
