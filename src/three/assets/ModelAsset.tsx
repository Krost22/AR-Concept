import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { Box3, Mesh, MeshStandardMaterial, Vector3 } from 'three'
import type { Material } from 'three'

export interface MaterialOverride {
  color?: string
  roughness?: number
  metalness?: number
}

export interface ModelAssetProps {
  src: string
  size: number
  sizeAxis?: 'max' | 'x' | 'y' | 'z'
  rotation?: [number, number, number]
  position?: [number, number, number]
  yaw?: number
  sink?: number
  shadows?: boolean
  materialOverrides?: Record<string, MaterialOverride>
}

function applyOverride(material: Material, overrides: Record<string, MaterialOverride>): Material {
  const override = overrides[material.name]
  if (!override) return material

  const cloned = material.clone() as MeshStandardMaterial
  if (override.color && cloned.color) cloned.color.set(override.color)
  if (override.roughness !== undefined) cloned.roughness = override.roughness
  if (override.metalness !== undefined) cloned.metalness = override.metalness
  return cloned
}

export function ModelAsset({
  src,
  size,
  sizeAxis = 'max',
  rotation = [0, 0, 0],
  position = [0, 0, 0],
  yaw = 0,
  sink = 0,
  shadows = true,
  materialOverrides,
}: ModelAssetProps) {
  const gltf = useGLTF(src)

  const root = useMemo(() => {
    const cloned = gltf.scene.clone(true)
    cloned.rotation.set(rotation[0], rotation[1], rotation[2])

    cloned.traverse((child) => {
      const mesh = child as Mesh
      if (!mesh.isMesh) return
      mesh.castShadow = shadows
      mesh.receiveShadow = shadows
      if (materialOverrides) {
        mesh.material = Array.isArray(mesh.material)
          ? mesh.material.map((material) => applyOverride(material, materialOverrides))
          : applyOverride(mesh.material, materialOverrides)
      }
    })

    const bounds = new Box3().setFromObject(cloned)
    const dimensions = bounds.getSize(new Vector3())
    const dimension =
      sizeAxis === 'max' ? Math.max(dimensions.x, dimensions.y, dimensions.z) : dimensions[sizeAxis]
    const factor = dimension > 0 ? size / dimension : 1
    cloned.scale.multiplyScalar(factor)

    bounds.setFromObject(cloned)
    const center = bounds.getCenter(new Vector3())
    cloned.position.set(-center.x, -bounds.min.y + sink, -center.z)

    return cloned
  }, [gltf, size, sizeAxis, rotation[0], rotation[1], rotation[2], sink, shadows, materialOverrides])

  return (
    <group position={position} rotation={[0, yaw, 0]}>
      <primitive object={root} />
    </group>
  )
}
