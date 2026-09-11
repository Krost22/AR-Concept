import { useMemo } from 'react'

import { materials } from '../../materials'

const PILLAR_SPACING = 2.4
const PILLAR_SIZE = 0.34
const ARCADE_HEIGHT = 2.5

interface ArcadeProps {
  length: number
  height?: number
  rotation?: [number, number, number]
  position?: [number, number, number]
  pillars?: number
}

function Arcade({
  length,
  height = ARCADE_HEIGHT,
  rotation = [0, 0, 0],
  position = [0, 0, 0],
  pillars,
}: ArcadeProps) {
  const count = pillars ?? Math.max(2, Math.round(length / PILLAR_SPACING) + 1)
  const spacing = length / (count - 1)
  const positions = useMemo(
    () => Array.from({ length: count }, (_, index) => -length / 2 + index * spacing),
    [count, length, spacing],
  )
  const archCount = count - 1
  const archRadius = spacing / 2 - PILLAR_SIZE / 2
  const arches = useMemo(
    () => Array.from({ length: archCount }, (_, index) => positions[index] + spacing / 2),
    [archCount, positions, spacing],
  )

  return (
    <group position={position} rotation={rotation}>
      {positions.map((x) => (
        <group key={`pillar-${x.toFixed(2)}`} position={[x, 0, 0]}>
          <mesh castShadow receiveShadow material={materials.stoneLight} position={[0, height / 2, 0]}>
            <boxGeometry args={[PILLAR_SIZE, height, PILLAR_SIZE]} />
          </mesh>
          <mesh castShadow material={materials.stoneDark} position={[0, height - 0.12, 0]}>
            <boxGeometry args={[PILLAR_SIZE + 0.14, 0.14, PILLAR_SIZE + 0.14]} />
          </mesh>
          <mesh castShadow material={materials.stoneDark} position={[0, 0.09, 0]}>
            <boxGeometry args={[PILLAR_SIZE + 0.16, 0.18, PILLAR_SIZE + 0.16]} />
          </mesh>
        </group>
      ))}

      {arches.map((x) => (
        <mesh
          key={`arch-${x.toFixed(2)}`}
          castShadow
          material={materials.stoneLight}
          position={[x, height - 0.05, 0]}
        >
          <torusGeometry args={[archRadius, 0.11, 7, 18, Math.PI]} />
        </mesh>
      ))}

      <mesh castShadow receiveShadow material={materials.whitewash} position={[0, height + archRadius + 0.02, 0]}>
        <boxGeometry args={[length + PILLAR_SIZE, 0.34, PILLAR_SIZE + 0.06]} />
      </mesh>
    </group>
  )
}

interface BalconyProps {
  width?: number
  position?: [number, number, number]
}

function Balcony({ width = 2.6, position = [0, 0, 0] }: BalconyProps) {
  const posts = useMemo(
    () => Array.from({ length: 6 }, (_, index) => -width / 2 + 0.12 + (index * (width - 0.24)) / 5),
    [width],
  )

  return (
    <group position={position}>
      <mesh castShadow receiveShadow material={materials.wood} position={[0, 0, 0.22]}>
        <boxGeometry args={[width, 0.14, 0.62]} />
      </mesh>
      {posts.map((x) => (
        <mesh key={`post-${x.toFixed(2)}`} castShadow material={materials.woodLight} position={[x, 0.48, 0.5]}>
          <boxGeometry args={[0.06, 0.84, 0.06]} />
        </mesh>
      ))}
      <mesh castShadow material={materials.woodLight} position={[0, 0.9, 0.5]}>
        <boxGeometry args={[width, 0.08, 0.09]} />
      </mesh>
      <mesh castShadow material={materials.woodLight} position={[0, 0.12, 0.5]}>
        <boxGeometry args={[width, 0.07, 0.09]} />
      </mesh>
      <mesh castShadow material={materials.woodDark} position={[0, 0.02, -0.05]}>
        <boxGeometry args={[width - 0.4, 0.16, 0.12]} />
      </mesh>
    </group>
  )
}

