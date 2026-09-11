import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, Group, Mesh, MeshBasicMaterial, Sprite, SpriteMaterial } from 'three'

import { getSoftParticleTexture } from '../../effects/softParticle'
import type { CastleTimelineRef } from './timeline'

interface CannonVolleyProps {
  origin: [number, number, number]
  target: [number, number, number]
  timeline: CastleTimelineRef
  fireOffset?: number
  interval?: number
  shots?: number
  arcHeight?: number
  travelTime?: number
  scale?: number
}

const FLASH_DURATION = 0.26
const EFFECT_DURATION = 1.7
const SMOKE_PUFFS = 3

export function CannonVolley({
  origin,
  target,
  timeline,
  fireOffset = 0,
  interval = 3.6,
  shots = 4,
  arcHeight = 1.6,
  travelTime = 0.95,
  scale = 1,
}: CannonVolleyProps) {
  const groupRef = useRef<Group>(null)
  const flashRef = useRef<Sprite>(null)
  const ballRef = useRef<Mesh>(null)
  const smokeRefs = useRef<Array<Sprite | null>>([])
  const splashes = useRef<Array<Sprite | null>>([])

  const softTexture = useMemo(() => getSoftParticleTexture(), [])

  const distance = useMemo(() => {
    const dx = target[0] - origin[0]
    const dz = target[2] - origin[2]
    return Math.sqrt(dx * dx + dz * dz)
  }, [origin, target])

  const flashMaterial = useMemo(
    () =>
      new SpriteMaterial({
        map: softTexture,
        color: '#ffd27a',
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    [softTexture],
  )

  const smokeMaterials = useMemo(
    () =>
      Array.from(
        { length: SMOKE_PUFFS },
        () =>
          new SpriteMaterial({
            map: softTexture,
            color: '#d8d4ca',
            transparent: true,
            depthWrite: false,
            opacity: 0,
          }),
      ),
    [softTexture],
  )

  const ballMaterial = useMemo(() => new MeshBasicMaterial({ color: '#3a3630' }), [])
  const splashMaterial = useMemo(
    () =>
      new SpriteMaterial({
        map: softTexture,
        color: '#dff0f4',
        transparent: true,
        depthWrite: false,
        opacity: 0,
      }),
    [softTexture],
  )

  useFrame(() => {
    const state = timeline.current
    const group = groupRef.current
    if (!group) return

    if (flashRef.current) flashRef.current.visible = false
    if (ballRef.current) ballRef.current.visible = false
    for (const smoke of smokeRefs.current) {
      if (smoke) smoke.visible = false
    }
    for (const splash of splashes.current) {
      if (splash) splash.visible = false
    }

    if (state.phase !== 'bombardment') return

    for (let index = 0; index < shots; index += 1) {
      const effectTime = state.elapsed - (fireOffset + index * interval)
      if (effectTime < 0) continue

      const flash = flashRef.current
      if (flash && effectTime < FLASH_DURATION) {
        flash.visible = true
        const progress = effectTime / FLASH_DURATION
        flash.scale.setScalar((1.1 + progress * 2.6) * scale)
        flashMaterial.opacity = 1 - progress
      }

      const ball = ballRef.current
      if (ball && effectTime <= travelTime) {
        ball.visible = true
        const t = effectTime / travelTime
        ball.position.set(
          0,
          Math.sin(Math.PI * t) * arcHeight + (target[1] - origin[1]) * t,
          t * distance,
        )
      }

      for (let puff = 0; puff < SMOKE_PUFFS; puff += 1) {
        const smoke = smokeRefs.current[puff]
        if (!smoke) continue
        const age = effectTime - puff * 0.26
        if (age <= 0 || age >= EFFECT_DURATION * 0.8) continue
        const smokeProgress = age / (EFFECT_DURATION * 0.8)
        smoke.visible = true
        smoke.scale.setScalar((0.5 + smokeProgress * 2.4) * scale)
        smoke.position.set(0, age * 0.6, age * 1.7)
        smokeMaterials[puff].opacity = 0.5 * (1 - smokeProgress)
      }

      const splash = splashes.current[index]
      if (splash) {
        const splashAge = effectTime - travelTime
        if (splashAge > 0 && splashAge < 0.5) {
          const splashProgress = splashAge / 0.5
          const material = splash.material as SpriteMaterial
          splash.visible = true
          splash.scale.setScalar((0.5 + splashProgress * 1.8) * scale)
          material.opacity = 0.55 * (1 - splashProgress)
        }
      }
    }
  })

  const direction = useMemo(
    () => Math.atan2(target[0] - origin[0], target[2] - origin[2]),
    [origin, target],
  )

  return (
    <group ref={groupRef} position={origin} rotation={[0, direction, 0]}>
      <sprite ref={flashRef} material={flashMaterial} visible={false} />

      {Array.from({ length: SMOKE_PUFFS }, (_, index) => (
        <sprite
          key={`smoke-${index}`}
          ref={(node) => {
            smokeRefs.current[index] = node
          }}
          material={smokeMaterials[index]}
          visible={false}
        />
      ))}

      <mesh ref={ballRef} material={ballMaterial} visible={false}>
        <sphereGeometry args={[0.16 * scale, 8, 8]} />
      </mesh>

      {Array.from({ length: shots }, (_, index) => (
        <sprite
          key={`splash-${index}`}
          ref={(node) => {
            splashes.current[index] = node
          }}
          material={splashMaterial}
          position={[0, target[1] - origin[1], distance]}
          scale={0.5}
          visible={false}
        />
      ))}
    </group>
  )
}
