import { useCallback, useEffect, useRef, useState } from 'react'

export type CameraStatus = 'idle' | 'requesting' | 'live' | 'denied' | 'unavailable' | 'error'

interface CameraState {
  status: CameraStatus
  error?: string
}

export function useCameraStream() {
  const [state, setState] = useState<CameraState>({ status: 'idle' })
  const streamRef = useRef<MediaStream | null>(null)

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setState({ status: 'idle' })
  }, [])

  const start = useCallback(async (): Promise<MediaStream | null> => {
    if (typeof navigator.mediaDevices?.getUserMedia !== 'function') {
      setState({ status: 'unavailable' })
      return null
    }

    setState({ status: 'requesting' })

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      })

      streamRef.current = stream
      setState({ status: 'live' })
      return stream
    } catch (error) {
      const denied =
        error instanceof DOMException &&
        (error.name === 'NotAllowedError' || error.name === 'SecurityError')

      setState({
        status: denied ? 'denied' : 'error',
        error: error instanceof Error ? error.message : undefined,
      })
      return null
    }
  }, [])

  useEffect(() => stop, [stop])

  return {
    status: state.status,
    error: state.error,
    stream: streamRef.current,
    start,
    stop,
  }
}
