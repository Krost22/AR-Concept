import type { SVGProps } from 'react'

import type { IconName } from '@/domain/experience/types'

const PATHS: Record<IconName, string[]> = {
  'arrow-left': ['M19 12H5', 'm12 19-7-7 7-7'],
  camera: [
    'M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z',
    'M12 13m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0',
  ],
  check: ['M20 6 9 17l-5-5'],
  'chevron-down': ['m6 9 6 6 6-6'],
  close: ['M18 6 6 18', 'm6 6 12 12'],
  compass: [
    'M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0',
    'm16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z',
  ],
  cube: ['m21 16-9 5-9-5V8l9-5 9 5v8z', 'm3 8 9 5 9-5', 'M12 21V13'],
  expand: ['M15 3h6v6', 'm21 3-7 7', 'm3 21 7-7', 'M9 21H3v-6'],
  history: [
    'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8',
    'M3 3v5h5',
    'M12 7v5l4 2',
  ],
  info: ['M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0', 'M12 16v-4', 'M12 8h.01'],
  layers: ['m12 2 9 5-9 5-9-5 9-5z', 'm3 12 9 5 9-5', 'm3 17 9 5 9-5'],
  'map-pin': [
    'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z',
    'M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0',
  ],
  move: [
    'M5 9l-3 3 3 3',
    'M9 5l3-3 3 3',
    'M15 19l-3 3-3-3',
    'M19 9l3 3-3 3',
    'M2 12h20',
    'M12 2v20',
  ],
  play: ['m6 3 14 9-14 9V3z'],
  restart: [
    'M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8',
    'M21 3v5h-5',
    'M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16',
    'M8 16H3v5',
  ],
  scale: ['M15 3h6v6', 'M9 21H3v-6', 'M21 3l-7 7', 'M3 21l7-7'],
  sliders: [
    'M21 4h-7',
    'M10 4H3',
    'M21 12h-9',
    'M8 12H3',
    'M21 20h-5',
    'M12 20H3',
    'M14 2v4',
    'M8 10v4',
    'M16 18v4',
  ],
  sparkle: [
    'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z',
    'M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z',
  ],
  stop: ['M7 7h10v10H7z'],
  warning: [
    'm21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3z',
    'M12 9v4',
    'M12 17h.01',
  ],
}

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName
  size?: number
  strokeWidth?: number
}

export function Icon({ name, size = 20, strokeWidth = 1.8, ...rest }: IconProps) {
  const paths = PATHS[name]
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths.map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  )
}
