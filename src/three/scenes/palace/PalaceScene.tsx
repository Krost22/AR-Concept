import { useMemo, useState } from 'react'

import type { SceneStatus } from '@/domain/ar/types'
import { ModelAsset } from '../../assets/ModelAsset'
import type { SceneProps } from '../types'
import { useSceneCommands, useSceneStatus } from '../useSceneBridge'
import { Fountain } from './Fountain'
import type { InfoPointDefinition } from './InfoMarker'
import { InfoMarker } from './InfoMarker'
import { PalaceBuilding } from './PalaceBuilding'
import { PalmTree } from './PalmTree'
import { materials } from '../../materials'

const PALACE_MODEL_SIZE = 18

const MODEL_INFO_POINTS: InfoPointDefinition[] = [
  { id: 'portada', label: 'La portada', position: [0.5, 6.6, 5.7] },
  { id: 'balcones', label: 'Balcones de madera', position: [-4.5, 6.2, 5.7] },
  { id: 'claustro', label: 'Arcos del claustro', position: [3, 11, 0.5] },
  { id: 'tribunal', label: 'El Tribunal', position: [-3, 10.5, -0.5] },
  { id: 'museo', label: 'Museo Histórico', position: [-7, 4.4, 5.6] },
]

const PROCEDURAL_INFO_POINTS: InfoPointDefinition[] = [
  { id: 'portada', label: 'La portada', position: [0, 4.6, 4.9] },
  { id: 'balcones', label: 'Balcones de madera', position: [-5, 4.9, 4.7] },
  { id: 'claustro', label: 'Arcos del claustro', position: [5, 2.9, 1.2] },
  { id: 'tribunal', label: 'El Tribunal', position: [0, 2.5, -1.7] },
  { id: 'museo', label: 'Museo Histórico', position: [-7.6, 3.4, 4.8] },
]

const STATUS_LABELS = {
  exploring: 'Explora el palacio',
  pointsHidden: 'Puntos ocultos',
  pointFocused: 'Punto histórico seleccionado',
}

export function PalaceScene({ bridge, experience }: SceneProps) {
  const [pointsVisible, setPointsVisible] = useState(true)
  const [focusedInfoId, setFocusedInfoId] = useState<string | null>(null)

  useSceneCommands(bridge, (command) => {
    if (command.type === 'primary-toggle') {
      setPointsVisible((visible) => {
        const next = !visible
        if (!next) setFocusedInfoId(null)
        return next
      })
    } else if (command.type === 'focus-info') {
      if (command.payload) setFocusedInfoId(command.payload)
    } else if (command.type === 'clear-focus') {
      setFocusedInfoId(null)
    } else if (command.type === 'reset') {
      setPointsVisible(true)
      setFocusedInfoId(null)
    }
  })

  const status = useMemo<SceneStatus>(
    () => ({
      primaryActive: pointsVisible,
      label: focusedInfoId
        ? STATUS_LABELS.pointFocused
        : pointsVisible
          ? STATUS_LABELS.exploring
          : STATUS_LABELS.pointsHidden,
      focusedInfoId,
    }),
    [pointsVisible, focusedInfoId],
  )

  useSceneStatus(bridge, status)

  const modelSrc = experience.model.src
  const hasModel = Boolean(modelSrc)
  const infoPoints = hasModel ? MODEL_INFO_POINTS : PROCEDURAL_INFO_POINTS

  return (
    <group>
      {modelSrc ? (
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
          <circleGeometry args={[13, 40]} />
          <shadowMaterial transparent opacity={0.22} />
        </mesh>
      ) : (
        <mesh receiveShadow material={materials.sand} position={[0, -0.02, 0]}>
          <cylinderGeometry args={[11.5, 11.5, 0.06, 40]} />
        </mesh>
      )}

      {modelSrc ? (
        <ModelAsset src={modelSrc} size={PALACE_MODEL_SIZE} />
      ) : (
        <>
          <mesh
            receiveShadow
            material={materials.stoneLight}
            position={[0, 0.02, 5.6]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[18, 3]} />
          </mesh>
          <PalaceBuilding />
          <Fountain position={[0, 0.14, 0]} />
          <PalmTree position={[-4.6, 0.14, -1.6]} height={2.3} phase={0.6} lean={0.09} />
          <PalmTree position={[4.7, 0.14, 1.5]} height={2.1} phase={2.2} lean={-0.07} />
        </>
      )}

      {pointsVisible
        ? infoPoints.map((point) => (
            <InfoMarker
              key={point.id}
              point={point}
              active={focusedInfoId === point.id}
              onSelect={(id) => setFocusedInfoId(id)}
            />
          ))
        : null}
    </group>
  )
}
