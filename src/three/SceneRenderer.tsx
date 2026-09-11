import { Suspense } from 'react'

import type { SceneBridge } from '@/domain/ar/types'
import type { ExperienceDefinition } from '@/domain/experience/types'
import { getSceneModule } from './scenes/registry'

interface SceneRendererProps {
  experience: ExperienceDefinition
  bridge: SceneBridge
  quality?: 'high' | 'low'
}

export function SceneRenderer({ experience, bridge, quality }: SceneRendererProps) {
  const sceneModule = getSceneModule(experience.scene)
  const SceneComponent = sceneModule.Component

  return (
    <Suspense fallback={null}>
      <SceneComponent bridge={bridge} experience={experience} quality={quality} />
    </Suspense>
  )
}
