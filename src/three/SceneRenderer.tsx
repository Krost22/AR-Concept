import { Suspense, useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { AnimationMixer, Box3, Mesh, Vector3 } from 'three'

import type { SceneBridge } from '@/domain/ar/types'
import type { ExperienceDefinition } from '@/domain/experience/types'
import { getSceneModule } from './scenes/registry'

interface GltfModelProps {
  src: string
  displaySpan: number
}

function GltfModel({ src, displaySpan }: GltfModelProps) {
  const gltf = useGLTF(src)

  const root = useMemo(() => {
    const cloned = gltf.scene.clone(true)
    cloned.traverse((child) => {
      const mesh = child as Mesh
      if (mesh.isMesh) {
        mesh.castShadow = true
        mesh.receiveShadow = true
      }
    })

    const bounds = new Box3().setFromObject(cloned)
    const size = bounds.getSize(new Vector3())
    const maxDimension = Math.max(size.x, size.y, size.z) || 1
    cloned.scale.setScalar(displaySpan / maxDimension)

    bounds.setFromObject(cloned)
    const center = bounds.getCenter(new Vector3())
    cloned.position.set(-center.x, -bounds.min.y, -center.z)

    return cloned
  }, [gltf, displaySpan])

  const mixer = useMemo(
    () => (gltf.animations.length > 0 ? new AnimationMixer(root) : null),
    [gltf, root],
  )

  useEffect(() => {
    if (!mixer) return
    const actions = gltf.animations.map((clip) => mixer.clipAction(clip))
    actions.forEach((action) => action.play())
    return () => {
      actions.forEach((action) => action.stop())
      mixer.stopAllAction()
    }
  }, [mixer, gltf])

  useFrame((_, delta) => {
    mixer?.update(delta)
  })

  return <primitive object={root} />
}

interface SceneRendererProps {
  experience: ExperienceDefinition
  bridge: SceneBridge
  quality?: 'high' | 'low'
}

export function SceneRenderer({ experience, bridge, quality }: SceneRendererProps) {
  const sceneModule = getSceneModule(experience.scene)

  if (experience.model.src) {
    return (
      <Suspense fallback={null}>
        <GltfModel src={experience.model.src} displaySpan={sceneModule.displaySpan} />
      </Suspense>
    )
  }

  const SceneComponent = sceneModule.Component

  return (
    <Suspense fallback={null}>
      <SceneComponent bridge={bridge} quality={quality} />
    </Suspense>
  )
}
