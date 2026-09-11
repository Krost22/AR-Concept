import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'

import { materials } from '../../materials'

interface PalmTreeProps {
  position?: [number, number, number]
  height?: number
  phase?: number
  lean?: number
}

export function PalmTree({ position = [0, 0, 0], height = 2.6, phase = 0, lean = 0.08 }: PalmTreeProps) {
  const crownRef = useRef<Group>(null)
  const trunkRef = useRef<Group>(null)

  const fronds = Array.from({ length: 8 }, (_, index) => (index / 8) * Math.PI * 2)

  useFrame(({ clock }) => {
    const time = clock.elapsedTime + phase
    if (crownRef.current) {
      crownRef.current.rotation.z = Math.sin(time * 0.8) * 0.06
      crownRef.current.rotation.x = Math.cos(time * 0.65) * 0.05
    }
    if (trunkRef.current) {
      trunkRef.current.rotation.z = lean + Math.sin(time * 0.8) * 0.015
    }
  })

  return (
    <group position={position}>
      <group ref={trunkRef}>
        <mesh castShadow material={materials.woodLight} position={[0, height / 2, 0]}>
          <cylinderGeometry args={[0.07, 0.11, height, 7]} />
        </mesh>
        <mesh castShadow material={materials.woodLight} position={[0, height * 0.5, 0]} scale={[1, 1, 0.86]}>
          <cylinderGeometry args={[0.06, 0.09, height * 0.55, 7]} />
        </mesh>
        <group ref={crownRef} position={[0, height, 0]}>
          {fronds.map((angle, index) => (
            <group key={angle} rotation={[0, angle, 0]}>
              <mesh
                castShadow
                material={index % 2 === 0 ? materials.foliage : materials.foliageLight}
                rotation={[-0.42 - (index % 3) * 0.14, 0, 0]}
                position={[0, 0.06, 0.62]}
              >
                <coneGeometry args={[0.16, 1.35, 4]} />
              </mesh>
            </group>
          ))}
          <mesh castShadow material={materials.foliage} position={[0, 0.1, 0]}>
            <sphereGeometry args={[0.14, 8, 6]} />
          </mesh>
        </group>
      </group>
    </group>
  )
}
