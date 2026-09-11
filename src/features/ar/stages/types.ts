import type { ReactNode } from 'react'

import type { PlacementState, SceneBridge } from '@/domain/ar/types'
import type { ExperienceDefinition } from '@/domain/experience/types'

export interface ARStageProps {
  experience: ExperienceDefinition
  bridge: SceneBridge
  chrome?: ReactNode
  userScale: number
  resetNonce: number
  placement: PlacementState
  onPlacementChange: (state: PlacementState) => void
  onReady: () => void
}

export interface CameraStageProps extends ARStageProps {
  stream: MediaStream | null
}
