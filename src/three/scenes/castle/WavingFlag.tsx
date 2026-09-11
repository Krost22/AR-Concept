import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { DoubleSide, MeshStandardMaterial, PlaneGeometry } from 'three'

import { PALETTE } from '../../materials'

interface WavingFlagProps {
  width?: number
  height?: number
  color?: string
  phase?: number
  speed?: number
  segments?: number
}

export function WavingFlag({
  width = 0.9,
  height = 0.55,
  color = PALETTE.flagRed,
  phase = 0,
  speed = 1,
  segments = 10,
}: WavingFlagProps) {
  const geometry = useMemo(() => {
    const plane = new PlaneGeometry(width, height, segments, 4)
    plane.translate(width / 2, 0, 0)
    return plane
  }, [width, height, segments])

  const basePositions = useMemo(
    () => Float32Array.from(geometry.attributes.position.array),
    [geometry],
  )

  const material = useMemo(
    () => new MeshStandardMaterial({ color, side: DoubleSide, roughness: 0.85, flatShading: true }),
    [color],
  )

  useFrame(({ clock }) => {
    const positions = geometry.attributes.position
    const time = clock.elapsedTime * speed + phase

    for (let index = 0; index < positions.count; index += 1) {
      const offset = index * 3
      const x = basePositions[offset]
      const y = basePositions[offset + 1]
      const factor = x / width

      const ripple = Math.sin(x * 4.6 - time * 3.4) * 0.14 * factor
      const flutter = Math.sin(y * 3.2 + time * 2.2) * 0.03
      positions.setZ(index, ripple)
      positions.setY(index, y + flutter * factor)
    }

    positions.needsUpdate = true
    geometry.computeVertexNormals()
  })

  return <mesh geometry={geometry} material={material} />
}
