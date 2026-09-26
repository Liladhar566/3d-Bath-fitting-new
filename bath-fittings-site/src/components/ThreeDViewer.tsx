import { Suspense, useSyncExternalStore } from 'react'
import { Canvas } from '@react-three/fiber'
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
      camera={{ position: [0, 0, 5], fov: 45 }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <HeroSceneContent reducedMotion={reducedMotion} />
      </Suspense>
    </Canvas>
  )
}
