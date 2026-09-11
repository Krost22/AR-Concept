import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { ReactNode } from 'react'
import { ACESFilmicToneMapping } from 'three'

export interface CameraConfig {
  position: [number, number, number]
  fov?: number
  near?: number
  far?: number
}

interface SceneReadySignalProps {
  onReady?: () => void
}

function SceneReadySignal({ onReady }: SceneReadySignalProps) {
  const notified = useRef(false)
  useFrame(() => {
    if (notified.current) return
    notified.current = true
    onReady?.()
  })
  return null
}

export interface ExperienceCanvasProps {
  children: ReactNode
  camera: CameraConfig
  shadows?: boolean
  dpr?: [number, number]
  onReady?: () => void
  onPointerMissed?: () => void
  className?: string
}

export function ExperienceCanvas({
  children,
  camera,
  shadows = true,
  dpr = [1, 2],
  onReady,
  onPointerMissed,
  className,
}: ExperienceCanvasProps) {
  return (
    <Canvas
      className={['experience-canvas', className ?? ''].filter(Boolean).join(' ')}
      dpr={dpr}
      shadows={shadows}
      camera={{
        fov: camera.fov ?? 50,
        near: camera.near ?? 0.02,
        far: camera.far ?? 150,
        position: camera.position,
      }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
      }}
      onPointerMissed={onPointerMissed}
      onCreated={({ gl }) => {
        gl.toneMapping = ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
      }}
    >
      <SceneReadySignal onReady={onReady} />
      {children}
    </Canvas>
  )
}

export function SceneLighting({ warm = false }: { warm?: boolean }) {
  return (
    <>
      <hemisphereLight
        args={[warm ? '#ffe3bd' : '#d6ecf7', '#8a7a5a', warm ? 0.85 : 0.7]}
      />
      <ambientLight intensity={0.22} />
      <directionalLight
        castShadow
        position={[7, 11, 5]}
        intensity={warm ? 1.5 : 1.35}
        color={warm ? '#ffd9a4' : '#fff4e0'}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={45}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
        shadow-bias={-0.0008}
      />
    </>
  )
}
