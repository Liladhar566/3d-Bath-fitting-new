import { Suspense, useSyncExternalStore, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Html } from '@react-three/drei'
import type { MotionValue } from 'framer-motion'
import HeroSceneContent from '@/components/HeroSceneContent'

/* ------------------------------------------------------------------ */
/*  Reduced-motion media-query hook                                   */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  Responsive DPR hook                                               */
/* ------------------------------------------------------------------ */
const mobileQuery =
  typeof window !== 'undefined'
    ? window.matchMedia('(max-width: 767px)')
    : null

function subscribeMobile(callback: () => void) {
  mobileQuery?.addEventListener('change', callback)
  return () => mobileQuery?.removeEventListener('change', callback)
}

function getMobileSnapshot() {
  return mobileQuery?.matches ?? false
}

function useIsMobile() {
  return useSyncExternalStore(subscribeMobile, getMobileSnapshot, () => false)
}

/* ------------------------------------------------------------------ */
/*  Loading indicator (shown inside Canvas via drei Html)              */
/* ------------------------------------------------------------------ */
function LoadingIndicator() {
  return (
    <Html center>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          color: '#999',
          fontFamily: 'system-ui, sans-serif',
          fontSize: '13px',
          letterSpacing: '0.02em',
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          style={{ animation: 'spin 1.2s linear infinite' }}
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeDasharray="50 20"
            strokeLinecap="round"
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </svg>
        Loading 3D…
      </div>
    </Html>
  )
}

/* ------------------------------------------------------------------ */
/*  ThreeDViewer                                                      */
/* ------------------------------------------------------------------ */
interface ThreeDViewerProps {
  scrollProgress?: MotionValue<number>
  className?: string
}

export default function ThreeDViewer({ scrollProgress, className }: ThreeDViewerProps) {
  const reducedMotion = useReducedMotion()
  const isMobile = useIsMobile()

  const dpr: [number, number] = useMemo(
    () => (isMobile ? [1, 1.5] : [1, 2]),
    [isMobile]
  )

  return (
    <div
      className={`absolute inset-0 h-full w-full pointer-events-none ${className ?? ''}`}
      style={{ width: '100%', height: '100%' }}
    >
      <Canvas
        dpr={dpr}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 4], fov: 40 }}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
        frameloop="always"
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={<LoadingIndicator />}>
          <Environment preset="studio" />
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <HeroSceneContent
            reducedMotion={reducedMotion}
            scrollProgress={scrollProgress}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
