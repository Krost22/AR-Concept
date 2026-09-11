import { Color, MeshStandardMaterial } from 'three'

export const PALETTE = {
  stone: '#c9aa7b',
  stoneLight: '#dcc49a',
  stoneDark: '#a8895f',
  sand: '#dcc49c',
  grass: '#6d8c48',
  grassDark: '#587440',
  rock: '#8d7351',
  wood: '#6d4c30',
  woodDark: '#513a26',
  woodLight: '#8a6540',
  sail: '#f1e8d6',
  hull: '#5b4130',
  flagRed: '#a83a2c',
  flagDark: '#242730',
  waterDeep: '#17566f',
  waterShallow: '#3f8fa8',
  waterFoam: '#dcf0f5',
  whitewash: '#f4ecdc',
  warmWall: '#f0e6d4',
  roofTile: '#b4553c',
  gold: '#d9a94e',
  foliage: '#4f7a3d',
  foliageLight: '#6d9a50',
}

function standard(color: string, options: Partial<MeshStandardMaterial> = {}) {
  return new MeshStandardMaterial({
    color: new Color(color),
    roughness: 0.85,
    metalness: 0.02,
    flatShading: true,
    ...options,
  })
}

export const materials = {
  stone: standard(PALETTE.stone),
  stoneLight: standard(PALETTE.stoneLight),
  stoneDark: standard(PALETTE.stoneDark),
  sand: standard(PALETTE.sand, { flatShading: false }),
  grass: standard(PALETTE.grass, { roughness: 1 }),
  grassDark: standard(PALETTE.grassDark, { roughness: 1 }),
  rock: standard(PALETTE.rock),
  wood: standard(PALETTE.wood, { roughness: 0.7 }),
  woodDark: standard(PALETTE.woodDark, { roughness: 0.7 }),
  woodLight: standard(PALETTE.woodLight, { roughness: 0.7 }),
  sail: standard(PALETTE.sail, { roughness: 0.9, side: 2 }),
  hull: standard(PALETTE.hull, { roughness: 0.75 }),
  flagRed: standard(PALETTE.flagRed, { side: 2 }),
  flagDark: standard(PALETTE.flagDark, { side: 2 }),
  whitewash: standard(PALETTE.whitewash, { roughness: 0.95 }),
  roofTile: standard(PALETTE.roofTile, { roughness: 0.85 }),
  gold: standard(PALETTE.gold, { roughness: 0.4, metalness: 0.5, flatShading: false }),
  foliage: standard(PALETTE.foliage, { roughness: 1 }),
  foliageLight: standard(PALETTE.foliageLight, { roughness: 1 }),
  glass: standard('#2f4858', { roughness: 0.25, metalness: 0.25, flatShading: false }),
  shadow: standard('#4a4038', { roughness: 1, flatShading: false }),
}
