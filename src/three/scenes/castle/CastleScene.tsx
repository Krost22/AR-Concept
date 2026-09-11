import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import type { SceneStatus } from '@/domain/ar/types'
import { SeaSurface } from '../../water/SeaSurface'
import type { SceneProps } from '../types'
import { useSceneCommands, useSceneStatus } from '../useSceneBridge'
import { CannonVolley } from './CannonVolley'
import { CastleFort } from './CastleFort'
import { PirateShip } from './PirateShip'
import type { CastlePhase, CastleTimeline } from './timeline'
import {
  CASTLE_PHASE_DURATIONS,
  CASTLE_PHASE_LABELS,
  SHIP_ROUTES,
  fortVolleyTarget,
  shipVolleyOrigin,
} from './timeline'

function startAttack(timeline: CastleTimeline, setPhase: (phase: CastlePhase) => void) {
  timeline.phase = 'approach'
  timeline.elapsed = 0
  setPhase('approach')
}

function stopAttack(timeline: CastleTimeline, setPhase: (phase: CastlePhase) => void) {
  timeline.phase = 'idle'
  timeline.elapsed = 0
  setPhase('idle')
}

export function CastleScene({ bridge }: SceneProps) {
  const reducedMotion = usePrefersReducedMotion()
  const [phase, setPhase] = useState<CastlePhase>('idle')
  const timelineRef = useRef<CastleTimeline>({
    phase: 'idle',
    elapsed: 0,
    worldTime: 0,
    cycle: 0,
    reducedMotion: false,
  })

  timelineRef.current.reducedMotion = reducedMotion

  useSceneCommands(bridge, (command) => {
    const timeline = timelineRef.current
    if (command.type === 'primary-toggle') {
      if (timeline.phase === 'idle') startAttack(timeline, setPhase)
      else stopAttack(timeline, setPhase)
    } else if (command.type === 'replay') {
      startAttack(timeline, setPhase)
    } else if (command.type === 'reset') {
      stopAttack(timeline, setPhase)
    }
  })

  useFrame((_, delta) => {
    const timeline = timelineRef.current
    timeline.worldTime += delta * (reducedMotion ? 0.35 : 1)

    if (timeline.phase === 'idle') return

    timeline.elapsed += delta * (reducedMotion ? 0.6 : 1)
    const duration = CASTLE_PHASE_DURATIONS[timeline.phase]
    if (timeline.elapsed < duration) return

    const next: CastlePhase =
      timeline.phase === 'approach'
        ? 'bombardment'
        : timeline.phase === 'bombardment'
          ? 'withdrawal'
          : 'idle'

    timeline.phase = next
    timeline.elapsed = 0
    if (next === 'idle') timeline.cycle += 1
    setPhase(next)
  })

  const status = useMemo<SceneStatus>(
    () => ({
      primaryActive: phase !== 'idle',
      label: CASTLE_PHASE_LABELS[phase],
      focusedInfoId: null,
    }),
    [phase],
  )

  useSceneStatus(bridge, status)

  return (
    <group>
      <SeaSurface size={80} segments={64} fadeStart={16} fadeEnd={30} />

      <CastleFort />

      {SHIP_ROUTES.map((route) => (
        <PirateShip key={route.id} route={route} phase={phase} timeline={timelineRef} />
      ))}

      {SHIP_ROUTES.map((route) => (
        <CannonVolley
          key={`ship-volley-${route.id}`}
          origin={shipVolleyOrigin(route)}
          target={[0, 3.4, 0]}
          timeline={timelineRef}
          fireOffset={route.fireOffset}
          interval={3}
          shots={5}
          arcHeight={2.2}
          travelTime={1.15}
          scale={0.9}
        />
      ))}

      <CannonVolley
        origin={[3.3, 3.6, 3.3]}
        target={fortVolleyTarget(SHIP_ROUTES[1])}
        timeline={timelineRef}
        fireOffset={1.4}
        interval={3.8}
        shots={4}
        arcHeight={1.8}
        travelTime={1.1}
        scale={0.85}
      />
    </group>
  )
}
