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
const DAMP_LAMBDA = 4 // smoothing for keyframe damping

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

  const { size, viewport } = useThree()

  /* ---- Load GLB -------------------------------------------------- */
  const gltf = useGLTF('/models/hero.glb')
  const { actions, clips } = useAnimations(gltf.animations, gltf.scene)

  /* ---- Traverse meshes & disable frustum culling ------------------ */
  useEffect(() => {
    gltf.scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        obj.frustumCulled = false
      }
    })
  }, [gltf.scene])

  /* ---- Normalise model: bounding sphere diameter = 1 unit --------- */
  const { baseScale, offset, sphereDiameter } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(gltf.scene)
    const sphere = new THREE.Sphere()
    box.getBoundingSphere(sphere)

    const diameter = sphere.radius * 2
    const scale = diameter > 0 ? 1 / diameter : 1
    const center = sphere.center.clone()

    return {
      baseScale: scale,
      offset: center.negate(),
      sphereDiameter: diameter,
    }
  }, [gltf.scene])

  /* ---- Responsive fit size calculation --------------------------- */
  const { wFrac, hFrac } = useMemo(() => {
    if (size.width < 768) {
      return { wFrac: 0.92, hFrac: 0.45 }
    }
    if (size.width < 1024) {
      return { wFrac: 0.65, hFrac: 0.60 }
    }
    return { wFrac: 0.50, hFrac: 0.75 }
  }, [size.width])

  const fitSize = Math.min(viewport.width * wFrac, viewport.height * hFrac)

  /* ---- TEMPORARY DEBUG: log once on load -------------------------- */
  const hasLoggedDebug = useRef(false)
  useEffect(() => {
    if (!hasLoggedDebug.current && gltf.scene && sphereDiameter > 0) {
      hasLoggedDebug.current = true
      console.log('GLB loaded')
      console.log('model bounding-sphere diameter before normalising:', sphereDiameter)
      console.log('canvas client size:', { width: size.width, height: size.height })
      console.log('viewport width/height:', { width: viewport.width, height: viewport.height })
      console.log('computed fitSize:', fitSize)
    }
  }, [gltf.scene, sphereDiameter, size.width, size.height, viewport.width, viewport.height, fitSize])

  /* ---- Setup animation clips: reset.play() then pause ------------- */
  useEffect(() => {
    if (!clips.length) return
    clips.forEach((clip) => {
      const action = actions[clip.name]
      if (action) {
        action.reset().play()
        action.paused = true
      }
    })
  }, [actions, clips])

  /* ---- Window pointer listener for parallax ---------------------- */
  const pointerRef = useRef({ x: 0, y: 0 })
  useEffect(() => {
    if (reducedMotion) return

    const handlePointerMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 - 1
      pointerRef.current = {
        x: Math.max(-1, Math.min(1, x)),
        y: Math.max(-1, Math.min(1, y)),
      }
    }

    window.addEventListener('pointermove', handlePointerMove)
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [reducedMotion])

  /* ---- Per-frame updates ----------------------------------------- */
  useFrame((_state, delta) => {
    if (!groupRef.current) return

    const progress = scrollProgress ? scrollProgress.get() : 0
    const sampled = sampleKeyframes(progress)

    const isMobile = size.width < 768

    // Screen-normalised conversion to world units
    let targetX = sampled.position[0] * (viewport.width / 2)
    let targetY = sampled.position[1] * (viewport.height / 2)
    let targetZ = sampled.position[2]
    let targetScale = fitSize * sampled.scale

    if (isMobile) {
      targetX *= 0.25
      targetY += 0.18 * (viewport.height / 2)
      targetZ *= 0.5
      targetScale *= 0.85
    }

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
    const dampedScale = THREE.MathUtils.damp(currentScale, targetScale, DAMP_LAMBDA, delta)
    groupRef.current.scale.setScalar(dampedScale)

    /* Mouse-parallax from window pointermove */
    if (!reducedMotion) {
      const parallaxY = pointerRef.current.x * MAX_PARALLAX_RAD
      const parallaxX = -pointerRef.current.y * MAX_PARALLAX_RAD

      groupRef.current.rotation.x += parallaxX * PARALLAX_LERP
      groupRef.current.rotation.y += parallaxY * PARALLAX_LERP
    }

    /* Scrub animation clips across the runway */
    clips.forEach((clip) => {
      const action = actions[clip.name]
      if (action) {
        const targetTime = progress * clip.duration
        action.time += (targetTime - action.time) * 0.1
      }
    })
  })

  return (
    <group ref={groupRef}>
      <group
        ref={innerRef}
        position={[
          offset.x * baseScale,
          offset.y * baseScale,
          offset.z * baseScale,
        ]}
        scale={[baseScale, baseScale, baseScale]}
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
