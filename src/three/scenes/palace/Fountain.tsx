import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

import { materials } from '../../materials'

interface FountainProps {
  position?: [number, number, number]
}

export function Fountain({ position = [0, 0, 0] }: FountainProps) {
  const ringRef = useRef<Mesh>(null)
  const ring2Ref = useRef<Mesh>(null)
  const jetRef = useRef<Mesh>(null)

  useFrame(({ clock }) => {
    const time = clock.elapsedTime

    const animateRing = (mesh: Mesh | null, offset: number) => {
      if (!mesh) return
      const cycle = ((time * 0.55 + offset) % 1 + 1) % 1
      const scale = 0.4 + cycle * 1.5
      mesh.scale.setScalar(scale)
      const material = mesh.material as { opacity: number }
      material.opacity = 0.4 * (1 - cycle)
    }

    animateRing(ringRef.current, 0)
    animateRing(ring2Ref.current, 0.5)

    if (jetRef.current) {
      jetRef.current.scale.y = 0.9 + Math.sin(time * 3.1) * 0.08
      jetRef.current.position.y = 0.62 + Math.sin(time * 3.1) * 0.04
    }
  })

  return (
    <group position={position}>
      <mesh castShadow receiveShadow material={materials.stoneLight} position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.95, 1.05, 0.32, 8]} />
      </mesh>
      <mesh material={materials.stoneDark} position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.86, 0.86, 0.08, 8]} />
      </mesh>
      <mesh material={materials.glass} position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.78, 0.78, 0.04, 16]} />
      </mesh>
      <mesh castShadow material={materials.stoneLight} position={[0, 0.52, 0]}>
        <cylinderGeometry args={[0.2, 0.34, 0.32, 8]} />
      </mesh>

      <mesh ref={jetRef} position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.045, 0.09, 0.4, 6]} />
        <meshStandardMaterial color="#eaf6fa" transparent opacity={0.75} roughness={0.2} />
      </mesh>

      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.41, 0]}>
        <torusGeometry args={[0.5, 0.02, 6, 24]} />
        <meshBasicMaterial color="#eaf6fa" transparent opacity={0.4} depthWrite={false} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.41, 0]}>
        <torusGeometry args={[0.5, 0.02, 6, 24]} />
        <meshBasicMaterial color="#eaf6fa" transparent opacity={0.4} depthWrite={false} />
      </mesh>
    </group>
  )
}
