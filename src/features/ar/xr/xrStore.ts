import { createXRStore } from '@react-three/xr'

const OVERLAY_ROOT_ID = 'ar-xr-overlay'

function createDomOverlayRoot(): Element | true {
  if (typeof document === 'undefined') return true
  const root = document.createElement('div')
  root.id = OVERLAY_ROOT_ID
  return root
}

export const xrStore = createXRStore({
  domOverlay: createDomOverlayRoot(),
  hitTest: true,
  planeDetection: false,
  meshDetection: false,
  anchors: false,
  handTracking: false,
  layers: false,
  depthSensing: false,
  offerSession: false,
  emulate: false,
})

export async function endXRSession() {
  const session = xrStore.getState().session
  if (!session) return
  try {
    await session.end()
  } catch {
    // La sesión ya pudo haber terminado; no es un error para la experiencia.
  }
}
