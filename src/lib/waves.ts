export const WAVE_LAYERS = [
  { amplitude: 0.16, frequency: 0.35, speed: 0.9, axis: 'x' as const },
  { amplitude: 0.14, frequency: 0.28, speed: -0.7, axis: 'z' as const },
  { amplitude: 0.1, frequency: 0.18, speed: 1.1, axis: 'diagonal' as const },
]

export function sampleWaveHeight(x: number, z: number, time: number): number {
  return (
    Math.sin(x * 0.35 + time * 0.9) * 0.16 +
    Math.sin(z * 0.28 - time * 0.7) * 0.14 +
    Math.sin((x + z) * 0.18 + time * 1.1) * 0.1
  )
}

export function sampleWaveSlope(x: number, z: number, time: number, epsilon = 0.4): { dx: number; dz: number } {
  const dx =
    (sampleWaveHeight(x + epsilon, z, time) - sampleWaveHeight(x - epsilon, z, time)) / (2 * epsilon)
  const dz =
    (sampleWaveHeight(x, z + epsilon, time) - sampleWaveHeight(x, z - epsilon, time)) / (2 * epsilon)
  return { dx, dz }
}
