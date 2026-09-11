import type { MutableRefObject } from 'react'

import { clamp, easeInOutCubic, lerp } from '@/lib/math'
import { sampleWaveHeight } from '@/lib/waves'

export type CastlePhase = 'idle' | 'approach' | 'bombardment' | 'withdrawal'

export const CASTLE_PHASE_DURATIONS: Record<Exclude<CastlePhase, 'idle'>, number> = {
  approach: 9,
  bombardment: 15,
  withdrawal: 7,
}

export const CASTLE_PHASE_LABELS: Record<CastlePhase, string> = {
  idle: 'Aguas tranquilas',
  approach: 'La flota se aproxima',
  bombardment: 'Intercambio de cañonazos',
  withdrawal: 'La flota se retira',
}

export interface CastleTimeline {
  phase: CastlePhase
  elapsed: number
  worldTime: number
  cycle: number
  reducedMotion: boolean
}

export type CastleTimelineRef = MutableRefObject<CastleTimeline>

export interface ShipRoute {
  id: string
  startAngle: number
  stationAngle: number
  startRadius: number
  stationRadius: number
  delay: number
  size: number
  fireOffset: number
  flagColor: 'red' | 'dark'
}

export const SHIP_ROUTES: ShipRoute[] = [
  {
    id: 'nao',
    startAngle: 12,
    stationAngle: 18,
    startRadius: 19.8,
    stationRadius: 14.6,
    delay: 0,
    size: 1.12,
    fireOffset: 0.7,
    flagColor: 'red',
  },
  {
    id: 'fragata',
    startAngle: 45,
    stationAngle: 45,
    startRadius: 21.2,
    stationRadius: 15.6,
    delay: 1.5,
    size: 1.32,
    fireOffset: 1.9,
    flagColor: 'dark',
  },
  {
    id: 'goleta',
    startAngle: 82,
    stationAngle: 72,
    startRadius: 18.6,
    stationRadius: 14.2,
    delay: 2.8,
    size: 0.98,
    fireOffset: 3.1,
    flagColor: 'red',
  },
]

export interface ShipPose {
  position: [number, number, number]
  yaw: number
  roll: number
  pitch: number
  underway: number
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180
}

function polar(angleDegrees: number, radius: number) {
  const angle = toRadians(angleDegrees)
  return { x: Math.sin(angle) * radius, z: Math.cos(angle) * radius }
}

export function resolveShipPose(
  route: ShipRoute,
  phase: CastlePhase,
  elapsed: number,
  worldTime: number,
): ShipPose {
  const start = polar(route.startAngle, route.startRadius)
  const station = polar(route.stationAngle, route.stationRadius)

  let x = start.x
  let z = start.z
  let yaw = Math.atan2(-start.x, -start.z)
  let underway = 0

  if (phase === 'approach') {
    const progress = easeInOutCubic(
      clamp((elapsed - route.delay * 0.6) / (CASTLE_PHASE_DURATIONS.approach - route.delay), 0, 1),
    )
    x = lerp(start.x, station.x, progress)
    z = lerp(start.z, station.z, progress)
    yaw = Math.atan2(-x, -z) + Math.sin(progress * 10) * 0.04
    underway = 1
  } else if (phase === 'bombardment') {
    const drift = Math.sin(elapsed * 0.16 + route.delay) * 0.8
    x = station.x + Math.sin(toRadians(route.stationAngle)) * drift
    z = station.z + Math.cos(toRadians(route.stationAngle)) * drift
    yaw = Math.atan2(-x, -z) + Math.sin(elapsed * 0.14 + route.delay) * 0.05
  } else if (phase === 'withdrawal') {
    const progress = easeInOutCubic(
      clamp((elapsed - route.delay * 0.4) / CASTLE_PHASE_DURATIONS.withdrawal, 0, 1),
    )
    x = lerp(station.x, start.x, progress)
    z = lerp(station.z, start.z, progress)
    yaw = Math.atan2(-x, -z) + Math.sin(progress * 8) * 0.05
    underway = 1
  }

  const bob = sampleWaveHeight(x, z, worldTime) * 0.55
  const motionFactor = underway > 0 ? 1.6 : 1

  return {
    position: [x, 0.08 + bob, z],
    yaw,
    roll: Math.sin(worldTime * 1.15 + route.delay) * 0.05 * motionFactor,
    pitch: Math.cos(worldTime * 0.92 + route.delay * 1.7) * 0.028 * motionFactor,
    underway,
  }
}

export function fortVolleyTarget(route: ShipRoute): [number, number, number] {
  const station = polar(route.stationAngle, route.stationRadius)
  return [station.x, 1.4, station.z]
}

export function shipVolleyOrigin(route: ShipRoute): [number, number, number] {
  const station = polar(route.stationAngle, route.stationRadius)
  return [station.x, 1.1, station.z]
}
