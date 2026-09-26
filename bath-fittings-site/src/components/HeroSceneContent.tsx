import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

interface HeroSceneContentProps {
  reducedMotion: boolean
}

export default function HeroSceneContent({ reducedMotion }: HeroSceneContentProps) {
  const meshRef = useRef<Mesh>(null)

  useFrame((_state, delta) => {
    if (!reducedMotion && meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.3, 128, 32]} />
      <meshStandardMaterial color="#888888" />
    </mesh>
  )
}
