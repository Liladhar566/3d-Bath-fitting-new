import { useEffect, useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import type { Group } from 'three'
import type { MotionValue } from 'framer-motion'
import { heroKeyframes } from '@/config/heroChoreography'
import type { HeroKeyframe } from '@/config/heroChoreography'

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */
const MAX_PARALLAX_RAD = (2 * Math.PI) / 180 // 2 degrees max
const PARALLAX_LERP = 0.04
const DAMP_LAMBDA = 4 // smoothing for keyframe interpolation

/* ------------------------------------------------------------------ */
/*  Easing helper: cubic ease-in-out                                  */
/* ------------------------------------------------------------------ */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/* ------------------------------------------------------------------ */
/*  Keyframe sampler — find surrounding pair and interpolate           */
/* ------------------------------------------------------------------ */
function sampleKeyframes(progress: number): {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
} {
  const p = Math.max(0, Math.min(1, progress))

  // Before first keyframe
  if (p <= heroKeyframes[0].at) {
    const k = heroKeyframes[0]
    return { position: [...k.position], rotation: [...k.rotation], scale: k.scale }
  }

  // After last keyframe
  if (p >= heroKeyframes[heroKeyframes.length - 1].at) {
    const k = heroKeyframes[heroKeyframes.length - 1]
    return { position: [...k.position], rotation: [...k.rotation], scale: k.scale }
  }

  // Find surrounding pair
  let a: HeroKeyframe = heroKeyframes[0]
  let b: HeroKeyframe = heroKeyframes[1]
  for (let i = 0; i < heroKeyframes.length - 1; i++) {
    if (p >= heroKeyframes[i].at && p <= heroKeyframes[i + 1].at) {
      a = heroKeyframes[i]
      b = heroKeyframes[i + 1]
      break
    }
  }

  const segmentProgress = (p - a.at) / (b.at - a.at)
  const t = easeInOutCubic(segmentProgress)

  return {
    position: [
      a.position[0] + (b.position[0] - a.position[0]) * t,
      a.position[1] + (b.position[1] - a.position[1]) * t,
      a.position[2] + (b.position[2] - a.position[2]) * t,
    ],
    rotation: [
      a.rotation[0] + (b.rotation[0] - a.rotation[0]) * t,
      a.rotation[1] + (b.rotation[1] - a.rotation[1]) * t,
      a.rotation[2] + (b.rotation[2] - a.rotation[2]) * t,
    ],
    scale: a.scale + (b.scale - a.scale) * t,
  }
}

/* ------------------------------------------------------------------ */
/*  Props                                                             */
/* ------------------------------------------------------------------ */
interface HeroSceneContentProps {
  reducedMotion: boolean
  scrollProgress?: MotionValue<number>
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
export default function HeroSceneContent({
  reducedMotion,
  scrollProgress,
}: HeroSceneContentProps) {
  const groupRef = useRef<Group>(null)
  const innerRef = useRef<Group>(null)

  const { size } = useThree()
  const isMobileViewport = size.width < 768

  /* ---- Load GLB -------------------------------------------------- */
  const gltf = useGLTF('/models/hero.glb')
  const { actions, clips } = useAnimations(gltf.animations, innerRef)

  /* ---- Smoothed clip time for scroll-scrubbing -------------------- */
  const smoothClipTime = useRef(0)

  /* ---- Log clip names & durations once ----------------------------- */
  useEffect(() => {
    if (clips.length > 0) {
      console.log('=== GLB Animation Clips ===')
      clips.forEach((clip) => {
        console.log(`  "${clip.name}"  duration: ${clip.duration.toFixed(3)}s`)
      })
    } else {
      console.log('GLB has no animation clips.')
    }
  }, [clips])

  /* ---- Auto-fit: center + uniform scale to ~3 units --------------- */
  const { scaleFactor, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(gltf.scene)
    const boxSize = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    console.log(
      `GLB bounding box size before scaling: x=${boxSize.x.toFixed(3)}  y=${boxSize.y.toFixed(3)}  z=${boxSize.z.toFixed(3)}`
    )

    const maxDim = Math.max(boxSize.x, boxSize.y, boxSize.z)
    const s = maxDim > 0 ? 3 / maxDim : 1

    return { scaleFactor: s, offset: center.negate() }
  }, [gltf.scene])

  /* ---- Configure first animation clip as paused (scroll-driven) --- */
  useEffect(() => {
    if (!clips.length) return
    const firstAction = actions[clips[0].name]
    if (firstAction) {
      firstAction.reset()
      firstAction.play()
      firstAction.paused = true
      firstAction.clampWhenFinished = true
    }
  }, [actions, clips])

  /* ---- Per-frame updates ----------------------------------------- */
  useFrame((_state, delta) => {
    if (!groupRef.current) return

    const progress = scrollProgress ? scrollProgress.get() : 0
    const sampled = sampleKeyframes(progress)

    /* Apply the mobile x-position scaling */
    const mobileXScale = isMobileViewport ? 0.35 : 1
    const targetX = sampled.position[0] * mobileXScale
    const targetY = sampled.position[1]
    const targetZ = sampled.position[2]

    /* Damp position toward targets */
    groupRef.current.position.x = THREE.MathUtils.damp(
      groupRef.current.position.x, targetX, DAMP_LAMBDA, delta
    )
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y, targetY, DAMP_LAMBDA, delta
    )
    groupRef.current.position.z = THREE.MathUtils.damp(
      groupRef.current.position.z, targetZ, DAMP_LAMBDA, delta
    )

    /* Damp rotation toward targets */
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x, sampled.rotation[0], DAMP_LAMBDA, delta
    )
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y, sampled.rotation[1], DAMP_LAMBDA, delta
    )
    groupRef.current.rotation.z = THREE.MathUtils.damp(
      groupRef.current.rotation.z, sampled.rotation[2], DAMP_LAMBDA, delta
    )

    /* Damp uniform scale */
    const currentScale = groupRef.current.scale.x
    const dampedScale = THREE.MathUtils.damp(currentScale, sampled.scale, DAMP_LAMBDA, delta)
    groupRef.current.scale.setScalar(dampedScale)

    /* Mouse-parallax — very subtle additive rotation */
    if (!reducedMotion) {
      const cx = Math.max(-1, Math.min(1, _state.pointer.x))
      const cy = Math.max(-1, Math.min(1, _state.pointer.y))
      const parallaxY = cx * MAX_PARALLAX_RAD
      const parallaxX = -cy * MAX_PARALLAX_RAD

      groupRef.current.rotation.x += parallaxX * PARALLAX_LERP
      groupRef.current.rotation.y += parallaxY * PARALLAX_LERP
    }

    /* Scrub first animation clip across the full runway */
    if (clips.length > 0) {
      const clip = clips[0]
      const action = actions[clip.name]
      if (action) {
        const targetTime = progress * clip.duration
        smoothClipTime.current = THREE.MathUtils.damp(
          smoothClipTime.current, targetTime, DAMP_LAMBDA, delta
        )
        action.time = smoothClipTime.current
      }
    }
  })

  return (
    <group ref={groupRef}>
      <group
        ref={innerRef}
        position={[
          offset.x * scaleFactor,
          offset.y * scaleFactor,
          offset.z * scaleFactor,
        ]}
        scale={[scaleFactor, scaleFactor, scaleFactor]}
      >
        <primitive object={gltf.scene} />
      </group>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  Preload the model at module level for faster startup              */
/* ------------------------------------------------------------------ */
useGLTF.preload('/models/hero.glb')
