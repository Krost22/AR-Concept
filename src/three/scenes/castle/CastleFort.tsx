import { useMemo } from 'react'

import { materials } from '../../materials'
import { WavingFlag } from './WavingFlag'

const CANNON_ANGLES = [18, 78, 138, 198, 258, 318]

function Bastion({ angle, radius }: { angle: number; radius: number }) {
  const radians = (angle * Math.PI) / 180
  const x = Math.sin(radians) * radius
  const z = Math.cos(radians) * radius

  return (
    <group position={[x, 2.45, z]} rotation={[0, radians, 0]}>
      <mesh castShadow receiveShadow material={materials.stone} position={[0, 0, 0.2]}>
        <cylinderGeometry args={[1.05, 1.45, 1.6, 3]} />
      </mesh>
      <mesh castShadow material={materials.stoneDark} position={[0, 0.86, 0.2]}>
        <cylinderGeometry args={[1.1, 1.1, 0.12, 3]} />
      </mesh>
    </group>
  )
}

function Cannon({ angle, radius }: { angle: number; radius: number }) {
  const radians = (angle * Math.PI) / 180
  const x = Math.sin(radians) * radius
  const z = Math.cos(radians) * radius

  return (
    <group position={[x, 3.35, z]} rotation={[0, radians, 0]}>
      <mesh castShadow material={materials.woodDark} position={[0, -0.06, 0.05]}>
        <boxGeometry args={[0.26, 0.14, 0.42]} />
      </mesh>
      <mesh castShadow material={materials.stoneDark} rotation={[Math.PI / 2 - 0.12, 0, 0]} position={[0, 0.06, 0.24]}>
        <cylinderGeometry args={[0.055, 0.075, 0.72, 8]} />
      </mesh>
    </group>
  )
}

function Ramp() {
  return (
    <group position={[-4.2, 2.1, -2.6]} rotation={[0, -0.7, 0.34]}>
      <mesh castShadow receiveShadow material={materials.stoneLight}>
        <boxGeometry args={[1.1, 0.16, 4.6]} />
      </mesh>
      <mesh castShadow material={materials.stoneDark} position={[0.6, 0, 0]}>
        <boxGeometry args={[0.08, 0.32, 4.6]} />
      </mesh>
      <mesh castShadow material={materials.stoneDark} position={[-0.6, 0, 0]}>
        <boxGeometry args={[0.08, 0.32, 4.6]} />
      </mesh>
    </group>
  )
}

export function CastleFort() {
  const bastions = useMemo(() => [45, 135, 225, 315], [])

  return (
    <group>
      <mesh receiveShadow castShadow material={materials.rock} position={[0, -0.6, 0]}>
        <cylinderGeometry args={[7.9, 9.9, 1.9, 12]} />
      </mesh>
      <mesh receiveShadow castShadow material={[materials.rock, materials.grass, materials.rock]} position={[0, 1.05, 0]}>
        <cylinderGeometry args={[6.4, 8.6, 1.4, 12]} />
      </mesh>

      <mesh receiveShadow castShadow material={[materials.stone, materials.sand, materials.stoneDark]} position={[0, 2.45, 0]}>
        <cylinderGeometry args={[4.35, 4.55, 1.5, 8]} />
      </mesh>

      <mesh receiveShadow material={materials.stoneDark} position={[0, 3.22, 0]}>
        <cylinderGeometry args={[4.5, 4.5, 0.16, 8]} />
      </mesh>

      {bastions.map((angle) => (
        <Bastion key={angle} angle={angle} radius={4.75} />
      ))}

      {CANNON_ANGLES.map((angle) => (
        <Cannon key={angle} angle={angle} radius={3.75} />
      ))}

      <Ramp />

      <mesh castShadow receiveShadow material={materials.stone} position={[0, 4.0, 0]}>
        <cylinderGeometry args={[1.7, 1.95, 1.6, 6]} />
      </mesh>
      <mesh castShadow material={materials.stoneDark} position={[0, 4.86, 0]}>
        <cylinderGeometry args={[1.85, 1.85, 0.14, 6]} />
      </mesh>

      <group position={[-1.6, 3.3, -1.2]} rotation={[0, 0.5, 0]}>
        <mesh castShadow receiveShadow material={materials.whitewash}>
          <boxGeometry args={[1.5, 0.85, 1.05]} />
        </mesh>
        <mesh castShadow material={materials.roofTile} position={[0, 0.62, 0]} rotation={[0, Math.PI / 4, 0]}>
          <cylinderGeometry args={[0.02, 1.05, 0.5, 4]} />
        </mesh>
      </group>

      <group position={[0, 5.35, 0]}>
        <mesh castShadow material={materials.woodDark}>
          <cylinderGeometry args={[0.035, 0.045, 1.1, 6]} />
        </mesh>
        <group position={[0, 0.52, 0]}>
          <WavingFlag width={0.95} height={0.58} color="#a83a2c" phase={1.4} speed={0.9} />
        </group>
      </group>
    </group>
  )
}
