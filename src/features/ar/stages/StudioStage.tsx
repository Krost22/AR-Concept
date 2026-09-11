import { useEffect, useRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import type { ComponentRef } from 'react'

import { ExperienceCanvas, SceneLighting } from '@/three/ExperienceCanvas'
import { SceneRenderer } from '@/three/SceneRenderer'
import { getSceneModule } from '@/three/scenes/registry'
import type { ARStageProps } from './types'

function StudioCameraRig({
  resetNonce,
  distance,
  target,
}: {
  resetNonce: number
  distance: number
  target: [number, number, number]
}) {
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null)
  const { camera } = useThree()

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return
    const angle = Math.PI / 4
    camera.position.set(
      Math.sin(angle) * distance,
      target[1] + distance * 0.42,
      Math.cos(angle) * distance,
    )
    controls.target.set(target[0], target[1], target[2])
    controls.update()
  }, [resetNonce, camera, distance, target])

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      enablePan={false}
      minDistance={distance * 0.35}
      maxDistance={distance * 2.4}
      minPolarAngle={0.15}
      maxPolarAngle={Math.PI / 2.05}
      target={target}
    />
  )
}

export function StudioStage({
  experience,
  bridge,
  chrome,
  userScale,
  resetNonce,
  onReady,
}: ARStageProps) {
  const sceneModule = getSceneModule(experience.scene)
  const scale = (experience.ar.targetSizeMeters / sceneModule.displaySpan) * userScale
  const theme = experience.scene === 'castle-siege' ? 'castle' : 'palace'

  return (
    <div className={`ar-stage ar-stage--studio ar-stage--${theme}`}>
      <ExperienceCanvas
        camera={{ position: [2.4, 1.7, 2.4], fov: 45 }}
        onReady={onReady}
        className="ar-stage__canvas"
      >
        <SceneLighting warm={experience.scene === 'palace-exploration'} />
        <group scale={scale}>
          <SceneRenderer experience={experience} bridge={bridge} />
        </group>
        <StudioCameraRig
          resetNonce={resetNonce}
          distance={sceneModule.cameraDistance}
          target={sceneModule.cameraTarget}
        />
      </ExperienceCanvas>
      {chrome}
    </div>
  )
}
