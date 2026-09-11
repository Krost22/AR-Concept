import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useNavigation } from '@/app/navigation/NavigationContext'
import { Button } from '@/components/ui/Button'
import { StateMessage } from '@/components/ui/Feedback'
import type {
  ARRuntimeMode,
  PlacementState,
  SceneBridge,
  SceneCommand,
  SceneStatus,
} from '@/domain/ar/types'
import { INITIAL_SCENE_STATUS } from '@/domain/ar/types'
import { getExperience } from '@/domain/experience/registry'
import type { ARControlDefinition, IconName } from '@/domain/experience/types'
import { useARCapabilities } from '@/hooks/useARCapabilities'
import { useCameraStream } from '@/hooks/useCameraStream'
import { ARHint, ARToolbar } from './components/ARToolbar'
import { ARTopBar } from './components/ARTopBar'
import { ARErrorOverlay, ARLoadingOverlay } from './components/AROverlays'
import { ARInfoSheet, ARSettingsSheet } from './components/ARSheets'
import { ARStartOverlay } from './components/ARStartOverlay'
import { CameraStage } from './stages/CameraStage'
import { StudioStage } from './stages/StudioStage'
import { WebXRStage } from './stages/WebXRStage'
import { endXRSession, xrStore } from './xr/xrStore'
import type { ARLaunchMode } from '@/app/navigation/screens'

interface ARScreenProps {
  experienceId: string
  initialMode?: ARLaunchMode
}

interface ARErrorState {
  title: string
  message: string
  allowRetry: boolean
}

const MODE_META: Record<ARRuntimeMode, { label: string; icon: IconName }> = {
  webxr: { label: 'Realidad aumentada', icon: 'sparkle' },
  camera: { label: 'Modo cámara', icon: 'camera' },
  studio: { label: 'Vista 3D', icon: 'cube' },
}

const INTERACTION_TIPS =
  'Arrastra para girar · Pellizca para acercar · Usa Ajustes para escalar o reubicar.'

