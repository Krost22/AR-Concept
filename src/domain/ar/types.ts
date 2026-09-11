import type { RefObject } from 'react'

export type ARRuntimeMode = 'webxr' | 'camera' | 'studio'

export type ARCapabilityStatus = 'checking' | 'webxr' | 'camera' | 'unsupported'

export interface ARCapabilities {
  status: ARCapabilityStatus
  webxr: boolean
  camera: boolean
  secureContext: boolean
  touch: boolean
  mobile: boolean
}

export type PlacementState = 'placing' | 'placed'

export interface SceneStatus {
  primaryActive: boolean
  label: string
  focusedInfoId: string | null
}

export type SceneCommandType =
  | 'primary-toggle'
  | 'replay'
  | 'reset'
  | 'focus-info'
  | 'clear-focus'

export interface SceneCommand {
  type: SceneCommandType
  payload?: string
  nonce: number
}

export interface SceneBridge {
  commands: RefObject<SceneCommand | null>
  onStatus: (status: SceneStatus) => void
}

export const INITIAL_SCENE_STATUS: SceneStatus = {
  primaryActive: false,
  label: 'Escena lista',
  focusedInfoId: null,
}
