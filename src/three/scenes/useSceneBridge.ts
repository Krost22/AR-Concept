import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

import type { SceneBridge, SceneCommand, SceneStatus } from '@/domain/ar/types'

export function useSceneCommands(bridge: SceneBridge, handler: (command: SceneCommand) => void) {
  const handlerRef = useRef(handler)
  const lastNonce = useRef(0)

  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useFrame(() => {
    const command = bridge.commands.current
    if (!command || command.nonce === lastNonce.current) return
    lastNonce.current = command.nonce
    handlerRef.current(command)
  })
}

export function useSceneStatus(bridge: SceneBridge, status: SceneStatus) {
  const lastSerialized = useRef<string | null>(null)

  useEffect(() => {
    const serialized = `${status.primaryActive}|${status.label}|${status.focusedInfoId ?? ''}`
    if (lastSerialized.current === serialized) return
    lastSerialized.current = serialized
    bridge.onStatus(status)
  }, [bridge, status])
}
