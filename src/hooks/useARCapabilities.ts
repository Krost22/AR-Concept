import { useEffect, useState } from 'react'

import type { ARCapabilities, ARCapabilityStatus } from '@/domain/ar/types'
import { isMobileDevice, isTouchDevice } from '@/lib/device'

function initialCapabilities(): ARCapabilities {
  return {
    status: 'checking',
    webxr: false,
    camera: false,
    secureContext: typeof window !== 'undefined' ? window.isSecureContext : false,
    touch: isTouchDevice(),
    mobile: isMobileDevice(),
  }
}

export function useARCapabilities(): ARCapabilities {
  const [capabilities, setCapabilities] = useState<ARCapabilities>(initialCapabilities)

  useEffect(() => {
    let cancelled = false

    async function detect() {
      const secure = typeof window !== 'undefined' ? window.isSecureContext : false
      const camera = secure && typeof navigator.mediaDevices?.getUserMedia === 'function'

      let webxr = false
      if (secure && typeof navigator.xr?.isSessionSupported === 'function') {
        try {
          webxr = await navigator.xr.isSessionSupported('immersive-ar')
        } catch {
          webxr = false
        }
      }

      if (cancelled) return

      const status: ARCapabilityStatus = webxr ? 'webxr' : camera ? 'camera' : 'unsupported'
      setCapabilities({
        status,
        webxr,
        camera,
        secureContext: secure,
        touch: isTouchDevice(),
        mobile: isMobileDevice(),
      })
    }

    void detect()

    return () => {
      cancelled = true
    }
  }, [])

  return capabilities
}
