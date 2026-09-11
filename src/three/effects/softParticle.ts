import { CanvasTexture, SRGBColorSpace } from 'three'
import type { Texture } from 'three'

let cachedTexture: Texture | null = null

export function getSoftParticleTexture(): Texture {
  if (cachedTexture) return cachedTexture

  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')
  if (context) {
    const gradient = context.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    )
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.55)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    context.fillStyle = gradient
    context.fillRect(0, 0, size, size)
  }

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  cachedTexture = texture
  return texture
}
