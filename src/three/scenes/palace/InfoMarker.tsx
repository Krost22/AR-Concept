import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard } from '@react-three/drei'
import { Group } from 'three'

import { materials, PALETTE } from '../../materials'

export interface InfoPointDefinition {
  id: string
  label: string
  position: [number, number, number]
}

interface InfoMarkerProps {
  point: InfoPointDefinition
  active: boolean
  onSelect: (id: string) => void
}

export function InfoMarker({ point, active, onSelect }: InfoMarkerProps) {
  const groupRef = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const time = clock.elapsedTime * 2 + point.position[0]
    const pulse = active || hovered ? 1.18 + Math.sin(time) * 0.08 : 1 + Math.sin(time) * 0.04
    groupRef.current.scale.setScalar(pulse)
  })

  return (
    <Billboard position={point.position}>
      <group ref={groupRef}>
        <mesh
          position={[0, 0.62, 0]}
          material={materials.gold}
          onPointerOver={(event) => {
            event.stopPropagation()
            setHovered(true)
          }}
          onPointerOut={() => setHovered(false)}
          onClick={(event) => {
            event.stopPropagation()
            onSelect(point.id)
          }}
        >
          <sphereGeometry args={[0.38, 14, 12]} />
        </mesh>
        <mesh position={[0, 0.12, 0]} rotation={[Math.PI, 0, 0]} material={materials.gold}>
          <coneGeometry args={[0.28, 0.7, 4]} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.22, 0]}>
          <torusGeometry args={[0.62, 0.05, 8, 26]} />
          <meshBasicMaterial
            color={active ? '#ffffff' : PALETTE.gold}
            transparent
            opacity={active ? 0.95 : 0.6}
            depthWrite={false}
          />
        </mesh>
        <mesh
          onClick={(event) => {
            event.stopPropagation()
            onSelect(point.id)
          }}
        >
          <sphereGeometry args={[1.05, 8, 8]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
    </Billboard>
  )
}
