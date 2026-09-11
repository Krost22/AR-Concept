import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, PlaneGeometry, ShaderMaterial } from 'three'

import { PALETTE } from '../materials'

interface SeaMaterialOptions {
  fadeStart?: number
  fadeEnd?: number
  opacity?: number
  waveScale?: number
}

export function createSeaMaterial(options: SeaMaterialOptions = {}) {
  const { fadeStart = 13, fadeEnd = 24, opacity = 1, waveScale = 1 } = options

  return new ShaderMaterial({
    transparent: true,
    depthWrite: true,
    uniforms: {
      uTime: { value: 0 },
      uDeep: { value: new Color(PALETTE.waterDeep) },
      uShallow: { value: new Color(PALETTE.waterShallow) },
      uFoam: { value: new Color(PALETTE.waterFoam) },
      uFadeStart: { value: fadeStart },
      uFadeEnd: { value: fadeEnd },
      uOpacity: { value: opacity },
      uWaveScale: { value: waveScale },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uWaveScale;
      varying float vHeight;
      varying vec2 vGround;

      float waveHeight(vec2 p, float t) {
        return sin(p.x * 0.35 + t * 0.9) * 0.16
          + sin(p.y * 0.28 - t * 0.7) * 0.14
          + sin((p.x + p.y) * 0.18 + t * 1.1) * 0.10;
      }

      void main() {
        vGround = position.xz;
        float height = waveHeight(position.xz, uTime) * uWaveScale;
        vHeight = height;
        vec3 displaced = position;
        displaced.y += height;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uDeep;
      uniform vec3 uShallow;
      uniform vec3 uFoam;
      uniform float uFadeStart;
      uniform float uFadeEnd;
      uniform float uOpacity;
      uniform float uTime;
      varying float vHeight;
      varying vec2 vGround;

      void main() {
        float depthMix = smoothstep(-0.22, 0.26, vHeight);
        vec3 color = mix(uDeep, uShallow, depthMix);
        float crest = smoothstep(0.12, 0.38, vHeight);
        color = mix(color, uFoam, crest * 0.38);
        color += vec3(1.0, 0.95, 0.82) * pow(crest, 3.0) * 0.08;
        float ripple = sin(vGround.x * 2.3 + uTime * 1.6) * sin(vGround.y * 2.1 - uTime * 1.2);
        color += ripple * 0.015;

        float distanceFromCenter = length(vGround);
        float fade = 1.0 - smoothstep(uFadeStart, uFadeEnd, distanceFromCenter);
        float alpha = fade * uOpacity;
        if (alpha < 0.02) discard;
        gl_FragColor = vec4(color, alpha);
      }
    `,
  })
}

interface SeaSurfaceProps {
  size?: number
  segments?: number
  fadeStart?: number
  fadeEnd?: number
  opacity?: number
  waveScale?: number
  positionY?: number
  speed?: number
}

export function SeaSurface({
  size = 64,
  segments = 72,
  fadeStart = 13,
  fadeEnd = 24,
  opacity = 1,
  waveScale = 1,
  positionY = 0,
  speed = 1,
}: SeaSurfaceProps) {
  const geometry = useMemo(() => {
    const plane = new PlaneGeometry(size, size, segments, segments)
    plane.rotateX(-Math.PI / 2)
    return plane
  }, [size, segments])

  const material = useMemo(
    () => createSeaMaterial({ fadeStart, fadeEnd, opacity, waveScale }),
    [fadeStart, fadeEnd, opacity, waveScale],
  )

  const time = useMemo(() => ({ value: 0 }), [])

  useFrame((_, delta) => {
    time.value += delta * speed
    material.uniforms.uTime.value = time.value
  })

  return <mesh geometry={geometry} material={material} position={[0, positionY, 0]} />
}
