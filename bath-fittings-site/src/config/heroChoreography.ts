import { siteConfig } from '@/config/site'

/* ====================================================================
   Hero Choreography — keyframed camera/model poses for scroll runway

   position : world-space translation [x, y, z]
   rotation : Euler angles in radians  [x, y, z]
   scale    : uniform scale factor
   at       : normalised runway progress (0 = top, 1 = bottom)
   ==================================================================== */

export interface HeroKeyframe {
  at: number
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
}

export const heroKeyframes: HeroKeyframe[] = [
  { at: 0.0,  position: [1.8, -0.1, 0],    rotation: [0.15, -0.6, 0],     scale: 0.9  },
  { at: 0.15, position: [1.8, 0, 0],        rotation: [0.2, -0.2, 0],      scale: 0.95 },
  { at: 0.3,  position: [0, 0, 1.2],        rotation: [0.1, 0.9, 0.05],    scale: 1.35 },
  { at: 0.5,  position: [-1.6, 0.2, 0.6],   rotation: [-0.15, 2.2, -0.1],  scale: 1.2  },
  { at: 0.7,  position: [0.8, -0.2, -0.4],  rotation: [0.3, 3.6, 0.1],     scale: 1.0  },
  { at: 0.88, position: [0, 0.1, 0.8],      rotation: [0.1, 6.283, 0],     scale: 1.15 },
  { at: 1.0,  position: [0, 0.9, -1.5],     rotation: [0.1, 6.283, 0],     scale: 0.7  },
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

