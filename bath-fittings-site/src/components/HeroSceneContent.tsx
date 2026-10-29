import { useEffect, useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import type { Group } from 'three'
import type { MotionValue } from 'framer-motion'

/* ------------------------------------------------------------------ */
/*  PLAYBACK MODE — change to 'loop' to auto-play all clips instead   */
/* ------------------------------------------------------------------ */
export const PLAYBACK_MODE: 'scroll' | 'loop' = 'scroll'

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */
const MAX_PARALLAX_RAD = (4 * Math.PI) / 180 // ~4 degrees
const PARALLAX_LERP = 0.05
const SCROLL_LERP = 0.1

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

  /* ---- Load GLB -------------------------------------------------- */
  const gltf = useGLTF('/models/hero.glb')
  const { actions, clips } = useAnimations(gltf.animations, innerRef)

  /* ---- Smoothed time value for scroll-scrubbing ------------------- */
  const smoothTime = useRef(0)

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
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    console.log(
      `GLB bounding box size before scaling: x=${size.x.toFixed(3)}  y=${size.y.toFixed(3)}  z=${size.z.toFixed(3)}`
    )

    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = maxDim > 0 ? 3 / maxDim : 1

    return { scaleFactor: scale, offset: center.negate() }
  }, [gltf.scene])

  /* ---- Start / configure animations ------------------------------ */
  useEffect(() => {
    if (!clips.length) return

    if (PLAYBACK_MODE === 'scroll') {
      // Only use the first clip; pause it so we drive time manually
      const firstAction = actions[clips[0].name]
      if (firstAction) {
        firstAction.reset()
        firstAction.play()
        firstAction.paused = true
        firstAction.clampWhenFinished = true
      }
    } else {
      // Loop mode — play every clip
      Object.values(actions).forEach((action) => {
        if (action) {
          if (reducedMotion) {
            // Show first frame, don't play
            action.reset()
            action.play()
            action.paused = true
            action.time = 0
          } else {
            action.reset()
            action.setLoop(THREE.LoopRepeat, Infinity)
            action.play()
          }
        }
      })
    }
  }, [actions, clips, reducedMotion])

  /* ---- Per-frame updates ----------------------------------------- */
  useFrame((state) => {
    /* Mouse-parallax tilt on outer group */
    if (!reducedMotion && groupRef.current) {
      const cx = Math.max(-1, Math.min(1, state.pointer.x))
      const cy = Math.max(-1, Math.min(1, state.pointer.y))
      const targetY = cx * MAX_PARALLAX_RAD
      const targetX = -cy * MAX_PARALLAX_RAD

      groupRef.current.rotation.x +=
        (targetX - groupRef.current.rotation.x) * PARALLAX_LERP
      groupRef.current.rotation.y +=
        (targetY - groupRef.current.rotation.y) * PARALLAX_LERP
    }

    /* Scroll-scrubbing (only in scroll mode) */
    if (PLAYBACK_MODE === 'scroll' && clips.length > 0) {
      const clip = clips[0]
      const action = actions[clip.name]
      if (action && scrollProgress) {
        const target = scrollProgress.get() * clip.duration
        smoothTime.current += (target - smoothTime.current) * SCROLL_LERP
        action.time = smoothTime.current
      }
    }
  })

  return (
    <group ref={groupRef}>
      <group
        ref={innerRef}
        position={[offset.x * scaleFactor, offset.y * scaleFactor, offset.z * scaleFactor]}
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