export function PalaceBuilding() {
  const upperWindows = useMemo(() => [-7.2, -2.5, 2.5, 7.2], [])
  const frontPillars = 6

  return (
    <group>
      <mesh castShadow receiveShadow material={materials.whitewash} position={[0, 2.7, 3.2]}>
        <boxGeometry args={[16, 5.4, 1.6]} />
      </mesh>
      <mesh castShadow receiveShadow material={materials.whitewash} position={[0, 2.7, -3.2]}>
        <boxGeometry args={[16, 5.4, 1.6]} />
      </mesh>
      <mesh castShadow receiveShadow material={materials.whitewash} position={[-7, 2.7, 0]}>
        <boxGeometry args={[2, 5.4, 4.8]} />
      </mesh>
      <mesh castShadow receiveShadow material={materials.whitewash} position={[7, 2.7, 0]}>
        <boxGeometry args={[2, 5.4, 4.8]} />
      </mesh>

      <mesh receiveShadow material={materials.sand} position={[0, 0.07, 0]}>
        <boxGeometry args={[12, 0.14, 4.8]} />
      </mesh>

      <Arcade length={14.4} pillars={frontPillars} position={[0, 0, 4.25]} />
      <Arcade length={4.4} rotation={[0, Math.PI / 2, 0]} position={[-5.65, 0, 0]} pillars={3} />
      <Arcade length={4.4} rotation={[0, Math.PI / 2, 0]} position={[5.65, 0, 0]} pillars={3} />
      <Arcade length={11.6} rotation={[0, Math.PI, 0]} position={[0, 0, -2.15]} pillars={6} />

      <mesh castShadow material={materials.stoneLight} position={[0, 2.9, 4.03]}>
        <boxGeometry args={[16.4, 0.18, 0.22]} />
      </mesh>

      <mesh material={materials.shadow} position={[0, 1.2, 4.02]}>
        <boxGeometry args={[14.8, 2.34, 0.1]} />
      </mesh>

      <group position={[0, 0, 4.05]}>
        <mesh castShadow material={materials.stoneLight} position={[-1.5, 1.8, 0.1]}>
          <boxGeometry args={[0.42, 3.6, 0.55]} />
        </mesh>
        <mesh castShadow material={materials.stoneLight} position={[1.5, 1.8, 0.1]}>
          <boxGeometry args={[0.42, 3.6, 0.55]} />
        </mesh>
        <mesh castShadow material={materials.stoneDark} position={[0, 3.55, 0.1]}>
          <boxGeometry args={[3.4, 0.34, 0.6]} />
        </mesh>
        <mesh material={materials.glass} position={[0, 1.45, 0.02]}>
          <boxGeometry args={[2.1, 2.9, 0.1]} />
        </mesh>
      </group>

      <group position={[0, 5.05, 4.07]}>
        <mesh castShadow material={materials.stoneLight}>
          <boxGeometry args={[3.0, 0.95, 0.4]} />
        </mesh>
        <mesh material={materials.gold} position={[0, 0.02, 0.24]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.26, 0.055, 8, 20]} />
        </mesh>
        <mesh material={materials.gold} position={[0, 0.02, 0.26]}>
          <sphereGeometry args={[0.11, 12, 10]} />
        </mesh>
      </group>

      {upperWindows.map((x) => (
        <group key={`window-${x}`}>
          <mesh material={materials.glass} position={[x, 4.0, 4.03]}>
            <boxGeometry args={[1.05, 1.7, 0.1]} />
          </mesh>
          <mesh castShadow material={materials.stoneDark} position={[x, 4.92, 4.06]}>
            <boxGeometry args={[1.25, 0.14, 0.18]} />
          </mesh>
          <mesh castShadow material={materials.stoneDark} position={[x, 3.08, 4.06]}>
            <boxGeometry args={[1.25, 0.14, 0.18]} />
          </mesh>
        </group>
      ))}

      <Balcony width={2.4} position={[-5, 3.35, 4.05]} />
      <Balcony width={2.8} position={[0, 3.65, 4.05]} />
      <Balcony width={2.4} position={[5, 3.35, 4.05]} />

      <mesh material={materials.glass} position={[-5, 4.1, 4.03]}>
        <boxGeometry args={[1.5, 2.2, 0.1]} />
      </mesh>
      <mesh material={materials.glass} position={[5, 4.1, 4.03]}>
        <boxGeometry args={[1.5, 2.2, 0.1]} />
      </mesh>

      <mesh castShadow material={materials.stoneDark} position={[0, 5.5, 3.2]}>
        <boxGeometry args={[16.3, 0.28, 1.8]} />
      </mesh>
      <mesh castShadow material={materials.stoneDark} position={[0, 5.5, -3.2]}>
        <boxGeometry args={[16.3, 0.28, 1.8]} />
      </mesh>

      <mesh castShadow material={materials.roofTile} position={[0, 5.62, -3.2]}>
        <boxGeometry args={[16.1, 0.24, 1.5]} />
      </mesh>
      <mesh castShadow material={materials.roofTile} position={[0, 5.62, 3.2]}>
        <boxGeometry args={[16.1, 0.24, 1.5]} />
      </mesh>
    </group>
  )
}