export function ARScreen({ experienceId, initialMode = 'auto' }: ARScreenProps) {
  const { goHome } = useNavigation()
  const capabilities = useARCapabilities()
  const { start: startCamera, stop: stopCamera } = useCameraStream()
  const experience = getExperience(experienceId)

  const [started, setStarted] = useState(false)
  const [mode, setMode] = useState<ARRuntimeMode | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [sceneReady, setSceneReady] = useState(false)
  const [placement, setPlacement] = useState<PlacementState>('placing')
  const [userScale, setUserScale] = useState(experience?.ar.initialScale ?? 1)
  const [resetNonce, setResetNonce] = useState(0)
  const [sceneStatus, setSceneStatus] = useState<SceneStatus>(INITIAL_SCENE_STATUS)
  const [infoOpen, setInfoOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [error, setError] = useState<ARErrorState | null>(null)
  const [showTips, setShowTips] = useState(false)

  const commandsRef = useRef<SceneCommand | null>(null)
  const commandNonce = useRef(0)

  const bridge = useMemo<SceneBridge>(() => ({ commands: commandsRef, onStatus: setSceneStatus }), [])

  const sendCommand = useCallback((type: SceneCommand['type'], payload?: string) => {
    commandNonce.current += 1
    commandsRef.current = { type, payload, nonce: commandNonce.current }
  }, [])

  const handleExit = useCallback(() => {
    stopCamera()
    void endXRSession()
    goHome()
  }, [goHome, stopCamera])

  useEffect(() => () => {
    void endXRSession()
  }, [])

  useEffect(() => {
    if (!showTips) return
    const timer = window.setTimeout(() => setShowTips(false), 5500)
    return () => window.clearTimeout(timer)
  }, [showTips])

  useEffect(() => {
    if (sceneStatus.focusedInfoId) setInfoOpen(true)
  }, [sceneStatus.focusedInfoId])

  useEffect(() => {
    if (mode !== 'webxr') return
    const unsubscribe = xrStore.subscribe((state, previous) => {
      if (previous.session && !state.session) {
        setPlacement('placing')
        setResetNonce((value) => value + 1)
        setMode('studio')
      }
    })
    return unsubscribe
  }, [mode])

  const startExperience = useCallback(
    async (preferred: ARLaunchMode = 'auto') => {
      if (!experience) return
      const resolved: ARRuntimeMode =
        preferred !== 'auto'
          ? preferred
          : capabilities.status === 'webxr'
            ? 'webxr'
            : capabilities.status === 'camera'
              ? 'camera'
              : 'studio'

      setError(null)
      setStarted(true)
      setSceneReady(false)
      setMode(resolved)
      setPlacement(resolved === 'studio' ? 'placed' : 'placing')
      if (resolved === 'studio') setShowTips(true)

      if (resolved === 'webxr') {
        try {
          const session = await xrStore.enterAR()
          if (!session) {
            setError({
              title: 'No se pudo iniciar la realidad aumentada',
              message:
                'El navegador no completó la sesión AR. Puedes continuar explorando el modelo en 3D.',
              allowRetry: true,
            })
          }
        } catch (enterError) {
          setError({
            title: 'No se pudo iniciar la realidad aumentada',
            message:
              enterError instanceof Error
                ? enterError.message
                : 'Ocurrió un problema al abrir la cámara AR. Puedes continuar en 3D.',
            allowRetry: true,
          })
        }
        return
      }

      if (resolved === 'camera') {
        const mediaStream = await startCamera()
        if (mediaStream) {
          setStream(mediaStream)
        } else {
          setError({
            title: 'Sin acceso a la cámara',
            message:
              'Revisa los permisos de cámara del navegador. Mientras tanto, puedes explorar el modelo en 3D.',
            allowRetry: true,
          })
        }
      }
    },
    [capabilities.status, experience, startCamera],
  )

  const autoStarted = useRef(false)

  useEffect(() => {
    if (autoStarted.current || initialMode !== 'studio') return
    autoStarted.current = true
    void startExperience('studio')
  }, [initialMode, startExperience])

  const switchMode = useCallback(
    async (next: ARRuntimeMode) => {
      if (!experience || next === mode) return
      setSettingsOpen(false)
      setInfoOpen(false)
      setPlacement(next === 'studio' ? 'placed' : 'placing')
      setResetNonce((value) => value + 1)
      sendCommand('reset')

      if (next === 'studio') {
        stopCamera()
        setStream(null)
        void endXRSession()
        setMode('studio')
        setShowTips(true)
        return
      }

      if (next === 'camera') {
        const mediaStream = await startCamera()
        if (mediaStream) {
          setStream(mediaStream)
          setMode('camera')
        } else {
          setError({
            title: 'Sin acceso a la cámara',
            message: 'No pudimos activar la cámara. Continuamos en vista 3D.',
            allowRetry: true,
          })
        }
        return
      }

      setMode('webxr')
      try {
        await xrStore.enterAR()
      } catch {
        setError({
          title: 'No se pudo iniciar la realidad aumentada',
          message: 'El navegador no completó la sesión AR. Continuamos en vista 3D.',
          allowRetry: false,
        })
      }
    },
    [experience, mode, sendCommand, startCamera, stopCamera],
  )

  const handleReset = useCallback(() => {
    setUserScale(experience?.ar.initialScale ?? 1)
    setPlacement(mode === 'studio' ? 'placed' : 'placing')
    setShowTips(false)
    setInfoOpen(false)
    setSettingsOpen(false)
    setResetNonce((value) => value + 1)
    sendCommand('reset')
  }, [experience, mode, sendCommand])

  const handleControl = useCallback(
    (control: ARControlDefinition) => {
      switch (control.id) {
        case 'info':
          setInfoOpen(true)
          return
        case 'reset':
          handleReset()
          return
        case 'replay':
          sendCommand('replay')
          return
        case 'toggle-playback':
        case 'focus-points':
          sendCommand('primary-toggle')
          return
      }
    },
    [handleReset, sendCommand],
  )

  const handlePlacementChange = useCallback((state: PlacementState) => {
    setPlacement(state)
    if (state === 'placed') setShowTips(true)
  }, [])

  const handleErrorFallbackTo3D = useCallback(() => {
    stopCamera()
    setStream(null)
    void endXRSession()
    setError(null)
    setMode('studio')
    setPlacement('placed')
    setShowTips(true)
  }, [stopCamera])

  const controls = experience?.ar.controls ?? []
  const primaryControl = controls.find((control) => control.emphasis === 'primary')
  const secondaryControls = controls.filter((control) => control !== primaryControl)
  const modeMeta = mode ? MODE_META[mode] : MODE_META.studio
  const statusLabel = placement === 'placing' ? 'Colocando la escena' : sceneStatus.label

  const chrome = experience ? (
    <div className="ar-chrome">
      <ARTopBar
        title={experience.name}
        modeLabel={modeMeta.label}
        modeIcon={modeMeta.icon}
        statusLabel={statusLabel}
        onExit={handleExit}
        onOpenInfo={() => setInfoOpen(true)}
      />

      {placement === 'placing' ? (
        <ARHint icon="move" text={experience.ar.placementHint} />
      ) : showTips ? (
        <ARHint icon="sparkle" text={INTERACTION_TIPS} />
      ) : null}

      {placement === 'placed' && !error ? (
        <ARToolbar
          primary={primaryControl}
          secondary={secondaryControls}
          primaryActive={sceneStatus.primaryActive}
          onControl={handleControl}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      ) : null}

      <ARInfoSheet
        open={infoOpen}
        inline
        experience={experience}
        focusedInfoId={sceneStatus.focusedInfoId}
        onClose={() => {
          setInfoOpen(false)
          sendCommand('clear-focus')
        }}
        onSectionToggle={(sectionId) => sendCommand('focus-info', sectionId)}
      />

      <ARSettingsSheet
        open={settingsOpen}
        inline
        experience={experience}
        mode={mode ?? 'studio'}
        capabilities={capabilities}
        userScale={userScale}
        onScaleChange={setUserScale}
        onRelocate={() => {
          setSettingsOpen(false)
          setPlacement('placing')
          setResetNonce((value) => value + 1)
        }}
        onReset={handleReset}
        onSwitchMode={(next) => void switchMode(next)}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  ) : null

  if (!experience) {
    return (
      <main className="screen">
        <StateMessage
          tone="warning"
          icon="warning"
          title="Experiencia no encontrada"
          message="No pudimos cargar esta experiencia de realidad aumentada."
          actions={<Button onClick={goHome}>Volver al inicio</Button>}
        />
      </main>
    )
  }

  if (!started) {
    return (
      <main className="ar-screen">
        <ARStartOverlay
          experience={experience}
          capabilities={capabilities}
          onStart={() => void startExperience()}
          onStartStudio={() => void startExperience('studio')}
          onExit={handleExit}
        />
      </main>
    )
  }

  return (
    <main className="ar-screen">
      {mode === 'webxr' ? (
        <WebXRStage
          experience={experience}
          bridge={bridge}
          chrome={chrome}
          userScale={userScale}
          resetNonce={resetNonce}
          placement={placement}
          onPlacementChange={handlePlacementChange}
          onReady={() => setSceneReady(true)}
        />
      ) : mode === 'camera' ? (
        <CameraStage
          experience={experience}
          bridge={bridge}
          chrome={chrome}
          userScale={userScale}
          resetNonce={resetNonce}
          placement={placement}
          onPlacementChange={handlePlacementChange}
          onReady={() => setSceneReady(true)}
          stream={stream}
        />
      ) : (
        <StudioStage
          experience={experience}
          bridge={bridge}
          chrome={chrome}
          userScale={userScale}
          resetNonce={resetNonce}
          placement={placement}
          onPlacementChange={handlePlacementChange}
          onReady={() => setSceneReady(true)}
        />
      )}

      {!sceneReady && !error ? <ARLoadingOverlay label="Preparando la escena…" /> : null}

      {error ? (
        <ARErrorOverlay
          title={error.title}
          message={error.message}
          allowRetry={error.allowRetry}
          onRetry={() => void startExperience()}
          onFallbackTo3D={handleErrorFallbackTo3D}
          onExit={handleExit}
        />
      ) : null}
    </main>
  )
}
