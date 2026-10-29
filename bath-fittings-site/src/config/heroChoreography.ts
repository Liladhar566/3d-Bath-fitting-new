import { siteConfig } from '@/config/site'

/* ====================================================================
   Hero Choreography — screen-normalised keyframes for scroll runway

   position : [x, y, z]
              x: fraction of half the viewport width  (worldX = x * viewport.width / 2)
              y: fraction of half the viewport height (worldY = y * viewport.height / 2)
              z: depth in world units
   rotation : Euler angles in radians [x, y, z]
   scale    : multiplier relative to the device-fitted size
   at       : normalised runway progress (0 = top, 1 = bottom)
   ==================================================================== */

export interface HeroKeyframe {
  at: number
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
}

export const heroKeyframes: HeroKeyframe[] = [
  { at: 0.00, position: [0.46, -0.04, 0],   rotation: [0.15, -0.6, 0],     scale: 0.9  },
  { at: 0.15, position: [0.46, 0, 0],       rotation: [0.2, -0.2, 0],      scale: 0.95 },
  { at: 0.30, position: [0, 0, 1.2],        rotation: [0.1, 0.9, 0.05],    scale: 1.25 },
  { at: 0.50, position: [-0.4, 0.09, 0.6],  rotation: [-0.15, 2.2, -0.1],  scale: 1.15 },
  { at: 0.70, position: [0.2, -0.09, -0.4], rotation: [0.3, 3.6, 0.1],    scale: 1.0  },
  { at: 0.88, position: [0, 0.05, 0.8],     rotation: [0.1, 6.283, 0],     scale: 1.1  },
  { at: 1.00, position: [0, 0.4, -1.5],     rotation: [0.1, 6.283, 0],     scale: 0.7  },
]

/* ====================================================================
   Hero Stages — scroll-anchored caption blocks (read from siteConfig
   so copy can be re-skinned per client).
   ==================================================================== */

export interface HeroStage {
  start: number
  end: number
  index: number
  title: string
  text: string
}

export const heroStages: HeroStage[] = siteConfig.hero.stages.map((s) => ({
  start: s.start,
  end: s.end,
  index: s.index,
  title: s.title,
  text: s.text,
}))
