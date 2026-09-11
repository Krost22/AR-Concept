import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'

import { materials } from '../../materials'
import type { CastlePhase, CastleTimelineRef, ShipRoute } from './timeline'
import { resolveShipPose } from './timeline'
import { WavingFlag } from './WavingFlag'

interface PirateShipProps {
  route: ShipRoute
  phase: CastlePhase
  timeline: CastleTimelineRef
}

const SAIL_MASTS = [
  { z: 0.9, height: 2.35, yard: 1.5, sailHeight: 1.0 },
  { z: -0.05, height: 2.85, yard: 1.85, sailHeight: 1.25 },
  { z: -1.0, height: 1.95, yard: 1.25, sailHeight: 0.85 },
]

export function PirateShip({ route, phase, timeline }: PirateShipProps) {
  const outerRef = useRef<Group>(null)
  const innerRef = useRef<Group>(null)
  const wakeRef = useRef<Group>(null)

  const sideCannons = useMemo(
    () => [
      { x: 0.56, z: 0.7 },
      { x: 0.56, z: -0.3 },
      { x: -0.56, z: 0.7 },
      { x: -0.56, z: -0.3 },
    ],
    [],
  )

  useFrame(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return

    const state = timeline.current
    const pose = resolveShipPose(route, phase, state.elapsed, state.worldTime)

    outer.position.set(pose.position[0], pose.position[1], pose.position[2])
    outer.rotation.y = pose.yaw
    inner.rotation.x = pose.pitch
    inner.rotation.z = pose.roll

    if (wakeRef.current) {
      const stretch = 1 + pose.underway * 1.6
      wakeRef.current.scale.set(1, 1, stretch)
      wakeRef.current.visible = pose.underway > 0.05
    }
  })

  return (
    <group ref={outerRef}>
      <group ref={innerRef} scale={route.size}>
        <mesh castShadow receiveShadow material={materials.hull} position={[0, 0.3, 0]}>
          <boxGeometry args={[1.05, 0.62, 3.2]} />
        </mesh>
        <mesh castShadow material={materials.hull} position={[0, 0.3, 1.9]} rotation={[Math.PI / 2, Math.PI / 4, 0]}>
          <coneGeometry args={[0.5, 0.8, 4]} />
        </mesh>
        <mesh castShadow material={materials.woodDark} position={[0, 0.64, -1.2]}>
          <boxGeometry args={[0.9, 0.48, 0.95]} />
        </mesh>
        <mesh receiveShadow material={materials.wood} position={[0, 0.63, 0.1]}>
          <boxGeometry args={[0.95, 0.08, 3.1]} />
        </mesh>

        {SAIL_MASTS.map((mast) => (
          <group key={mast.z} position={[0, 0.64, mast.z]}>
            <mesh castShadow material={materials.woodDark} position={[0, mast.height / 2, 0]}>
              <cylinderGeometry args={[0.035, 0.05, mast.height, 6]} />
            </mesh>
            <mesh castShadow material={materials.woodDark} position={[0, mast.height * 0.72, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.028, 0.028, mast.yard, 5]} />
            </mesh>
            <mesh material={materials.sail} position={[0, mast.height * 0.72 - mast.sailHeight * 0.52, 0.01]}>
              <planeGeometry args={[mast.yard * 0.82, mast.sailHeight, 6, 4]} />
            </mesh>
          </group>
        ))}

        {sideCannons.map((cannon) => (
          <mesh
            key={`${cannon.x}-${cannon.z}`}
            castShadow
            material={materials.stoneDark}
            position={[cannon.x, 0.42, cannon.z]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.04, 0.05, 0.42, 6]} />
          </mesh>
        ))}

        <group position={[0, SAIL_MASTS[1].height + 0.72, -0.05]}>
          <WavingFlag
            width={0.6}
            height={0.38}
            color={route.flagColor === 'red' ? '#a83a2c' : '#242730'}
            phase={route.delay * 2}
            speed={1.15}
            segments={8}
          />
        </group>

        <group ref={wakeRef} position={[0, 0.03, -1.7]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.55, 1.6]} />
            <meshBasicMaterial color="#e8f4f6" transparent opacity={0.28} depthWrite={false} />
          </mesh>
        </group>
      </group>
    </group>
  )
}
