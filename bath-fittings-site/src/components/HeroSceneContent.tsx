import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group, Mesh } from 'three'

interface HeroSceneContentProps {
  reducedMotion: boolean
}

// 5 degrees in radians for mouse-parallax clamp
const MAX_PARALLAX_RAD = (5 * Math.PI) / 180

export default function HeroSceneContent({ reducedMotion }: HeroSceneContentProps) {
  const groupRef = useRef<Group>(null)
  const torusRef = useRef<Mesh>(null)
  const capsuleRef = useRef<Mesh>(null)
  const sphere1Ref = useRef<Mesh>(null)
  const sphere2Ref = useRef<Mesh>(null)
  const sphere3Ref = useRef<Mesh>(null)

  useFrame((state, delta) => {
    // If reduced motion is requested, freeze all motion (render static)
    if (reducedMotion) return

    // Subtle mouse-parallax on the outer group
    if (groupRef.current) {
      const clampedX = Math.max(-1, Math.min(1, state.pointer.x))
      const clampedY = Math.max(-1, Math.min(1, state.pointer.y))

      const targetRotationY = clampedX * MAX_PARALLAX_RAD
      const targetRotationX = -clampedY * MAX_PARALLAX_RAD

      // Smooth lerp factor around 0.05 per frame
      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05
      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.05
    }

    // Torus rotation at a gentle pace
    if (torusRef.current) {
      torusRef.current.rotation.y += delta * 0.25
      torusRef.current.rotation.x += delta * 0.08
    }

    // Elongated capsule rotation on different axis/speed
    if (capsuleRef.current) {
      capsuleRef.current.rotation.x += delta * 0.35
      capsuleRef.current.rotation.z += delta * 0.18
    }

    // 3 small spheres bobbing up and down with sine wave easing and phase offsets
    const time = state.clock.getElapsedTime()
    if (sphere1Ref.current) {
      sphere1Ref.current.position.y = -1.2 + Math.sin(time * 1.5) * 0.12
    }
    if (sphere2Ref.current) {
      sphere2Ref.current.position.y = -1.35 + Math.sin(time * 1.9 + 1.4) * 0.15
    }
    if (sphere3Ref.current) {
      sphere3Ref.current.position.y = -1.15 + Math.sin(time * 1.3 + 2.8) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Primary Ring Element: Torus */}
      <mesh ref={torusRef} position={[0, 0.1, 0]}>
        <torusGeometry args={[1.2, 0.15, 32, 100]} />
        <meshStandardMaterial
          color="#E8E8E8"
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>

      {/* Thin Elongated Capsule: Diagonally near/through the torus */}
      <mesh
        ref={capsuleRef}
        position={[0.1, 0.05, 0]}
        rotation={[0.65, 0.35, 0.8]}
      >
        <capsuleGeometry args={[0.14, 2, 16, 32]} />
        <meshStandardMaterial
          color="#E8E8E8"
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>

      {/* Three Small Droplet Spheres near the base */}
      {/* Sphere 1: Left */}
      <mesh ref={sphere1Ref} position={[-0.8, -1.2, 0.3]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshPhysicalMaterial
          color="#e8f1f8"
          roughness={0.2}
          metalness={0.1}
          transmission={0.75}
          ior={1.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Sphere 2: Center */}
      <mesh ref={sphere2Ref} position={[0.05, -1.35, -0.15]}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshPhysicalMaterial
          color="#e8f1f8"
          roughness={0.2}
          metalness={0.1}
          transmission={0.75}
          ior={1.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Sphere 3: Right */}
      <mesh ref={sphere3Ref} position={[0.85, -1.15, 0.35]}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshPhysicalMaterial
          color="#e8f1f8"
          roughness={0.2}
          metalness={0.1}
          transmission={0.75}
          ior={1.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </group>
  )
}
