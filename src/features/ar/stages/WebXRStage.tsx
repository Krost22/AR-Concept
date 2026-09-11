import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useXR, useXRHitTest, XR, XRDomOverlay } from '@react-three/xr'
import { DoubleSide, Group, Matrix4, Vector3 } from 'three'

import { ExperienceCanvas, SceneLighting } from '@/three/ExperienceCanvas'
import { SceneRenderer } from '@/three/SceneRenderer'
import { getSceneModule } from '@/three/scenes/registry'
import type { ExperienceDefinition } from '@/domain/experience/types'
import type { SceneBridge } from '@/domain/ar/types'
import { xrStore } from '../xr/xrStore'
import type { ARStageProps } from './types'

interface XRPlacedModelProps {
  experience: ExperienceDefinition
  bridge: SceneBridge
  scale: number
  resetNonce: number
  onPlacementChange: (state: 'placing' | 'placed') => void
}

function XRPlacedModel({
  experience,
  bridge,
  scale,
  resetNonce,
  onPlacementChange,
}: XRPlacedModelProps) {
  const placementRef = useRef<Group>(null)
  const reticleRef = useRef<Group>(null)
  const hitPoint = useMemo(() => new Vector3(), [])
  const matrix = useMemo(() => new Matrix4(), [])
  const hasHit = useRef(false)
  const placed = useRef(false)

  const handleHitResults = useCallback(
    (
      results: XRHitTestResult[],
      getWorldMatrix: (target: Matrix4, result: XRHitTestResult) => boolean,
    ) => {
      if (results.length === 0 || !getWorldMatrix(matrix, results[0])) {
        hasHit.current = false
        return
      }
      hitPoint.setFromMatrixPosition(matrix)
      hasHit.current = true
    },
    [hitPoint, matrix],
  )

  useXRHitTest(handleHitResults, 'viewer')

  useFrame(({ clock }) => {
    const reticle = reticleRef.current
    if (!reticle) return
    const active = hasHit.current && !placed.current
    reticle.visible = active
    if (active) {
      reticle.position.copy(hitPoint)
      reticle.scale.setScalar(1 + Math.sin(clock.elapsedTime * 3.4) * 0.12)
    }
  })

  const session = useXR((state) => state.session)

  useEffect(() => {
    if (!session) return
    const handleSelect = () => {
      const group = placementRef.current
      if (!group || !hasHit.current) return
      group.position.copy(hitPoint)
      group.visible = true
      if (!placed.current) {
        placed.current = true
        onPlacementChange('placed')
      }
    }
    session.addEventListener('select', handleSelect)
    return () => session.removeEventListener('select', handleSelect)
  }, [session, hitPoint, onPlacementChange])

  useEffect(() => {
    placed.current = false
    const group = placementRef.current
    if (group) {
      group.visible = false
      group.position.set(0, 0, 0)
    }
  }, [resetNonce])

  return (
    <>
      <group ref={placementRef} visible={false}>
        <group scale={scale}>
          <SceneRenderer experience={experience} bridge={bridge} />
        </group>
      </group>

      <group ref={reticleRef} visible={false}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.07, 0.095, 32]} />
          <meshBasicMaterial color="#f2d492" transparent opacity={0.92} depthWrite={false} side={DoubleSide} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.018, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.95} depthWrite={false} side={DoubleSide} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.004, 0]}>
          <circleGeometry args={[0.15, 32]} />
          <meshBasicMaterial color="#0b0f12" transparent opacity={0.16} depthWrite={false} side={DoubleSide} />
        </mesh>
      </group>
    </>
  )
}

export function WebXRStage({
  experience,
  bridge,
  chrome,
  userScale,
  resetNonce,
  onPlacementChange,
  onReady,
}: ARStageProps) {
  const sceneModule = getSceneModule(experience.scene)
  const scale = (experience.ar.targetSizeMeters / sceneModule.displaySpan) * userScale

  return (
    <div className="ar-stage ar-stage--xr">
      <ExperienceCanvas
        camera={{ position: [0, 1.4, 2], fov: 60 }}
        onReady={onReady}
        className="ar-stage__canvas"
      >
        <XR store={xrStore}>
          <SceneLighting warm={experience.scene === 'palace-exploration'} />
          <XRPlacedModel
            experience={experience}
            bridge={bridge}
            scale={scale}
            resetNonce={resetNonce}
            onPlacementChange={onPlacementChange}
          />
          <XRDomOverlay className="ar-overlay">{chrome}</XRDomOverlay>
        </XR>
      </ExperienceCanvas>
    </div>
  )
}
