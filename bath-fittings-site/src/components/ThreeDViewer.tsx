import { Suspense, useSyncExternalStore } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import HeroSceneContent from '@/components/HeroSceneContent'

const motionQuery =
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null

function subscribe(callback: () => void) {
  motionQuery?.addEventListener('change', callback)
  return () => motionQuery?.removeEventListener('change', callback)
}

function getSnapshot() {
  return motionQuery?.matches ?? false
}

function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}

export default function ThreeDViewer() {
  const reducedMotion = useReducedMotion()

  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true }}
      camera={{ position: [2.5, 1, 4], fov: 40 }}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
    >
      <Suspense fallback={null}>
        <Environment preset="studio" />
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <HeroSceneContent reducedMotion={reducedMotion} />
      </Suspense>
    </Canvas>
  )
}
