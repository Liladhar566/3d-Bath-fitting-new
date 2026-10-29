import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Group, Mesh, MeshPhysicalMaterial } from 'three'
import type { MotionValue } from 'framer-motion'

interface HeroSceneContentProps {
  reducedMotion: boolean
  scrollProgress?: MotionValue<number>
}

// 5 degrees in radians for subtle mouse-parallax clamp
const MAX_PARALLAX_RAD = (5 * Math.PI) / 180

// Custom GLSL shaders for the flowing water plane
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uColor;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    if (uOpacity <= 0.001) {
      discard;
    }

    vec2 st = vUv;
    float t = uTime * 4.2;

    // Vertical stream stripes
    float stripes = sin(st.x * 42.0 + sin(st.x * 20.0)) * 0.5 + 0.5;
    stripes = pow(stripes, 1.7);

    // Layered scrolling turbulence noise
    float n1 = noise(vec2(st.x * 12.0, st.y * 6.0 + t));
    float n2 = noise(vec2(st.x * 26.0 + 3.8, st.y * 13.0 + t * 1.35));
    float flowNoise = mix(n1, n2, 0.5);

    // Horizontal edge soft falloff
    float centerDist = abs(st.x - 0.5) * 2.0;
    float horizontalFade = smoothstep(1.0, 0.65, centerDist);

    // Vertical falloff: fade in at top nozzle, fade out softly at bottom
    float topFade = smoothstep(1.0, 0.88, st.y);
    float bottomFade = smoothstep(0.0, 0.22, st.y);
    float verticalFade = topFade * bottomFade;

    float streamIntensity = stripes * 0.68 + flowNoise * 0.32;
    float alpha = streamIntensity * horizontalFade * verticalFade * uOpacity * 0.85;

    gl_FragColor = vec4(uColor, alpha);
  }
