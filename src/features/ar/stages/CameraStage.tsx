import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { ComponentRef, RefObject } from 'react'
import { DoubleSide, Group, Mesh, Plane, Ray, Vector3 } from 'three'

import { clamp } from '@/lib/math'
import { ExperienceCanvas, SceneLighting } from '@/three/ExperienceCanvas'
import { SceneRenderer } from '@/three/SceneRenderer'
import { getSceneModule } from '@/three/scenes/registry'
import type { CameraStageProps } from './types'

interface CameraPlacementReticleProps {
  active: boolean
  positionRef: RefObject<Vector3>
  resetNonce: number
}

function CameraPlacementReticle({ active, positionRef, resetNonce }: CameraPlacementReticleProps) {
  const groupRef = useRef<Group>(null)
  const ringRef = useRef<Mesh>(null)
  const ray = useMemo(() => new Ray(), [])
  const plane = useMemo(() => new Plane(new Vector3(0, 1, 0), 0), [])
  const origin = useMemo(() => new Vector3(), [])
  const direction = useMemo(() => new Vector3(), [])
  const hit = useMemo(() => new Vector3(), [])

  useEffect(() => {
    positionRef.current?.set(0, 0, 1.7)
  }, [resetNonce, positionRef])

  useFrame(({ camera, clock }) => {
    const group = groupRef.current
    const target = positionRef.current
    if (!group || !target || !active) {
      if (group) group.visible = false
      return
    }

    camera.getWorldPosition(origin)
    camera.getWorldDirection(direction)
    ray.set(origin, direction)

    if (ray.intersectPlane(plane, hit)) {
      const distance = origin.distanceTo(hit)
      if (distance < 0.9 || distance > 4.5) {
        const clampedDistance = clamp(distance, 1.1, 3.4)
        hit.copy(origin).addScaledVector(direction, clampedDistance)
        hit.y = 0
      }
      target.copy(hit)
    } else {
      target.copy(origin).addScaledVector(direction, 1.9)
      target.y = 0
    }

    group.position.copy(target)
    group.visible = true

    if (ringRef.current) {
      ringRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 3.2) * 0.09)
    }
  })

  return (
    <group ref={groupRef} visible={false}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.014, 0]} ref={ringRef}>
        <ringGeometry args={[0.26, 0.34, 36]} />
        <meshBasicMaterial color="#f2d492" transparent opacity={0.92} depthWrite={false} side={DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.014, 0]}>
        <circleGeometry args={[0.05, 18]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.95} depthWrite={false} side={DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]}>
        <circleGeometry args={[0.52, 36]} />
        <meshBasicMaterial color="#0b0f12" transparent opacity={0.18} depthWrite={false} side={DoubleSide} />
      </mesh>
    </group>
  )
}

interface CameraOrbitRigProps {
  enabled: boolean
  target: [number, number, number]
  resetNonce: number
}

function CameraOrbitRig({ enabled, target, resetNonce }: CameraOrbitRigProps) {
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null)
  const { camera } = useThree()

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return
    if (resetNonce > 0) {
      camera.position.set(0, 1.35, 2.15)
    }
    controls.target.set(target[0], target[1], target[2])
    controls.update()
  }, [resetNonce, target, camera])

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enabled={enabled}
      enableDamping
      dampingFactor={0.08}
      enablePan
      screenSpacePanning={false}
      minDistance={0.7}
      maxDistance={5.5}
      minPolarAngle={0.12}
      maxPolarAngle={Math.PI / 2.08}
      target={target}
    />
  )
}

export function CameraStage({
  experience,
  bridge,
  chrome,
  userScale,
  resetNonce,
  placement,
  onPlacementChange,
  onReady,
  stream,
}: CameraStageProps) {
  const sceneModule = getSceneModule(experience.scene)
  const scale = (experience.ar.targetSizeMeters / sceneModule.displaySpan) * userScale
  const videoRef = useRef<HTMLVideoElement>(null)
  const placementRef = useRef<Group>(null)
  const reticlePosition = useRef(new Vector3(0, 0, 1.7))
  const [focusTarget, setFocusTarget] = useState<[number, number, number]>([
    0,
    sceneModule.cameraTarget[1],
    0,
  ])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !stream) return
    video.srcObject = stream
    void video.play().catch(() => undefined)
    return () => {
      video.srcObject = null
    }
  }, [stream])

  useEffect(() => {
    placementRef.current?.position.set(0, 0, 0)
    setFocusTarget([0, sceneModule.cameraTarget[1], 0])
  }, [resetNonce, sceneModule.cameraTarget])

  const handlePlace = useCallback(() => {
    if (placement !== 'placing') return
    const target = reticlePosition.current
    placementRef.current?.position.set(target.x, 0, target.z)
    setFocusTarget([target.x, sceneModule.cameraTarget[1], target.z])
    onPlacementChange('placed')
  }, [placement, onPlacementChange, sceneModule.cameraTarget])

  return (
    <div className="ar-stage ar-stage--camera">
      <video
        ref={videoRef}
        className="ar-stage__video"
        playsInline
        muted
        autoPlay
        aria-hidden="true"
      />
      <ExperienceCanvas
        camera={{ position: [0, 1.35, 2.15], fov: 55 }}
        onReady={onReady}
        onPointerMissed={handlePlace}
        className="ar-stage__canvas"
      >
        <SceneLighting warm={experience.scene === 'palace-exploration'} />
        <group ref={placementRef} visible={placement === 'placed'}>
          <group scale={scale}>
            <SceneRenderer experience={experience} bridge={bridge} />
          </group>
        </group>
        <CameraPlacementReticle
          active={placement === 'placing'}
          positionRef={reticlePosition}
          resetNonce={resetNonce}
        />
        <CameraOrbitRig enabled={placement === 'placed'} target={focusTarget} resetNonce={resetNonce} />
      </ExperienceCanvas>
      {chrome}
    </div>
  )
}