`

export default function HeroSceneContent({
  reducedMotion,
  scrollProgress,
}: HeroSceneContentProps) {
  const groupRef = useRef<Group>(null)
  const assemblyRef = useRef<Group>(null)
  const leverPivotRef = useRef<Group>(null)
  const dropletsGroupRef = useRef<Group>(null)
  const dropletMaterialRef = useRef<MeshPhysicalMaterial>(null)

  // Droplet refs array
  const dropletRefs = useRef<(Mesh | null)[]>([])

  // Uniforms for the water shader plane
  const waterUniforms = useRef({
    uTime: { value: 0 },
    uOpacity: { value: 0 },
    uColor: { value: new THREE.Color('#d4e8fc') },
  })

  // 8 droplet accents with staggered positions and fall speeds
  const dropletsConfig = useMemo(
    () => [
      { x: -0.25, z: 0.08, startY: 0.55, speed: 2.2, resetY: -1.6, topY: 0.62 },
      { x: 0.16, z: -0.12, startY: 0.22, speed: 2.8, resetY: -1.65, topY: 0.65 },
      { x: -0.08, z: 0.2, startY: -0.12, speed: 2.0, resetY: -1.6, topY: 0.6 },
      { x: 0.3, z: 0.05, startY: -0.48, speed: 2.7, resetY: -1.7, topY: 0.64 },
      { x: -0.32, z: -0.07, startY: -0.82, speed: 2.4, resetY: -1.65, topY: 0.63 },
      { x: 0.05, z: 0.24, startY: -1.18, speed: 3.0, resetY: -1.6, topY: 0.66 },
      { x: -0.15, z: -0.18, startY: 0.38, speed: 2.1, resetY: -1.7, topY: 0.61 },
      { x: 0.22, z: -0.04, startY: -0.28, speed: 2.6, resetY: -1.65, topY: 0.65 },
    ],
    []
  )

  useFrame((state, delta) => {
    // 1. Mouse-parallax on the outer group (respecting reducedMotion)
    if (!reducedMotion && groupRef.current) {
      const clampedX = Math.max(-1, Math.min(1, state.pointer.x))
      const clampedY = Math.max(-1, Math.min(1, state.pointer.y))

      const targetRotationY = clampedX * MAX_PARALLAX_RAD
      const targetRotationX = -clampedY * MAX_PARALLAX_RAD

      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05
      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.05
    }

    // 2. Idle bobbing on the shower assembly (freezes if reducedMotion)
    if (assemblyRef.current) {
      if (!reducedMotion) {
        assemblyRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.2) * 0.02
      } else {
        assemblyRef.current.position.y = 0
      }
    }

    // 3. Scroll-driven response (always active regardless of reducedMotion)
    const rawProgress = scrollProgress ? scrollProgress.get() : 0
    const progress = Math.max(0, Math.min(1, rawProgress))

    // Lever rotation target: from 0 (closed) to Math.PI * 0.4 (open)
    const targetLeverAngle = progress * (Math.PI * 0.4)
    if (leverPivotRef.current) {
      leverPivotRef.current.rotation.z += (targetLeverAngle - leverPivotRef.current.rotation.z) * 0.09
    }

    // Water plane and droplet opacity lerped smoothly
    const currOpacity = waterUniforms.current.uOpacity.value
    const newOpacity = currOpacity + (progress - currOpacity) * 0.09
    waterUniforms.current.uOpacity.value = newOpacity

    // Update shader uTime for downward water flow
    waterUniforms.current.uTime.value += delta

    // Droplets visibility and opacity
    if (dropletMaterialRef.current) {
      dropletMaterialRef.current.opacity = newOpacity * 0.9
    }
    if (dropletsGroupRef.current) {
      dropletsGroupRef.current.visible = newOpacity > 0.01
    }

    // Droplets continuous fall animation (when active and not reducedMotion)
    if (newOpacity > 0.01 && !reducedMotion) {
      for (let i = 0; i < dropletsConfig.length; i++) {
        const mesh = dropletRefs.current[i]
        if (mesh) {
          mesh.position.y -= delta * dropletsConfig[i].speed
          if (mesh.position.y < dropletsConfig[i].resetY) {
            mesh.position.y = dropletsConfig[i].topY
          }
        }
      }
    }
  })

  return (
    <group ref={groupRef}>
      <group ref={assemblyRef}>
        {/* ============================================================ */}
        {/* A. WALL-MOUNT ARM                                             */}
        {/* ============================================================ */}
        {/* Wall escutcheon flange plate */}
        <mesh position={[-1.25, 0.9, -0.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 0.04, 32]} />
          <meshStandardMaterial
            color="#E8E8E8"
            metalness={0.9}
            roughness={0.25}
          />
        </mesh>

        {/* Horizontal shower arm pipe */}
        <mesh position={[-0.55, 0.9, -0.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.055, 0.055, 1.35, 32]} />
          <meshStandardMaterial
            color="#E8E8E8"
            metalness={0.9}
            roughness={0.25}
          />
        </mesh>

        {/* Arm elbow connection to shower head */}
        <mesh position={[0.1, 0.9, -0.2]}>
          <sphereGeometry args={[0.075, 24, 24]} />
          <meshStandardMaterial
            color="#E8E8E8"
            metalness={0.9}
            roughness={0.25}
          />
        </mesh>

        {/* Short vertical arm drop */}
        <mesh position={[0.1, 0.8, -0.1]}>
          <cylinderGeometry args={[0.055, 0.055, 0.22, 32]} />
          <meshStandardMaterial
            color="#E8E8E8"
            metalness={0.9}
            roughness={0.25}
          />
        </mesh>

        {/* ============================================================ */}
        {/* B. SHOWER HEAD (Wide, flattened disc angled downward)         */}
        {/* ============================================================ */}
        <group position={[0.1, 0.68, 0.0]} rotation={[0.26, 0.1, -0.06]}>
          {/* Swivel ball joint collar */}
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.09, 0.13, 0.09, 32]} />
            <meshStandardMaterial
              color="#E8E8E8"
              metalness={0.9}
              roughness={0.25}
            />
          </mesh>

          {/* Main wide disc body */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.82, 0.82, 0.06, 64]} />
            <meshStandardMaterial
              color="#E8E8E8"
              metalness={0.9}
              roughness={0.25}
            />
          </mesh>

          {/* Lower nozzle face plate */}
          <mesh position={[0, -0.035, 0]}>
            <cylinderGeometry args={[0.78, 0.78, 0.015, 64]} />
            <meshStandardMaterial
              color="#E0E0E0"
              metalness={0.88}
              roughness={0.3}
            />
          </mesh>
        </group>

        {/* ============================================================ */}
        {/* C. CONTROL VALVE & ROTATING LEVER                           */}
        {/* ============================================================ */}
        <group position={[-0.85, -0.15, 0.1]}>
          {/* Wall escutcheon plate for valve */}
          <mesh position={[0, 0, -0.12]}>
            <cylinderGeometry args={[0.22, 0.22, 0.03, 32]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial
              color="#E8E8E8"
              metalness={0.9}
              roughness={0.25}
            />
          </mesh>

          {/* Cylindrical valve body */}
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.22, 32]} />
            <meshStandardMaterial
              color="#E8E8E8"
              metalness={0.9}
              roughness={0.25}
            />
          </mesh>

          {/* Rotating lever assembly (pivots around Z) */}
          <group ref={leverPivotRef} position={[0, 0, 0.12]}>
            {/* Center pivot hub cap */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.06, 0.06, 0.04, 24]} />
              <meshStandardMaterial
                color="#E8E8E8"
                metalness={0.9}
                roughness={0.25}
              />
            </mesh>

            {/* Slim chrome lever handle (offset so pivot is at base) */}
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.4, 16]} />
              <meshStandardMaterial
                color="#E8E8E8"
                metalness={0.9}
                roughness={0.25}
              />
            </mesh>

            {/* Rounded lever handle tip */}
            <mesh position={[0, 0.4, 0]}>
              <sphereGeometry args={[0.035, 16, 16]} />
              <meshStandardMaterial
                color="#E8E8E8"
                metalness={0.9}
                roughness={0.25}
              />
            </mesh>
          </group>
        </group>

        {/* ============================================================ */}
        {/* D. WATER SPRAY EFFECT (ShaderMaterial plane beneath nozzle)   */}
        {/* ============================================================ */}
        <mesh position={[0.1, -0.42, 0.0]}>
          <planeGeometry args={[1.2, 2.1, 32, 32]} />
          <shaderMaterial
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={waterUniforms.current}
            transparent={true}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Crossed plane for depth and volumetric stream feel */}
        <mesh position={[0.1, -0.42, 0.0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[1.0, 2.1, 32, 32]} />
          <shaderMaterial
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={waterUniforms.current}
            transparent={true}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* ============================================================ */}
        {/* E. DROPLET ACCENTS (8 falling spheres)                       */}
        {/* ============================================================ */}
        <group ref={dropletsGroupRef} visible={false}>
          {dropletsConfig.map((drop, idx) => (
            <mesh
              key={idx}
              ref={(el) => {
                dropletRefs.current[idx] = el
              }}
              position={[0.1 + drop.x, drop.startY, drop.z]}
            >
              <sphereGeometry args={[0.048, 20, 20]} />
              <meshPhysicalMaterial
                ref={idx === 0 ? dropletMaterialRef : undefined}
                color="#d4e8fc"
                roughness={0.15}
                metalness={0.1}
                transmission={0.7}
                ior={1.45}
                transparent={true}
                opacity={0}
              />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  )
}
